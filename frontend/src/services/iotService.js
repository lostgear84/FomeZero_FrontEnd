// Armazenamento local dos registros IoT importados e normalizados.
// Os dados permanecem no navegador e são vinculados ao lote pelo lote_id.
// A existência de um registro IoT não comprova entrega, aproveitamento
// do lote ou segurança para consumo.

const STORAGE_KEY = "fomezero.iot.registros.v1";

function lerRegistros() {
  const texto = localStorage.getItem(STORAGE_KEY);

  if (!texto) {
    return {};
  }

  try {
    const dados = JSON.parse(texto);

    return dados && typeof dados === "object" ? dados : {};
  } catch {
    return {};
  }
}

function salvarRegistros(registros) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
  } catch {
    throw new Error(
      "Não foi possível salvar os registros IoT no navegador. Verifique o espaço e as permissões de armazenamento.",
    );
  }
}

// Uma nova importação bem-sucedida substitui os registros anteriores
// do mesmo lote. Registros de outros lotes são preservados.
export function salvarRegistrosIot(registros) {
  if (!Array.isArray(registros)) {
    throw new Error("Os registros IoT importados são inválidos.");
  }

  const armazenados = lerRegistros();
  const lotesImportados = new Set();

  for (const registro of registros) {
    const loteId = registro?.mensagem?.lote_id;

    if (typeof loteId === "string" && loteId.trim()) {
      lotesImportados.add(loteId);
    }
  }

  for (const loteId of lotesImportados) {
    armazenados[loteId] = registros.filter(
      (registro) => registro?.mensagem?.lote_id === loteId,
    );
  }

  salvarRegistros(armazenados);

  return [...lotesImportados];
}

export function limparRegistrosIot() {
  localStorage.removeItem(STORAGE_KEY);
}

// Retorna o estado e o evento mais recentes informados pelo IoT para o lote.
// A ordem do arquivo é preservada: o último registro aceito é o mais recente.
export function resumoIotParaExportacao(loteId) {
  if (!loteId) {
    return null;
  }

  const registros = lerRegistros()[loteId];

  if (!Array.isArray(registros) || registros.length === 0) {
    return null;
  }

  const ultimo = registros[registros.length - 1];
  const mensagem = ultimo?.mensagem || {};

  return {
    estado_termico: typeof mensagem.estado === "string" ? mensagem.estado : null,
    evento_atual: typeof mensagem.evento === "string" ? mensagem.evento : null,
    temperatura_c: Number.isFinite(mensagem.temp_c) ? mensagem.temp_c : null,
    origem: "registro IoT histórico importado",
  };
}
