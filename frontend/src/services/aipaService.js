// Leitura dos resultados do robô da AIPA (contrato CT-04, arquivo saida/ct04/ct04_lotes.json).
// Os resultados ficam no navegador; nada é calculado aqui: pontos, Selo Verde ESG e
// CO₂ evitado vêm prontos da AIPA.

const STORAGE_KEY = "fomezero.aipa.ct04.v1";
const VERSOES_ACEITAS = ["ct04-v0"];
const LIMITE_ARQUIVO = 2 * 1024 * 1024;

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

  const statusValidos = ["processado", "revisao_humana", "falha"];
  const idsVistos = new Set();

  for (const lote of dados.lotes) {
    if (!lote || typeof lote !== "object") {
      throw new Error("O arquivo contém um lote inválido.");
    }

    if (typeof lote.lote_id !== "string" || !lote.lote_id.trim()) {
      throw new Error("Todo lote precisa informar o token lote_id.");
    }

    if (idsVistos.has(lote.lote_id)) {
      throw new Error(
        `O lote ${lote.lote_id} aparece mais de uma vez no arquivo.`,
      );
    }

    idsVistos.add(lote.lote_id);

    if (typeof lote.doador_id !== "string" || !lote.doador_id.trim()) {
      throw new Error(
        `O lote ${lote.lote_id} precisa informar o doador_id.`,
      );
    }

    if (!statusValidos.includes(lote.status)) {
      throw new Error(
        `O lote ${lote.lote_id} possui um status inválido: ${lote.status}.`,
      );
    }
  }

  return { ...dados, lotes: dados.lotes };
}

export async function importarArquivoCt04(arquivo) {
  if (!arquivo) {
    throw new Error("Selecione o arquivo ct04_lotes.json.");
  }

  if (arquivo.size > LIMITE_ARQUIVO) {
    throw new Error("Selecione um arquivo de até 2 MB.");
  }

  const dados = validarArquivoCt04(await arquivo.text());
  const registro = {
    importado_em: new Date().toISOString(),
    arquivo: arquivo.name,
    ...dados,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registro));
  } catch {
    throw new Error("Não foi possível salvar os resultados no navegador.");
  }

  return registro;
}

export function limparResultadosAipa() {
  localStorage.removeItem(STORAGE_KEY);
}

// Resumo do doador a partir dos lotes do CT-04.
// Prioridade: soma dos lotes processados individualmente.
// Fallback: campos acumulados enviados pela AIPA no lote processado mais recente.
export function resumoDoDoador(resultados, doadorId) {
  if (!resultados) {
    return null;
  }

  const lotes = resultados.lotes.filter((lote) => lote.doador_id === doadorId);
  const processados = lotes
    .filter((lote) => lote.status === "processado")
    .sort((a, b) => String(a.processado_em).localeCompare(String(b.processado_em)));
  const ultimo = processados[processados.length - 1] || null;

  const somaKg = processados.reduce(
    (soma, lote) => soma + (Number(lote.quantidade_recebida_kg) || 0),
    0,
  );

  const somaPontos = processados.reduce(
    (soma, lote) => soma + (Number(lote.pontos) || 0),
    0,
  );

  const somaCo2 = processados.reduce(
    (soma, lote) => soma + (Number(lote.co2_evitado_kg_co2eq) || 0),
    0,
  );

  const kgAcumulado =
    processados.length && somaKg > 0
      ? Math.round(somaKg * 100) / 100
      : ultimo
        ? ultimo.kg_acumulado_doador
        : null;

  const pontosAcumulados =
    processados.length && somaPontos > 0
      ? Math.round(somaPontos)
      : ultimo
        ? ultimo.pontos_acumulados_doador
        : null;

  return {
    lotes,
    processados: processados.length,
    emRevisao: lotes.filter((lote) => lote.status === "revisao_humana").length,
    comFalha: lotes.filter((lote) => lote.status === "falha").length,
    kgAcumulado,
    pontosAcumulados,
    selo: ultimo ? ultimo.selo_verde_esg : null,
    co2Estimado: processados.length ? Math.round(somaCo2 * 100) / 100 : null,
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
