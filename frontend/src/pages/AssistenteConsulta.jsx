import { useState } from "react";
import { Link } from "react-router-dom";
import {
  PERGUNTAS_SUGERIDAS,
  consultarIntegrado,
  consultarSimulado,
  lerUrlIntegrada,
  salvarUrlIntegrada,
} from "../services/assistenteService";
import Materia from "../components/Materia";

const ROTULO_STATUS = {
  respondida: "Respondida com base nos documentos",
  abstencao: "Não encontrei nos documentos",
  encaminhamento: "Encaminhamento: a decisão não cabe ao assistente",
  recusa_fora_do_tema: "Fora do tema do assistente",
  recusa_seguranca: "Pedido recusado (segurança)",
  erro: "Erro",
};

function RespostaAssistente({ resultado }) {
  const { resposta, modo } = resultado;

  return (
    <article className="cartao-lote" aria-live="polite">
      <p>
        <strong>Status:</strong> {ROTULO_STATUS[resposta.status] || resposta.status}
        {modo === "simulado" && " · resposta gravada (modo simulado)"}
      </p>
      <p className="texto-preservado">{resposta.resposta}</p>
      {resposta.encaminhamento && resposta.encaminhamento.orgao && (
        <p>
          <strong>Procure:</strong> {resposta.encaminhamento.orgao}.
        </p>
      )}
      <h3>Fontes</h3>
      {resposta.fontes && resposta.fontes.length > 0 ? (
        <ul>
          {resposta.fontes.map((fonte) => (
            <li key={fonte.id_trecho}>
              <strong>{fonte.titulo}</strong>, {fonte.localizacao}.{" "}
              {fonte.url && (
                <a href={fonte.url} target="_blank" rel="noreferrer">
                  Abrir documento oficial
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma fonte (resposta sem trecho citado).</p>
      )}
      <p>
        <strong>{resposta.aviso_validacao_humana}</strong>
      </p>
    </article>
  );
}

export default function AssistenteConsulta() {
  const [pergunta, setPergunta] = useState("");
  const [modo, setModo] = useState(lerUrlIntegrada() ? "integrado" : "simulado");
  const [url, setUrl] = useState(lerUrlIntegrada);
  const [resultado, setResultado] = useState(null);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function perguntar(texto) {
    setErro("");
    setAviso("");
    setResultado(null);
    setCarregando(true);

    try {
      if (modo === "integrado") {
        try {
          const limpa = salvarUrlIntegrada(url);
          if (!limpa) {
            throw new Error("Informe o link do Gradio para o modo integrado.");
          }
          setResultado(await consultarIntegrado(texto, limpa));
          return;
        } catch (falha) {
          setAviso(
            `Modo integrado indisponível (${falha.message || "falha na conexão"}). Mostrando o modo simulado.`,
          );
        }
      }

      const simulado = consultarSimulado(texto);
      if (!simulado.encontrada) {
        setErro(
          "No modo simulado só há respostas para as perguntas sugeridas. Escolha uma delas ou use o modo integrado com o notebook da GENAI no ar.",
        );
        return;
      }
      setResultado(simulado);
    } catch (falha) {
      setErro(falha.message || "Não foi possível consultar o assistente.");
    } finally {
      setCarregando(false);
    }
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    perguntar(pergunta);
  }

  function escolherSugerida(texto) {
    setPergunta(texto);
    perguntar(texto);
  }

  return (
    <section aria-labelledby="titulo-assistente">
      <Link to="/doador">Voltar à área do Doador</Link>

      <h1 id="titulo-assistente">
        Tirar dúvidas com o assistente <Materia de="genai" />
      </h1>

      <p id="aviso-assistente">
        Tire dúvidas sobre doação segura de alimentos. As respostas vêm de
        documentos oficiais (Lei 15.224/2025, RDC ANVISA 216/2004 e guias da
        ANVISA) e mostram a fonte. O assistente não diz se um alimento é seguro
        para consumo: nesses casos, orienta procurar a vigilância sanitária.
      </p>

      <fieldset className="formulario-lote">
        <legend>Modo do assistente</legend>
        <label>
          <input
            type="radio"
            name="modo"
            value="simulado"
            checked={modo === "simulado"}
            onChange={() => setModo("simulado")}
          />{" "}
          Simulado: 10 respostas reais gravadas pela GENAI (funciona sem
          internet)
        </label>
        <label>
          <input
            type="radio"
            name="modo"
            value="integrado"
            checked={modo === "integrado"}
            onChange={() => setModo("integrado")}
          />{" "}
          Integrado: notebook da GENAI rodando no Colab
        </label>
        {modo === "integrado" && (
          <>
            <label htmlFor="url-genai">Link do Gradio (seção N10 do notebook)</label>
            <input
              id="url-genai"
              type="url"
              value={url}
              onChange={(evento) => setUrl(evento.target.value)}
              placeholder="https://xxxx.gradio.live"
            />
          </>
        )}
      </fieldset>

      <form
        className="formulario-lote"
        onSubmit={handleSubmit}
        aria-describedby="aviso-assistente"
      >
        <label htmlFor="pergunta-assistente">Sua pergunta (até 500 caracteres)</label>
        <textarea
          id="pergunta-assistente"
          value={pergunta}
          onChange={(evento) => setPergunta(evento.target.value)}
          maxLength={500}
          rows={3}
          required
        />
        <button type="submit" disabled={carregando}>
          {carregando ? "Consultando..." : "Perguntar"}
        </button>
      </form>

      <nav aria-label="Perguntas sugeridas">
        <h2>Perguntas sugeridas</h2>
        <ul className="lista-sugestoes">
          {PERGUNTAS_SUGERIDAS.map((texto) => (
            <li key={texto}>
              <button type="button" onClick={() => escolherSugerida(texto)}>
                {texto}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {aviso && (
        <p className="aviso-local" role="status">
          {aviso}
        </p>
      )}
      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}
      {resultado && <RespostaAssistente resultado={resultado} />}
    </section>
  );
}
