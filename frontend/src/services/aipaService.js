// Resultados do robô da AIPA (contrato CT-04). Dois caminhos:
//  - serviço local (padrão): a entrega confirmada vai na hora para o servico_aipa.py
//    (POST /api/lotes), que roda o robô completo e devolve o CT-04;
//  - arquivo: importar saida/ct04/ct04_lotes.json gerado pelo executar_robo.py.
// Os resultados ficam no navegador; nada é calculado aqui: pontos, Selo Verde ESG e
// CO₂ evitado vêm prontos da AIPA.

const STORAGE_KEY = "fomezero.aipa.ct04.v1";
const STORAGE_URL = "fomezero.aipa.url.v1";
const URL_PADRAO = import.meta.env.VITE_AIPA_URL || "http://127.0.0.1:5070";
const VERSOES_ACEITAS = ["ct04-v0"];
const LIMITE_ARQUIVO = 2 * 1024 * 1024;
const TEMPO_LIMITE_MS = 120000;
const ORIGEM_SERVICO = "serviço local da AIPA";

// Motivos do CT-04 em linguagem simples. Código desconhecido aparece como veio.
const ROTULO_MOTIVO = {
  ocorrencia_avaria: "possível avaria informada na confirmação",
  ocorrencia_divergencia_quantidade: "possível diferença entre o cadastrado e o recebido",
  ocorrencia_problema_temperatura: "possível problema de temperatura informado",
  ocorrencia_ilegivel_outro: "confirmação pouco clara",
  baixa_confianca: "a IA não teve confiança suficiente para seguir sozinha",
  divergencia_kg: "kg recebidos diferentes do cadastrado (ou do escrito na confirmação)",
  alerta_iot_quebra_cadeia_frio: "alerta de quebra da cadeia de frio no transporte (IoT)",
  dados_iot_indisponiveis: "dados da IoT indisponíveis",
  evento_iot_desconhecido: "evento da IoT não reconhecido",
  modelo_indisponivel: "modelo de IA indisponível",
  sem_confirmacao: "sem confirmação dos kg recebidos",
  lote_alterado_apos_processamento: "o lote mudou depois de processado",
  triagem_visual_pede_avaliacao: "a triagem por foto do cadastro pediu avaliação pessoal",
  triagem_visual_deterioracao: "a triagem por foto do cadastro viu sinais de deterioração",
  divergencia_informada_beneficiario: "o beneficiário marcou um problema na entrega",
  portal_indisponivel: "portal parceiro (simulado) fora do ar; será retomado",
  dado_invalido: "dado do lote inválido",
  reprovado_na_revisao: "reprovado na revisão humana",
};

export function motivoLegivel(codigo) {
  const base = String(codigo).split(":")[0];
  return ROTULO_MOTIVO[codigo] || ROTULO_MOTIVO[base] || codigo;
}

export function lerUrlAipa() {
  return localStorage.getItem(STORAGE_URL) || URL_PADRAO;
}

export function salvarUrlAipa(url) {
  const limpa = (url || "").trim().replace(/\/+$/, "");

  if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(limpa)) {
    throw new Error(
      "Informe o endereço do serviço da AIPA neste computador (ex.: http://127.0.0.1:5070).",
    );
  }

  localStorage.setItem(STORAGE_URL, limpa);
  return limpa;
}

export function urlTermo(loteId, url = lerUrlAipa()) {
  return `${url}/api/termos/${encodeURIComponent(loteId)}`;
}

export const FAIXAS_SELO = [
  { selo: "Bronze", kg: 50 },
  { selo: "Prata", kg: 200 },
  { selo: "Ouro", kg: 500 },
];

export function lerResultadosAipa() {
  const texto = localStorage.getItem(STORAGE_KEY);

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

export function validarArquivoCt04(texto) {
  let dados;

  try {
    dados = JSON.parse(texto);
  } catch {
    throw new Error("O arquivo não é um JSON válido.");
  }

  if (!dados || !VERSOES_ACEITAS.includes(dados.versao_contrato)) {
    throw new Error(
      "Arquivo fora do contrato esperado (versao_contrato ct04-v0). Use saida/ct04/ct04_lotes.json do robô da AIPA.",
    );
  }

  if (!Array.isArray(dados.lotes)) {
    throw new Error("O arquivo não traz a lista de lotes.");
  }

  const lotes = dados.lotes.filter(
    (lote) => lote && typeof lote.lote_id === "string" && lote.status,
  );

  return { ...dados, lotes };
}

export async function importarArquivoCt04(arquivo) {
  if (!arquivo) {
    throw new Error("Selecione o arquivo ct04_lotes.json.");
  }

  if (arquivo.size > LIMITE_ARQUIVO) {
    throw new Error("Selecione um arquivo de até 2 MB.");
  }

  const dados = validarArquivoCt04(await arquivo.text());
  return salvarRegistro({
    importado_em: new Date().toISOString(),
    arquivo: arquivo.name,
    ...dados,
  });
}

function salvarRegistro(registro) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registro));
  } catch {
    throw new Error("Não foi possível salvar os resultados no navegador.");
  }

  return registro;
}

async function chamarServico(caminho, opcoes = {}, url = lerUrlAipa()) {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  let resposta;

  try {
    resposta = await fetch(`${url}${caminho}`, { ...opcoes, signal: controle.signal });
  } catch {
    throw new Error(
      `Serviço da AIPA indisponível em ${url}. Inicie-o com "python servico_aipa.py" na pasta da AIPA.`,
    );
  } finally {
    clearTimeout(relogio);
  }

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(
      corpo?.mensagem || `O serviço da AIPA respondeu com erro ${resposta.status}.`,
    );
  }

  return corpo;
}

// Envia lotes entregues (CT-03) e guarda os CT-04 devolvidos junto dos já existentes.
export async function processarNaAipa(lotesCt03, url = lerUrlAipa()) {
  const corpo = await chamarServico(
    "/api/lotes",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotes: lotesCt03 }),
    },
    url,
  );
  const devolvidos = (corpo?.lotes || []).filter(
    (lote) => lote && VERSOES_ACEITAS.includes(lote.versao_contrato) && lote.status,
  );

  if (devolvidos.length === 0) {
    throw new Error("O serviço da AIPA devolveu uma resposta fora do contrato CT-04.");
  }

  devolvidos.forEach((lote) => guardarLoteDevolvido(lote, url));
  return devolvidos;
}

// Lê todos os CT-04 do serviço (por exemplo, depois de uma decisão de revisão humana).
export async function atualizarDaAipa(url = lerUrlAipa()) {
  const corpo = await chamarServico("/api/resultados", {}, url);
  const dados = validarArquivoCt04(JSON.stringify(corpo));

  return salvarRegistro({
    importado_em: new Date().toISOString(),
    arquivo: ORIGEM_SERVICO,
    servico_url: url,
    ...dados,
  });
}

function guardarLoteDevolvido(lote, url) {
  const atual = lerResultadosAipa();
  const porId = new Map((atual?.lotes || []).map((item) => [item.lote_id, item]));
  porId.set(lote.lote_id, lote);

  return salvarRegistro({
    importado_em: new Date().toISOString(),
    arquivo: ORIGEM_SERVICO,
    servico_url: url,
    versao_contrato: "ct04-v0",
    simulado: true,
    lotes: [...porId.values()],
  });
}

// Fila de revisão humana do robô (texto da confirmação já vem mascarado pela AIPA).
export async function listarFilaRevisao(url = lerUrlAipa()) {
  const corpo = await chamarServico("/api/revisao", {}, url);

  if (!Array.isArray(corpo?.lotes)) {
    throw new Error("O serviço da AIPA devolveu a fila fora do formato esperado.");
  }

  return corpo.lotes;
}

// Código do revisor: derivado da conta, nunca o nome (a AIPA grava só o código).
export function codigoRevisor(usuario) {
  return `OP-${String(usuario.id).replace(/[^A-Za-z0-9]/g, "").slice(0, 8)}`;
}

export async function decidirRevisao(loteId, { decisao, kgAprovado, revisor }, url = lerUrlAipa()) {
  const corpo = await chamarServico(
    `/api/revisao/${encodeURIComponent(loteId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisao, kg_aprovado: kgAprovado, revisor }),
    },
    url,
  );

  if (!corpo?.lote || !VERSOES_ACEITAS.includes(corpo.lote.versao_contrato)) {
    throw new Error("O serviço da AIPA devolveu uma resposta fora do contrato CT-04.");
  }

  guardarLoteDevolvido(corpo.lote, url);
  return corpo.lote;
}

// Situação em linguagem simples, considerando a decisão humana.
export function rotuloSituacao(lote) {
  const situacao = lote?.revisao?.situacao;

  if (lote?.status === "processado") {
    return situacao === "aprovado"
      ? "Aprovado na revisão humana e processado pela AIPA"
      : "Processado pela AIPA";
  }

  if (lote?.status === "revisao_humana") {
    return situacao === "reprovado" ? "Reprovado na revisão humana" : "Em revisão humana";
  }

  return lote?.status === "falha" ? "Falha no processamento" : lote?.status || "";
}

export function resultadoDoLote(resultados, loteId) {
  return resultados?.lotes?.find((lote) => lote.lote_id === loteId) || null;
}

export function limparResultadosAipa() {
  localStorage.removeItem(STORAGE_KEY);
}

// Resumo do doador a partir dos lotes do CT-04. Usa o acumulado que a AIPA
// calculou no lote processado mais recente; sem lote processado, fica null.
export function resumoDoDoador(resultados, doadorId) {
  if (!resultados) {
    return null;
  }

  const lotes = resultados.lotes.filter((lote) => lote.doador_id === doadorId);
  const processados = lotes
    .filter((lote) => lote.status === "processado")
    .sort((a, b) => String(a.processado_em).localeCompare(String(b.processado_em)));
  const ultimo = processados[processados.length - 1] || null;
  const co2 = processados.reduce(
    (soma, lote) => soma + (Number(lote.co2_evitado_kg_co2eq) || 0),
    0,
  );

  return {
    lotes,
    processados: processados.length,
    emRevisao: lotes.filter((lote) => lote.status === "revisao_humana").length,
    comFalha: lotes.filter((lote) => lote.status === "falha").length,
    kgAcumulado: ultimo ? ultimo.kg_acumulado_doador : null,
    pontosAcumulados: ultimo ? ultimo.pontos_acumulados_doador : null,
    selo: ultimo ? ultimo.selo_verde_esg : null,
    co2Estimado: processados.length ? Math.round(co2 * 100) / 100 : null,
    metodologia: ultimo ? ultimo.metodologia_carbono : null,
  };
}

export function proximoSelo(kgAcumulado) {
  if (kgAcumulado === null || kgAcumulado === undefined) {
    return null;
  }

  const proxima = FAIXAS_SELO.find((faixa) => kgAcumulado < faixa.kg);

  if (!proxima) {
    return { selo: null, faltamKg: 0, percentual: 100 };
  }

  const indice = FAIXAS_SELO.indexOf(proxima);
  const base = indice === 0 ? 0 : FAIXAS_SELO[indice - 1].kg;
  const percentual = Math.max(
    0,
    Math.min(100, ((kgAcumulado - base) / (proxima.kg - base)) * 100),
  );

  return {
    selo: proxima.selo,
    faltamKg: Math.round((proxima.kg - kgAcumulado) * 100) / 100,
    percentual: Math.round(percentual),
  };
}
