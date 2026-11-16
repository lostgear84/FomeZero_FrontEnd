// Assistente de consulta da GENAI (RAG sobre o corpus de documentos oficiais da PLN).
// Contrato CT-02 (ct02-v0). Dois modos:
//  - simulado (padrão): as 10 respostas reais gravadas pela GENAI no Colab
//    (respostas_SIMULADO.json), para funcionar sem internet;
//  - integrado: chama o endpoint Gradio /consultar do notebook da GENAI pelo link
//    temporário do Colab. Se falhar, volta ao simulado com aviso.

import respostasSimuladas from "../data/genai_respostas_SIMULADO.json";

const LIMITE_PERGUNTA = 500;
const TEMPO_LIMITE_MS = 60000;
const STORAGE_URL = "fomezero.genai.url.v1";

export const PERGUNTAS_SUGERIDAS = respostasSimuladas.respostas.map(
  (item) => item.pergunta,
);

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function lerUrlIntegrada() {
  return localStorage.getItem(STORAGE_URL) || "";
}

export function salvarUrlIntegrada(url) {
  const limpa = url.trim();

  if (limpa && !/^https:\/\/[\w.-]+\.gradio\.live\/?$|^https?:\/\/(127\.0\.0\.1|localhost):\d+\/?$/.test(limpa)) {
    throw new Error(
      "Informe o link do Gradio mostrado no notebook da GENAI (ex.: https://xxxx.gradio.live).",
    );
  }

  if (limpa) {
    localStorage.setItem(STORAGE_URL, limpa);
  } else {
    localStorage.removeItem(STORAGE_URL);
  }

  return limpa;
}

function validarPergunta(pergunta) {
  const texto = (pergunta || "").trim();

  if (!texto) {
    throw new Error("Escreva uma pergunta.");
  }

  if (texto.length > LIMITE_PERGUNTA) {
    throw new Error(`A pergunta deve ter até ${LIMITE_PERGUNTA} caracteres.`);
  }

  return texto;
}

// Modo simulado: só responde às perguntas gravadas. Pergunta diferente recebe
// um aviso, sem resposta inventada.
export function consultarSimulado(pergunta) {
  const texto = validarPergunta(pergunta);
  const alvo = normalizar(texto);
  const achada = respostasSimuladas.respostas.find(
    (item) => normalizar(item.pergunta) === alvo,
  );

  if (!achada) {
    return {
      modo: "simulado",
      encontrada: false,
      resposta: null,
    };
  }

  return { modo: "simulado", encontrada: true, resposta: achada.resposta_ct02 };
}

function comTempoLimite(promessa) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) =>
      setTimeout(
        () => rejeitar(new Error("O assistente demorou mais de 60 s para responder.")),
        TEMPO_LIMITE_MS,
      ),
    ),
  ]);
}

export async function consultarIntegrado(pergunta, url) {
  const texto = validarPergunta(pergunta);
  const { Client } = await import("@gradio/client");
  const app = await comTempoLimite(Client.connect(url));
  const retorno = await comTempoLimite(
    app.predict("/consultar", [
      { versao: "ct02-v0", pergunta: texto, perfil: "doador", modo: "real" },
    ]),
  );
  const resposta = Array.isArray(retorno?.data) ? retorno.data[0] : null;

  if (!resposta || typeof resposta !== "object" || !resposta.status) {
    throw new Error("O assistente devolveu uma resposta fora do formato esperado.");
  }

  return { modo: "integrado", encontrada: true, resposta };
}
