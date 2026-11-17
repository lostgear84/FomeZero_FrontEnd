import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { listarLotes } from "../services/lotesService";
import { DIVERGENCIAS } from "../services/entregasService";
import {
  codigoRevisor,
  decidirRevisao,
  listarFilaRevisao,
  motivoLegivel,
  rotuloSituacao,
} from "../services/aipaService";
import Materia from "../components/Materia";

const ROTULO_DIVERGENCIA = Object.fromEntries(
  DIVERGENCIAS.map((item) => [item.codigo, item.rotulo]),
);

const ROTULO_OCORRENCIA = {
  sem_ocorrencia: "sem ocorrência",
  avaria: "avaria",
  divergencia_quantidade: "diferença de quantidade",
  problema_temperatura: "problema de temperatura",
  ilegivel_outro: "texto pouco claro",
};

function numero(valor, casas = 3) {
  if (valor === null || valor === undefined || valor === "") {
    return "não informado";
  }

  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(Number(valor))} kg`;
}

function porcentagem(valor) {
  return valor === null || valor === undefined ? "—" : `${Math.round(Number(valor) * 100)}%`;
}

function alimentosLocais() {
  try {
    return Object.fromEntries(listarLotes().map((lote) => [lote.lote_id, lote.alimento]));
  } catch {
    return {};
  }
}

function kgSugerido(caso) {
  const valor = caso.kg_informado ?? caso.kg_extraido ?? caso.kg_cadastrado;
  return valor === null || valor === undefined ? "" : String(valor);
}

function CasoRevisao({ caso, alimento, revisor, aoDecidir }) {
  const [kg, setKg] = useState(() => kgSugerido(caso));
  const [enviando, setEnviando] = useState("");
  const [erro, setErro] = useState("");
  const idTitulo = `caso-${caso.lote_id}`.replace(/[^\w-]/g, "_");

  async function decidir(decisao) {
    setErro("");
    setEnviando(decisao);

    try {
      const lote = await decidirRevisao(caso.lote_id, {
        decisao,
        kgAprovado: decisao === "aprovado" ? kg : null,
        revisor,
      });
      aoDecidir(lote);
    } catch (falha) {
      setErro(falha.message || "Não foi possível registrar a decisão.");
      setEnviando("");
    }
  }

  const triagem = caso.triagem_visual;

  return (
    <li className="cartao-lote caso-revisao">
      <article aria-labelledby={idTitulo}>
        <h2 id={idTitulo}>
          {caso.lote_id}
          {alimento && ` · ${alimento}`}
        </h2>

        <p>
          <strong>Por que está aqui:</strong>{" "}
          {caso.motivos.map(motivoLegivel).join("; ")}.
        </p>

        <dl>
          <dt>Quantidade</dt>
          <dd>
            Cadastrado {numero(caso.kg_cadastrado)} · informado pelo
            beneficiário {numero(caso.kg_informado)} · lido no texto pela IA{" "}
            {numero(caso.kg_extraido)}
          </dd>

          <dt>Confirmação do beneficiário (dados pessoais mascarados)</dt>
          <dd className="texto-preservado">
            {caso.texto_confirmacao_mascarado || "sem texto"}
          </dd>

          <dt>Leitura da IA</dt>
          <dd>
            {ROTULO_OCORRENCIA[caso.ocorrencia_prevista] ||
              caso.ocorrencia_prevista ||
              "—"}{" "}
            (confiança {porcentagem(caso.confianca)})
          </dd>

          {caso.divergencias_informadas.length > 0 && (
            <>
              <dt>Problemas marcados na entrega</dt>
              <dd>
                {caso.divergencias_informadas
                  .map((codigo) => ROTULO_DIVERGENCIA[codigo] || codigo)
                  .join("; ")}
              </dd>
            </>
          )}

          {triagem && (
            <>
              <dt>Triagem por foto no cadastro</dt>
              <dd>
                {triagem.classe}
                {triagem.confianca != null && ` (confiança ${porcentagem(triagem.confianca)})`}
                {triagem.produto && ` · produto reconhecido: ${triagem.produto}`}
                {triagem.inconclusivo && " · inconclusiva"}
              </dd>
            </>
          )}

          <dt>IoT no transporte</dt>
          <dd>
            {caso.alerta_iot === "quebra_cadeia_frio"
              ? "alerta de quebra da cadeia de frio"
              : caso.alerta_iot === "sem_alerta_registrado"
                ? "sem alerta registrado"
                : "sem dados ou não reconhecido"}
          </dd>
        </dl>

        <div className="decisao-revisao">
          <label htmlFor={`${idTitulo}-kg`}>Kg aprovados (se aprovar)</label>
          <input
            id={`${idTitulo}-kg`}
            type="number"
            inputMode="decimal"
            min="0.001"
            step="0.001"
            value={kg}
            onChange={(evento) => setKg(evento.target.value)}
          />

          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          <div className="botoes-decisao">
            <button
              type="button"
              onClick={() => decidir("aprovado")}
              disabled={Boolean(enviando)}
            >
              {enviando === "aprovado" ? "Processando na AIPA..." : "Aprovar e gerar recompensas"}
            </button>
            <button
              type="button"
              className="botao-secundario"
              onClick={() => decidir("reprovado")}
              disabled={Boolean(enviando)}
            >
              {enviando === "reprovado" ? "Registrando..." : "Reprovar (sem pontos)"}
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}

export default function RevisaoHumana() {
  const { usuario } = useAuth();
  const revisor = codigoRevisor(usuario);
  const [fila, setFila] = useState(null);
  const [alimentos] = useState(alimentosLocais);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [decididos, setDecididos] = useState([]);

  const carregar = useCallback(async () => {
    setErro("");
    setCarregando(true);

    try {
      setFila(await listarFilaRevisao());
    } catch (falha) {
      setErro(falha.message || "Não foi possível ler a fila de revisão.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    listarFilaRevisao()
      .then((lotes) => ativo && setFila(lotes))
      .catch((falha) => ativo && setErro(falha.message || "Não foi possível ler a fila de revisão."))
      .finally(() => ativo && setCarregando(false));

    return () => {
      ativo = false;
    };
  }, []);

  function aoDecidir(lote) {
    setDecididos((atuais) => [lote, ...atuais]);
    setFila((atual) => (atual || []).filter((caso) => caso.lote_id !== lote.lote_id));
  }

  return (
    <section aria-labelledby="titulo-revisao">
      <h1 id="titulo-revisao">
        Revisão humana <Materia de="aipa" />
      </h1>

      <p>
        Lotes de doação que o robô da AIPA não validou sozinho. Confira os
        motivos e decida: <strong>aprovar</strong> (com os kg aprovados) gera
        CO₂ evitado, pontos, Selo Verde ESG e o Termo de Doação;{" "}
        <strong>reprovar</strong> encerra o lote sem pontos. Você é registrado
        pelo código <strong>{revisor}</strong>, nunca pelo nome.
      </p>

      <aside className="aviso-local" aria-label="Limites da decisão">
        <h2>A decisão é sobre a entrega, não sobre o alimento</h2>
        <p>
          Aprovar confirma a quantidade entregue para fins de recompensa. Não
          atesta que o alimento é seguro para consumo: essa avaliação é do
          doador, do beneficiário e da vigilância sanitária.
        </p>
      </aside>

      <p>
        <button type="button" onClick={carregar} disabled={carregando}>
          {carregando ? "Carregando..." : "Atualizar fila"}
        </button>
      </p>

      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}

      {decididos.length > 0 && (
        <section className="secao-recompensas" aria-labelledby="titulo-decididos">
          <h2 id="titulo-decididos">Decididos agora</h2>
          <ul>
            {decididos.map((lote) => (
              <li key={lote.lote_id} role="status">
                {lote.lote_id}: {rotuloSituacao(lote)}
                {lote.status === "processado" &&
                  ` (${numero(lote.quantidade_recebida_kg)}, ${lote.pontos} pontos, Termo ${lote.termo_doacao_id})`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {fila && fila.length === 0 && !erro && (
        <p role="status">Nenhum lote pendente de revisão.</p>
      )}

      {fila && fila.length > 0 && (
        <ul className="lista-lotes">
          {fila.map((caso) => (
            <CasoRevisao
              key={caso.lote_id}
              caso={caso}
              alimento={alimentos[caso.lote_id]}
              revisor={revisor}
              aoDecidir={aoDecidir}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
