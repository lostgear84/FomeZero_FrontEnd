// Registro local da entrega do lote de doação e envio para o robô da AIPA.
// Formato: CT-03 da AIPA ("modelo de aplicação" proposto pelo Erick v1.0, com os acréscimos
// confirmacao_entrega_texto, simulado, divergencias_informadas e triagem_visual). Vai na hora
// para o serviço local da AIPA ou, sem o serviço, pelo arquivo AIPA/entrada/lotes_entregues.json.

const STORAGE_KEY = "fomezero.entregas.v1";
const LIMITE_TEXTO = 1000;
const LIMITE_KG = 100000;

// Problemas que o beneficiário pode marcar. Qualquer um manda o lote para revisão humana (R11).
export const DIVERGENCIAS = [
  { codigo: "quantidade_menor", rotulo: "Chegou menos do que o cadastrado" },
  { codigo: "embalagem_danificada", rotulo: "Embalagem danificada ou avaria" },
  { codigo: "temperatura_inadequada", rotulo: "Chegou fora da temperatura esperada" },
  { codigo: "produto_diferente", rotulo: "Produto diferente do cadastrado" },
  { codigo: "outro", rotulo: "Outro problema (descreva no texto)" },
];
const CODIGOS_DIVERGENCIA = new Set(DIVERGENCIAS.map((item) => item.codigo));

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

  if (texto.length < 5) {
    throw new Error(
      "Escreva a confirmação da entrega, informando quantos kg chegaram e se houve algum problema.",
    );
  }

  if (texto.length > LIMITE_TEXTO) {
    throw new Error(`A confirmação deve ter até ${LIMITE_TEXTO} caracteres.`);
  }

  const kg = Number(String(dados.quantidade_recebida_kg ?? "").replace(",", "."));

  if (!Number.isFinite(kg) || kg <= 0 || kg > LIMITE_KG) {
    throw new Error("Informe quantos kg chegaram (número maior que zero).");
  }

  const divergencias = [...new Set(dados.divergencias || [])].filter((codigo) =>
    CODIGOS_DIVERGENCIA.has(codigo),
  );

  const entregas = lerEntregas();

  if (entregas.some((entrega) => entrega.lote_id === loteId)) {
    throw new Error(
      "A entrega deste lote já foi registrada neste navegador.",
    );
  }

  const entrega = {
    lote_id: loteId,
    beneficiario: { id: usuario.id },
    quantidade_recebida_kg: Math.round(kg * 1000) / 1000,
    divergencias_informadas: divergencias,
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

// Resumo da triagem por foto do cadastro (VCIA) que a AIPA usa na regra R10.
function triagemVisual(lote) {
  if (!lote.triagem) {
    return null;
  }

  const { classe, confianca, produto, inconclusivo, pede_confirmacao_humana, modelo } =
    lote.triagem;

  return {
    classe,
    confianca,
    produto,
    inconclusivo,
    pede_confirmacao_humana,
    modelo,
    destino: lote.destino || "doacao",
  };
}

// Lote entregue no formato CT-03 que o robô da AIPA lê. O kg recebido vai como o
// beneficiário informou; a IA da AIPA também extrai os kg do texto e confere os dois.
// Entregas antigas, sem o campo numérico, vão com null (a AIPA usa só o texto).
export function loteParaCt03(lote, entrega) {
  return {
    lote_id: lote.lote_id,
    doador_id: lote.doador.id,
    beneficiario_id: entrega.beneficiario.id,
    alimento_descricao: lote.alimento,
    quantidade_disponibilizada_kg: lote.quantidade_kg,
    quantidade_recebida_kg: entrega.quantidade_recebida_kg ?? null,
    quantidade_aproveitada_kg: null,
    status_logistico: "entregue",
    estado_termico: null,
    evento_atual: null,
    entrega_confirmada_em: entrega.entrega_confirmada_em,
    confirmacao_entrega_texto: entrega.confirmacao_entrega_texto,
    divergencias_informadas: entrega.divergencias_informadas || [],
    triagem_visual: triagemVisual(lote),
    doador_nome_ficticio: null,
    beneficiario_tipo: null,
    simulado: true,
  };
}

// Entregas deste navegador já no formato CT-03 (para o serviço ou para o arquivo).
export function entregasEmCt03(lotes) {
  const porLote = new Map(lotes.map((lote) => [lote.lote_id, lote]));

  return lerEntregas()
    .filter((entrega) => porLote.has(entrega.lote_id))
    .map((entrega) => loteParaCt03(porLote.get(entrega.lote_id), entrega));
}

// Arquivo alternativo para rodar o robô pela linha de comando (executar_robo.py).
export function gerarExportacaoAipa(lotes) {
  return {
    _aviso:
      "SIMULADO. Lotes de doação entregues, exportados pelo frontend FOMEZERO (dados fictícios do navegador). Formato CT-03 da AIPA.",
    gerado_em: new Date().toISOString(),
    lotes: entregasEmCt03(lotes),
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
