const STORAGE_KEY = "fomezero.lotes.v1";

export function listarLotes() {
  const texto = localStorage.getItem(STORAGE_KEY);

  if (!texto) {
    return [];
  }

  let lotes;

  try {
    lotes = JSON.parse(texto);
  } catch {
    throw new Error(
      "Não foi possível ler os lotes salvos. Os dados existentes não foram alterados.",
    );
  }

  if (!Array.isArray(lotes)) {
    throw new Error(
      "O armazenamento dos lotes está inválido. Os dados existentes não foram alterados.",
    );
  }

  return lotes;
}

export function listarLotesDoDoador(doadorId) {
  return listarLotes().filter((lote) => lote.doador.id === doadorId);
}

export function cadastrarLote(dados, usuario) {
  if (!usuario || usuario.perfil !== "doador") {
    throw new Error("Somente uma conta do tipo Doador pode cadastrar lotes.");
  }

  const loteId = dados.lote_id.trim();
  const alimento = dados.alimento.trim();
  const quantidadeKg = Number(dados.quantidade_kg);
  const condicaoInformada = dados.condicao_informada.trim();

  if (!loteId || !alimento || !condicaoInformada) {
    throw new Error("Preencha todos os campos do lote.");
  }

  if (!Number.isFinite(quantidadeKg) || quantidadeKg <= 0) {
    throw new Error("Informe uma quantidade em kg maior que zero.");
  }

  const lotes = listarLotes();

  const identificadorExistente = lotes.some(
    (lote) => lote.lote_id.toLowerCase() === loteId.toLowerCase(),
  );

  if (identificadorExistente) {
    throw new Error(
      "Já existe um lote com esse identificador neste navegador. Use outro identificador.",
    );
  }

  const lote = {
    lote_id: loteId,
    doador: {
      id: usuario.id,
      nome: usuario.nome,
    },
    alimento,
    quantidade_kg: quantidadeKg,
    condicao_informada: condicaoInformada,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...lotes, lote]));
  } catch {
    throw new Error(
      "Não foi possível salvar o lote no navegador. Verifique o espaço e as permissões de armazenamento.",
    );
  }

  return lote;
}
