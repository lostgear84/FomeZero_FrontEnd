import { useState } from "react";
import { Link } from "react-router-dom";
import { listarLotes } from "../services/lotesService";

function carregarLotes() {
  try {
    return {
      lotes: listarLotes(),
      erro: "",
    };
  } catch (erroLeitura) {
    return {
      lotes: [],
      erro: erroLeitura.message || "Não foi possível carregar os lotes.",
    };
  }
}

function CartaoLoteDisponivel({ lote }) {
  const quantidade = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 3,
  }).format(lote.quantidade_kg);

  return (
    <li className="cartao-lote">
      <h2>{lote.alimento}</h2>

      <dl>
        <dt>Identificador</dt>
        <dd>{lote.lote_id}</dd>

        <dt>Doador</dt>
        <dd>{lote.doador.nome}</dd>

        <dt>Quantidade informada</dt>
        <dd>{quantidade} kg</dd>

        <dt>Condição informada pelo doador</dt>
        <dd className="texto-preservado">{lote.condicao_informada}</dd>
      </dl>
    </li>
  );
}

export default function LotesDisponiveis() {
  const [dados, setDados] = useState(carregarLotes);
  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState("");

  const termo = busca.trim().toLocaleLowerCase("pt-BR");

  const lotesFiltrados = dados.lotes.filter((lote) => {
    const texto = `${lote.lote_id} ${lote.alimento}`;
    return texto.toLocaleLowerCase("pt-BR").includes(termo);
  });

  function atualizarLista() {
    const resultado = carregarLotes();
    setDados(resultado);
    setMensagem(
      resultado.erro ? "" : "Lista atualizada com os registros deste navegador.",
    );
  }

  return (
    <section aria-labelledby="titulo-lotes-disponiveis">
      <Link to="/beneficiario">Voltar à área do Beneficiário</Link>

      <h1 id="titulo-lotes-disponiveis">Lotes disponíveis</h1>

      <aside className="aviso-local" aria-label="Origem e limites dos dados">
        <h2>Lista demonstrativa</h2>
        <p>
          Nesta versão, “disponíveis” representa os lotes cadastrados localmente,
          sem confirmação operacional de disponibilidade.
        </p>
        <p>
          Não há reserva ou confirmação de entrega nesta tela. A condição é
          declarada pelo doador e não representa validação sanitária.
        </p>
      </aside>

      <p>
        <button type="button" onClick={atualizarLista}>
          Atualizar lista local
        </button>
      </p>

      {mensagem && <p role="status">{mensagem}</p>}

      {dados.erro ? (
        <p className="mensagem-erro" role="alert">
          {dados.erro}
        </p>
      ) : dados.lotes.length === 0 ? (
        <p>Nenhum lote cadastrado neste navegador.</p>
      ) : (
        <>
          <div className="campo-busca">
            <label htmlFor="busca-lotes-disponiveis">
              Buscar por alimento ou identificador
            </label>
            <input
              id="busca-lotes-disponiveis"
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          <p role="status">
            {lotesFiltrados.length} de {dados.lotes.length} lote(s) exibido(s).
          </p>

          {lotesFiltrados.length === 0 ? (
            <p>Nenhum lote corresponde à busca.</p>
          ) : (
            <ul className="lista-lotes">
              {lotesFiltrados.map((lote) => (
                <CartaoLoteDisponivel key={lote.lote_id} lote={lote} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
