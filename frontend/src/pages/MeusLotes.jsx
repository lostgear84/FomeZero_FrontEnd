import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import { listarLotesDoDoador } from "../services/lotesService";

function carregarLotes(doadorId) {
  try {
    return {
      lotes: listarLotesDoDoador(doadorId),
      erro: "",
    };
  } catch (erroLeitura) {
    return {
      lotes: [],
      erro: erroLeitura.message || "Não foi possível carregar os lotes.",
    };
  }
}

function CartaoLote({ lote }) {
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

        <dt>Quantidade</dt>
        <dd>{quantidade} kg</dd>

        <dt>Condição informada pelo doador</dt>
        <dd className="texto-preservado">{lote.condicao_informada}</dd>
      </dl>
    </li>
  );
}

export default function MeusLotes() {
  const { usuario } = useAuth();
  const location = useLocation();

  const [dados] = useState(() => carregarLotes(usuario.id));
  const [busca, setBusca] = useState("");

  const termo = busca.trim().toLocaleLowerCase("pt-BR");

  const lotesFiltrados = dados.lotes.filter((lote) => {
    const texto = `${lote.lote_id} ${lote.alimento}`;
    return texto.toLocaleLowerCase("pt-BR").includes(termo);
  });

  return (
    <section aria-labelledby="titulo-meus-lotes">
      <Link to="/doador">Voltar à área do Doador</Link>

      <h1 id="titulo-meus-lotes">Meus lotes de doação</h1>

      {location.state?.mensagem && (
        <p className="mensagem-sucesso" role="status">
          {location.state.mensagem}
        </p>
      )}

      <p>
        Registros locais da conta {usuario.nome}. Esta lista não comprova
        entrega, recebimento ou segurança para consumo.
      </p>

      <p>
        <Link to="/doador/cadastro-lote">Cadastrar novo lote</Link>
      </p>

      {dados.erro ? (
        <p className="mensagem-erro" role="alert">{dados.erro}</p>
      ) : dados.lotes.length === 0 ? (
        <p>Nenhum lote cadastrado por esta conta neste navegador.</p>
      ) : (
        <>
          <div className="campo-busca">
            <label htmlFor="busca-lotes">
              Buscar por identificador ou alimento
            </label>
            <input
              id="busca-lotes"
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
                <CartaoLote key={lote.lote_id} lote={lote} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
