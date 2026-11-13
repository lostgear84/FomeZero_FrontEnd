import { useState } from "react";
import { Link } from "react-router-dom";
import { processarSolicitacao } from "../services/solicitacaoService";

export default function SolicitacaoCidadao() {
  const [solicitacao, setSolicitacao] = useState("");
  const [textoProcessado, setTextoProcessado] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    try {
      const resposta = processarSolicitacao(solicitacao);
      setTextoProcessado(solicitacao.trim());
      setResultado(resposta);
    } catch (erroSolicitacao) {
      setResultado(null);
      setTextoProcessado("");
      setErro(
        erroSolicitacao.message || "Não foi possível processar a solicitação.",
      );
    }
  }

  function limparFormulario() {
    setSolicitacao("");
    setTextoProcessado("");
    setResultado(null);
    setErro("");
  }

  return (
    <section aria-labelledby="titulo-solicitacao">
      <Link to="/beneficiario">Voltar à área do Beneficiário</Link>

      <h1 id="titulo-solicitacao">Solicitação do cidadão</h1>

      <aside className="aviso-local" aria-label="Funcionamento da simulação">
        <h2>IA simulada — demonstração por regras locais</h2>
        <p>
          Esta funcionalidade simula uma resposta inteligente comparando palavras
          da solicitação com os nomes dos alimentos cadastrados neste navegador.
          Não utiliza um modelo de IA nem um serviço externo.
        </p>
        <p>
          Use somente exemplos fictícios. Não informe nome completo, endereço,
          telefone, informações de saúde ou outros dados pessoais.
        </p>
      </aside>

      <form className="formulario-lote" onSubmit={handleSubmit}>
        <label htmlFor="solicitacao-cidadao">
          Qual alimento você está procurando?
        </label>

        <textarea
          id="solicitacao-cidadao"
          value={solicitacao}
          onChange={(evento) => setSolicitacao(evento.target.value)}
          placeholder="Ex.: Preciso de cenouras para uma cozinha comunitária."
          minLength={5}
          maxLength={1000}
          rows={5}
          aria-describedby="ajuda-solicitacao contador-solicitacao"
          required
        />

        <small id="ajuda-solicitacao">
          Para testar a correspondência, use o nome do alimento como aparece
          em um lote cadastrado.
        </small>

        <small id="contador-solicitacao">
          {solicitacao.length} de 1000 caracteres.
        </small>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit">Processar solicitação simulada</button>

        <button type="button" onClick={limparFormulario}>
          Limpar solicitação e resposta
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {resultado && (
          <section aria-labelledby="titulo-resposta-simulada">
            <h2 id="titulo-resposta-simulada">Resposta simulada</h2>

            <h3>Solicitação processada</h3>
            <p className="texto-preservado">{textoProcessado}</p>

            <h3>Resultado</h3>
            <p>{resultado.mensagem}</p>

            {resultado.lotes.length > 0 && (
              <ul className="lista-lotes">
                {resultado.lotes.map((lote) => (
                  <li className="cartao-lote" key={lote.lote_id}>
                    <h3>{lote.alimento}</h3>

                    <dl>
                      <dt>Identificador</dt>
                      <dd>{lote.lote_id}</dd>

                      <dt>Doador</dt>
                      <dd>{lote.doador.nome}</dd>

                      <dt>Quantidade informada</dt>
                      <dd>
                        {new Intl.NumberFormat("pt-BR", {
                          maximumFractionDigits: 3,
                        }).format(lote.quantidade_kg)} kg
                      </dd>

                      <dt>Condição informada pelo doador</dt>
                      <dd className="texto-preservado">
                        {lote.condicao_informada}
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>
            )}

            <h3>Ação sugerida</h3>
            <p>
              <Link to="/beneficiario/lotes-disponiveis">
                {resultado.acao}
              </Link>
            </p>

            <p>
              A resposta não reserva alimentos, não confirma entrega e não
              declara segurança para consumo. A decisão depende de validação
              humana.
            </p>
          </section>
        )}
      </div>

      <p>
        A solicitação e a resposta permanecem apenas nesta tela enquanto ela
        estiver aberta; não são salvas no histórico.
      </p>
    </section>
  );
}
