const BASE = "fomezero/gs2026/rm564896/lote/";
const DISPOSITIVO = "esp32-caixa-01";
const LOTE = "LOTE-2026-0001";

export function interpretarLogIot(texto, lotes) {
  const registros = [];
  const vistos = new Set();
  let ignorados = 0;
  let duplicados = 0;

  for (const [indice, linhaOriginal] of texto.split(/\r?\n/).entries()) {
    const linha = linhaOriginal.trim();
    if (!linha) continue;

    const separador = linha.search(/\s/);
    if (separador < 0) {
      throw new Error(`Linha ${indice + 1}: esperado tópico seguido de JSON.`);
    }

    const topico = linha.slice(0, separador);
    let mensagem;

    try {
      mensagem = JSON.parse(linha.slice(separador).trim());
    } catch {
      throw new Error(`Linha ${indice + 1}: JSON inválido. Nada foi importado.`);
    }

    if (!mensagem || typeof mensagem !== "object" || Array.isArray(mensagem)) {
      throw new Error(`Linha ${indice + 1}: mensagem inválida.`);
    }

    const telemetria = mensagem.schema === "fomezero.telemetria.v1";
    const alerta = mensagem.schema === "fomezero.alerta.v1";

    if (!telemetria && !alerta) {
      ignorados++;
      continue;
    }

    const sufixo = telemetria ? "telemetria" : "alerta";
    const loteDaConta = lotes.some(
      (lote) => lote.lote_id === mensagem.lote_id,
    );

    if (
      mensagem.lote_id !== LOTE ||
      mensagem.device_id !== DISPOSITIVO ||
      !loteDaConta
    ) {
      ignorados++;
      continue;
    }

    if (topico !== `${BASE}${mensagem.lote_id}/${sufixo}`) {
      throw new Error(`Linha ${indice + 1}: tópico incompatível com a mensagem.`);
    }

    if (
      !Number.isSafeInteger(mensagem.seq) ||
      mensagem.seq < 0 ||
      typeof mensagem.ts !== "string" ||
      !Number.isFinite(Date.parse(mensagem.ts)) ||
      !Number.isFinite(mensagem.temp_c)
    ) {
      throw new Error(`Linha ${indice + 1}: sequência, data ou temperatura inválida.`);
    }

    if (
      telemetria &&
      (
        typeof mensagem.ts_valido !== "boolean" ||
        !["ALERTA", "FRIO_OK"].includes(mensagem.estado) ||
        !["normal", "quebra_cadeia_frio"].includes(mensagem.evento) ||
        typeof mensagem.caixa_presente !== "boolean" ||
        !Number.isFinite(mensagem.umid_pct) ||
        !Number.isFinite(mensagem.limite_c)
      )
    ) {
      throw new Error(`Linha ${indice + 1}: telemetria incompleta ou inválida.`);
    }

    if (
      alerta &&
      (
        mensagem.evento !== "quebra_cadeia_frio" ||
        (
          mensagem.estado !== undefined &&
          mensagem.estado !== "normalizado" &&
          mensagem.estado !== "ativo"
        )
      )
    ) {
      throw new Error(`Linha ${indice + 1}: evento de alerta não reconhecido.`);
    }

    const chave = JSON.stringify([topico, mensagem]);
    if (vistos.has(chave)) {
      duplicados++;
      continue;
    }

    vistos.add(chave);
    registros.push({
      chave,
      topico,
      mensagem,
      tipo: telemetria ? "telemetria" : "alerta",
    });
  }

  if (!registros.length) {
    throw new Error(
      "Nenhum registro compatível. Cadastre LOTE-2026-0001 nesta conta de Doador e utilize o log original do dispositivo esp32-caixa-01.",
    );
  }

  return { registros, ignorados, duplicados };
}
