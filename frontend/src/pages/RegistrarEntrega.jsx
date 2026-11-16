import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { listarLotes } from "../services/lotesService";
import {
  baixarJson,
  gerarExportacaoAipa,
  listarEntregas,
  registrarEntrega,
} from "../services/entregasService";
import { processarEntregaAutomatica } from "../services/aipaService";

function lerDados() {
  try {
    return { lotes: listarLotes(), entregas: listarEntregas(), erro: "" };
  } catch (falha) {
    return { lotes: [], entregas: [], erro: falha.message };
  }
}

export default function RegistrarEntrega() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(lerDados);
  const [loteId, setLoteId] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState(dados.erro);
  const [mensagem, setMensagem] = useState("");

  const entreguesIds = useMemo(
    () => new Set(dados.entregas.map((entrega) => entrega.lote_id)),
    [dados.entregas],
  );
  const pendentes = dados.lotes.filter((lote) => !entreguesIds.has(lote.lote_id));
  const minhasEntregas = dados.entregas.filter(
    (entrega) => entrega.beneficiario.id === usuario.id,
  );

  function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const entrega = registrarEntrega(
        { lote_id: loteId, confirmacao },
        usuario,
      );

      const lote = dados.lotes.find((item) => item.lote_id === entrega.lote_id);
      const resultado = processarEntregaAutomatica(entrega, lote);
      const loteResultado = resultado.lotes[0];

      setDados(lerDados());
      setLoteId("");
      setConfirmacao("");

      if (loteResultado.status === "processado") {
        setMensagem(
          `Entrega do lote ${entrega.lote_id} registrada. Validação automática local: ${loteResultado.pontos} pontos para o Doador.`,
        );
      } else {
        setMensagem(
          `Entrega do lote ${entrega.lote_id} registrada. A validação automática local encaminhou o caso para revisão humana.`,
        );
      }
    } catch (falha) {
      setErro(falha.message || "Não foi possível registrar a entrega.");
    }
  }

  function exportar() {
    setErro("");
    setMensagem("");

    const arquivo = gerarExportacaoAipa(dados.lotes, usuario.id);

    if (arquivo.lotes.length === 0) {
      setErro("Nenhuma entrega registrada para exportar.");
      return;
    }

    baixarJson("lotes_entregues.json", arquivo);
    setMensagem(
      `${arquivo.lotes.length} entrega(s) exportada(s) em lotes_entregues.json.`,
    );
  }

  return (
    <section aria-labelledby="titulo-registrar-entrega">
      <Link to="/beneficiario">Voltar à área do Beneficiário</Link>

      <h1 id="titulo-registrar-entrega">Registrar entrega de lote</h1>

      <p id="aviso-entrega">
        Confirme com suas palavras o que chegou. A validação automática local
        identifica os kg informados e gera uma recompensa de demonstração para
        o Doador. Use somente dados fictícios e não escreva nomes, telefones
        ou documentos.
      </p>

      <form
        className="formulario-lote"
        onSubmit={handleSubmit}
        aria-describedby="aviso-entrega"
      >
        <label htmlFor="lote-entregue">Lote de doação recebido</label>
        <select
          id="lote-entregue"
          value={loteId}
          onChange={(evento) => setLoteId(evento.target.value)}
          required
        >
          <option value="">Selecione o lote</option>
          {pendentes.map((lote) => (
            <option key={lote.lote_id} value={lote.lote_id}>
              {lote.lote_id} · {lote.alimento} · {lote.quantidade_kg} kg
              cadastrados
            </option>
          ))}
        </select>

        <label htmlFor="confirmacao-entrega">Confirmação da entrega</label>
        <textarea
          id="confirmacao-entrega"
          value={confirmacao}
          onChange={(evento) => setConfirmacao(evento.target.value)}
          placeholder="Ex.: recebemos 12 kg de pão, chegou tudo certo."
          maxLength={1000}
          rows={4}
          aria-describedby="ajuda-confirmacao"
          required
        />
        <small id="ajuda-confirmacao">
          Informe quantos kg chegaram e se houve problema. Esta confirmação não
          atesta que o alimento é seguro para consumo.
        </small>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}
        {mensagem && (
          <p className="mensagem-sucesso" role="status">
            {mensagem}
          </p>
        )}

        <button type="submit">Registrar entrega</button>
      </form>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-exportar-aipa"
      >
        <h2 id="titulo-exportar-aipa">Enviar entregas para a AIPA</h2>
        <p>
          A validação automática local gera uma recompensa imediata de
          demonstração. Para a validação externa oficial, exporte o arquivo e
          coloque-o em <code>AIPA/entrada/lotes_entregues.json</code>; depois
          execute <code>python executar_robo.py</code>. O resultado importado
          substitui a simulação local.
        </p>
        <button type="button" onClick={exportar}>
          Exportar entregas para a AIPA (JSON)
        </button>
      </section>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-minhas-entregas"
      >
        <h2 id="titulo-minhas-entregas">Entregas registradas por você</h2>
        {minhasEntregas.length === 0 ? (
          <p>Nenhuma entrega registrada nesta conta.</p>
        ) : (
          <ul className="lista-lotes">
            {minhasEntregas.map((entrega) => (
              <li key={entrega.lote_id} className="cartao-lote">
                <h3>{entrega.lote_id}</h3>
                <p className="texto-preservado">
                  {entrega.confirmacao_entrega_texto}
                </p>
                <p>
                  Registrada em{" "}
                  {new Date(entrega.entrega_confirmada_em).toLocaleString(
                    "pt-BR",
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
