// Registro local da entrega do lote de doação e exportação para o robô da AIPA.
// Formato de saída: CT-03 da AIPA ("modelo de aplicação" proposto pelo Erick v1.0, com os
// acréscimos confirmacao_entrega_texto e simulado). O robô lê o arquivo em
// AIPA/entrada/lotes_entregues.json.

import { listarLotes } from "./lotesService";

const STORAGE_KEY = "fomezero.entregas.v1";
const LIMITE_TEXTO = 1000;

function lerEntregas() {
  const texto = localStorage.getItem(STORAGE_KEY);

  if (!texto) {
    return [];
  }

  let entregas;

  try {
    entregas = JSON.parse(texto);
  } catch {
    throw new Error(
      "Não foi possível ler as entregas salvas. Os dados existentes não foram alterados.",
    );
  }

  if (!Array.isArray(entregas)) {
    throw new Error(
      "O armazenamento das entregas está inválido. Os dados existentes não foram alterados.",
    );
  }

  return entregas;
}

export function listarEntregas() {
  return lerEntregas();
}

export function entregaDoLote(loteId) {
  return lerEntregas().find((entrega) => entrega.lote_id === loteId) || null;
}

// Mascara e-mail, CPF e telefone antes de salvar: o texto é livre e não deve
// carregar dado pessoal (o robô da AIPA também mascara na fila de revisão).
export function mascararDadosPessoais(texto) {
  return texto
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[EMAIL]")
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF]")
    .replace(/(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}\b/g, "[TELEFONE]");
}

export function registrarEntrega(dados, usuario) {
  if (!usuario || usuario.perfil !== "beneficiario") {
    throw new Error(
      "Somente uma conta do tipo Beneficiário pode registrar a entrega.",
    );
  }

  const loteId = (dados.lote_id || "").trim();
  const texto = mascararDadosPessoais((dados.confirmacao || "").trim());

  if (!loteId) {
    throw new Error("Selecione o lote de doação entregue.");
  }

  const lote = listarLotes().find((item) => item.lote_id === loteId);

  if (!lote) {
    throw new Error(
      "O lote informado não foi encontrado. Selecione um lote disponível.",
    );
  }

  if (texto.length < 5) {
    throw new Error(
      "Escreva a confirmação da entrega, informando quantos kg chegaram e se houve algum problema.",
    );
  }

  if (texto.length > LIMITE_TEXTO) {
    throw new Error(`A confirmação deve ter até ${LIMITE_TEXTO} caracteres.`);
  }

  const entregas = lerEntregas();

  if (entregas.some((entrega) => entrega.lote_id === loteId)) {
    throw new Error(
      "A entrega deste lote já foi registrada neste navegador.",
    );
  }

  const entrega = {
    lote_id: lote.lote_id,
    beneficiario: { id: usuario.id },
    confirmacao_entrega_texto: texto,
    entrega_confirmada_em: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...entregas, entrega]));
  } catch {
    throw new Error(
      "Não foi possível salvar a entrega no navegador. Verifique o espaço e as permissões de armazenamento.",
    );
  }

  return entrega;
}

// Monta o arquivo que o robô da AIPA lê. A quantidade recebida vai como null de
// propósito: quem extrai os kg do texto do beneficiário é a IA da AIPA.
// A exportação inclui somente as entregas registradas pelo Beneficiário autenticado.
export function gerarExportacaoAipa(lotes, beneficiarioId) {
  const porLote = new Map(lotes.map((lote) => [lote.lote_id, lote]));

  const exportados = lerEntregas()
    .filter(
      (entrega) =>
        entrega.beneficiario.id === beneficiarioId &&
        porLote.has(entrega.lote_id),
    )
    .map((entrega) => {
      const lote = porLote.get(entrega.lote_id);

      return {
        lote_id: lote.lote_id,
        doador_id: lote.doador.id,
        beneficiario_id: entrega.beneficiario.id,
        alimento_descricao: lote.alimento,
        quantidade_disponibilizada_kg: lote.quantidade_kg,
        quantidade_recebida_kg: null,
        quantidade_aproveitada_kg: null,
        status_logistico: "entregue",
        estado_termico: null,
        evento_atual: null,
        entrega_confirmada_em: entrega.entrega_confirmada_em,
        confirmacao_entrega_texto: entrega.confirmacao_entrega_texto,
        doador_nome_ficticio: null,
        beneficiario_tipo: null,
        simulado: true,
      };
    });

  return {
    _aviso:
      "SIMULADO. Lotes de doação entregues, exportados pelo frontend FOMEZERO (dados fictícios do navegador). Formato CT-03 da AIPA.",
    gerado_em: new Date().toISOString(),
    lotes: exportados,
  };
}

export function baixarJson(nomeArquivo, conteudo) {
  const blob = new Blob([JSON.stringify(conteudo, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
