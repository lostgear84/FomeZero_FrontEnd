// Triagem inteligente: chama o modelo real de visão computacional (VCIA, EfficientNet-B0)
// pelo endpoint Gradio /triagem (contrato CT-08, esquema fomezero.vcia.v1).
// A foto não é guardada: só o resultado fica no navegador.

const STORAGE_URL = "fomezero.vcia.url.v1";
const STORAGE_TRIAGENS = "fomezero.triagens.v1";
const URL_PADRAO = import.meta.env.VITE_VCIA_URL || "http://127.0.0.1:7860";
const TIPOS_ACEITOS = ["image/jpeg", "image/png"];
const LIMITE_BYTES = 5 * 1024 * 1024;
const TEMPO_LIMITE_MS = 30000;

// Classes devolvidas pelo modelo (textos da VCIA, que nunca dizem "apto" ou "seguro").
export const CLASSE_DETERIORACAO =
  "sinais visuais de deterioração — sugestão: compostagem";

export const AVISO_TRIAGEM =
  "Apoio à triagem visual. A imagem não atesta que o alimento é seguro para consumo; a decisão é do doador e da vigilância sanitária.";

export function lerUrlVcia() {
  return localStorage.getItem(STORAGE_URL) || URL_PADRAO;
}

export function salvarUrlVcia(url) {
  const limpa = (url || "").trim().replace(/\/+$/, "");

  if (
    !/^https?:\/\/(127\.0\.0\.1|localhost):\d+$/.test(limpa) &&
    !/^https:\/\/[\w.-]+\.gradio\.live$/.test(limpa)
  ) {
    throw new Error(
      "Informe o endereço do app da VCIA (ex.: http://127.0.0.1:7860 ou o link https://xxxx.gradio.live).",
    );
  }

  localStorage.setItem(STORAGE_URL, limpa);
  return limpa;
}

// Confere tipo pela assinatura do arquivo, não só pela extensão.
async function validarImagem(arquivo) {
  if (!arquivo) {
    throw new Error("Selecione uma foto do alimento.");
  }

  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    throw new Error("Use uma foto JPEG ou PNG.");
  }

  if (arquivo.size > LIMITE_BYTES) {
    throw new Error("A foto deve ter até 5 MB.");
  }

  const cabecalho = new Uint8Array(await arquivo.slice(0, 8).arrayBuffer());
  const jpeg = cabecalho[0] === 0xff && cabecalho[1] === 0xd8 && cabecalho[2] === 0xff;
  const png =
    cabecalho[0] === 0x89 &&
    cabecalho[1] === 0x50 &&
    cabecalho[2] === 0x4e &&
    cabecalho[3] === 0x47;

  if (!jpeg && !png) {
    throw new Error("O arquivo não parece ser uma imagem JPEG ou PNG válida.");
  }
}

function comTempoLimite(promessa) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) =>
      setTimeout(
        () =>
          rejeitar(
            new Error("O serviço de triagem demorou mais de 30 s para responder."),
          ),
        TEMPO_LIMITE_MS,
      ),
    ),
  ]);
}

export async function analisarFoto(arquivo, url = lerUrlVcia()) {
  await validarImagem(arquivo);

  const { Client, handle_file: arquivoGradio } = await import("@gradio/client");
  let app;

  try {
    app = await comTempoLimite(Client.connect(url));
  } catch {
    throw new Error(
      `Não foi possível conectar ao serviço de triagem em ${url}. Verifique se o app da VCIA está rodando (python app/app.py).`,
    );
  }

  const retorno = await comTempoLimite(
    app.predict("/triagem", [arquivoGradio(arquivo)]),
  );
  const resultado = Array.isArray(retorno?.data) ? retorno.data[0] : null;

  if (resultado?.status === "erro") {
    throw new Error(resultado.erro?.mensagem || "O serviço de triagem recusou a foto.");
  }

  if (!resultado || resultado.esquema !== "fomezero.vcia.v1" || !resultado.condicao) {
    throw new Error("O serviço de triagem devolveu uma resposta fora do formato esperado.");
  }

  return resultado;
}

export function ehDeterioracao(resultado) {
  return resultado?.condicao?.classe === CLASSE_DETERIORACAO && !resultado.inconclusivo;
}

// Guarda só o resumo da triagem (sem a foto) para associar ao lote.
export function registrarTriagem(resultado, usuario) {
  const triagem = {
    id: crypto.randomUUID(),
    doador_id: usuario.id,
    criado_em: new Date().toISOString(),
    classe: resultado.condicao.classe,
    confianca: resultado.condicao.confianca,
    produto: resultado.produto?.rotulo || null,
    confianca_produto: resultado.produto?.confianca ?? null,
    inconclusivo: Boolean(resultado.inconclusivo),
    motivo_inconclusivo: resultado.motivo_inconclusivo || null,
    pede_confirmacao_humana: Boolean(resultado.pede_confirmacao_humana),
    texto_sugerido: resultado.texto_sugerido,
    modelo: resultado.modelo,
    simulado: Boolean(resultado.simulado),
  };

  let triagens;

  try {
    const lidas = JSON.parse(localStorage.getItem(STORAGE_TRIAGENS) || "[]");
    triagens = Array.isArray(lidas) ? lidas : [];
  } catch {
    triagens = [];
  }

  try {
    localStorage.setItem(STORAGE_TRIAGENS, JSON.stringify([...triagens, triagem]));
  } catch {
    // O resultado continua na tela mesmo se o histórico não puder ser salvo.
  }

  return triagem;
}
