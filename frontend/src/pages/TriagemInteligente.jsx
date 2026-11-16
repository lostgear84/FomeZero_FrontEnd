import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import {
  AVISO_TRIAGEM,
  analisarFoto,
  ehDeterioracao,
  lerUrlVcia,
  registrarTriagem,
  salvarUrlVcia,
} from "../services/triagemService";

function porcentagem(valor) {
  return `${Math.round((Number(valor) || 0) * 100)}%`;
}

export default function TriagemInteligente() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState("");
  const [url, setUrl] = useState(lerUrlVcia);
  const [resultado, setResultado] = useState(null);
  const [triagem, setTriagem] = useState(null);
  const [erro, setErro] = useState("");
  const [analisando, setAnalisando] = useState(false);

  // Libera a prévia anterior quando a foto muda ou a tela fecha.
  useEffect(() => () => previa && URL.revokeObjectURL(previa), [previa]);

  function escolherArquivo(evento) {
    const escolhido = evento.target.files[0] || null;
    setArquivo(escolhido);
    setPrevia(escolhido ? URL.createObjectURL(escolhido) : "");
    setResultado(null);
    setTriagem(null);
    setErro("");
  }

  async function analisar(evento) {
    evento.preventDefault();
    setErro("");
    setResultado(null);
    setTriagem(null);
    setAnalisando(true);

    try {
      const endereco = salvarUrlVcia(url);
      const resposta = await analisarFoto(arquivo, endereco);
      setResultado(resposta);
      setTriagem(registrarTriagem(resposta, usuario));
    } catch (falha) {
      setErro(falha.message || "Não foi possível analisar a foto.");
    } finally {
      setAnalisando(false);
    }
  }

  function usarNoCadastro() {
    navigate("/doador/cadastro-lote", { state: { triagem } });
  }

  const deterioracao = ehDeterioracao(resultado);

  return (
    <section aria-labelledby="titulo-triagem">
      <Link to="/doador">Voltar à área do Doador</Link>

      <h1 id="titulo-triagem">Triagem inteligente por foto</h1>

      <p id="aviso-triagem">
        Fotografe <strong>um item de hortifrúti por vez, de cima, sobre fundo
        claro</strong> (banana, melão-de-são-caetano, pepino, berinjela,
        laranja, mamão, abacaxi ou tomate). O modelo de visão computacional do
        FOMEZERO sugere a condição visual e o produto. A sugestão pode ser
        usada no cadastro do lote, e você pode editá-la.
      </p>

      <aside className="aviso-local" aria-label="Limites da triagem">
        <h2>A triagem não é laudo</h2>
        <p>{AVISO_TRIAGEM}</p>
        <p>
          Fora desses produtos (prato pronto, carne, caixa com vários itens) o
          modelo pode errar mesmo com confiança alta.
        </p>
      </aside>

      <form
        className="formulario-lote"
        onSubmit={analisar}
        aria-describedby="aviso-triagem"
      >
        <label htmlFor="foto-triagem">Foto do alimento (JPEG ou PNG, até 5 MB)</label>
        <input
          id="foto-triagem"
          type="file"
          accept="image/jpeg,image/png"
          onChange={escolherArquivo}
          required
        />

        {previa && (
          <img
            src={previa}
            alt="Prévia da foto escolhida para a triagem"
            className="previa-triagem"
          />
        )}

        <details>
          <summary>Endereço do serviço de triagem</summary>
          <label htmlFor="url-vcia">App da VCIA</label>
          <input
            id="url-vcia"
            type="url"
            value={url}
            onChange={(evento) => setUrl(evento.target.value)}
            aria-describedby="ajuda-url-vcia"
          />
          <small id="ajuda-url-vcia">
            Padrão: http://127.0.0.1:7860 (app da VCIA rodando neste
            computador). Também aceita o link temporário https://xxxx.gradio.live.
          </small>
        </details>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit" disabled={analisando || !arquivo}>
          {analisando ? "Analisando..." : "Analisar foto"}
        </button>
      </form>

      {resultado && (
        <article
          className="cartao-lote resultado-triagem"
          aria-live="polite"
          aria-labelledby="titulo-resultado-triagem"
        >
          <h2 id="titulo-resultado-triagem">Resultado da triagem visual</h2>

          <dl>
            <dt>Condição visual sugerida</dt>
            <dd>
              <strong>{resultado.condicao.classe}</strong> (confiança{" "}
              {porcentagem(resultado.condicao.confianca)})
            </dd>

            <dt>Produto reconhecido</dt>
            <dd>
              {resultado.produto?.rotulo || "não identificado"} (confiança{" "}
              {porcentagem(resultado.produto?.confianca)})
            </dd>

            <dt>Texto sugerido para o cadastro</dt>
            <dd className="texto-preservado">{resultado.texto_sugerido}</dd>

            <dt>Modelo</dt>
            <dd>
              {resultado.modelo} · {resultado.tempo_ms} ms
              {resultado.simulado && " · SIMULADO"}
            </dd>
          </dl>

          {resultado.nitidez?.mensagem && (
            <p className="mensagem-erro" role="alert">
              {resultado.nitidez.mensagem}
            </p>
          )}

          {resultado.inconclusivo && !resultado.nitidez?.mensagem && (
            <p className="mensagem-erro" role="status">
              Resultado inconclusivo: a confiança ficou abaixo do limite do
              modelo. Tire outra foto ou avalie pessoalmente.
            </p>
          )}

          <p>
            <strong>{resultado.aviso || AVISO_TRIAGEM}</strong>
          </p>

          {deterioracao ? (
            <section aria-labelledby="titulo-destino-compostagem">
              <h3 id="titulo-destino-compostagem">
                Este item não segue para doação de consumo
              </h3>
              <p>
                A triagem encontrou sinais visuais de deterioração. Se usar este
                resultado, o lote será registrado com destino{" "}
                <strong>compostagem</strong> e não aparecerá para os
                beneficiários. Se discordar do resultado, tire outra foto.
              </p>
              <button type="button" onClick={usarNoCadastro}>
                Registrar com destino compostagem
              </button>
            </section>
          ) : (
            <button type="button" onClick={usarNoCadastro}>
              {resultado.pede_confirmacao_humana
                ? "Usar no cadastro (com avaliação pessoal)"
                : "Usar no cadastro do lote"}
            </button>
          )}
        </article>
      )}
    </section>
  );
}
