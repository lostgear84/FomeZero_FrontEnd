import { listarLotes } from "./lotesService";

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

function extrairPalavras(texto) {
  return normalizar(texto).match(/[a-z0-9]+/g) || [];
}

const PALAVRAS_COMUNS = new Set([
  "preciso",
  "precisamos",
  "quero",
  "gostaria",
  "necessito",
  "necessitamos",
  "alimento",
  "alimentos",
  "comida",
  "doacao",
  "doacoes",
  "familia",
  "pessoas",
  "pessoa",
  "para",
  "por",
  "com",
  "sem",
  "uma",
  "uns",
  "umas",
  "tem",
  "ter",
  "que",
  "esta",
  "estao",
  "disponivel",
  "disponiveis",
  "encontrar",
  "buscar",
  "receber",
  "ajuda",
  "apoio",
]);

export function processarSolicitacao(texto) {
  const solicitacao = texto.trim();

  if (solicitacao.length < 5) {
    throw new Error("Descreva sua solicitação com pelo menos 5 caracteres.");
  }

  if (solicitacao.length > 1000) {
    throw new Error("Use no máximo 1000 caracteres na solicitação.");
  }

  const lotes = listarLotes();

  const palavrasSolicitacao = new Set(
    extrairPalavras(solicitacao).filter(
      (palavra) => palavra.length >= 3 && !PALAVRAS_COMUNS.has(palavra),
    ),
  );

  const correspondencias = lotes.filter((lote) => {
    const palavrasAlimento = extrairPalavras(lote.alimento);
    return palavrasAlimento.some((palavra) =>
      palavrasSolicitacao.has(palavra),
    );
  });

  if (lotes.length === 0) {
    return {
      mensagem:
        "Não há lotes cadastrados neste navegador para consultar. " +
        "A demonstração precisa de um cadastro fictício feito pela área do Doador.",
      lotes: [],
      acao: "Abrir consulta de lotes",
    };
  }

  if (correspondencias.length === 0) {
    return {
      mensagem:
        "Não encontrei correspondência direta entre as palavras da solicitação " +
        "e os nomes dos alimentos cadastrados. Isso não significa que sua " +
        "necessidade não possa ser atendida. Consulte a lista local ou tente " +
        "usar o nome do alimento como aparece no cadastro.",
      lotes: [],
      acao: "Consultar todos os lotes locais",
    };
  }

  return {
    mensagem:
      `Encontrei ${correspondencias.length} lote(s) com palavras em comum ` +
      "entre sua solicitação e o nome do alimento. Confira os registros abaixo. " +
      "A correspondência não avalia quantidade suficiente, restrições alimentares, " +
      "disponibilidade operacional ou segurança para consumo.",
    lotes: correspondencias,
    acao: "Abrir consulta de lotes",
  };
}
