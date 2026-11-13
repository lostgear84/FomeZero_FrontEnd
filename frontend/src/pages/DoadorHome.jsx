import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GeradorLotesDemo from "../components/GeradorLotesDemo";

export default function DoadorHome() {
  const { usuario } = useAuth();

  return (
    <section aria-labelledby="titulo-doador">
      <h1 id="titulo-doador">Área do Doador</h1>

      <p>Bem-vindo, {usuario.nome}.</p>
      <p>
        Cadastre lotes de doação e consulte os registros associados à sua conta.
      </p>

      <nav aria-label="Ações do doador">
        <ul className="acoes-doador">
          <li>
            <Link to="/doador/cadastro-lote">Cadastrar lote de doação</Link>
          </li>
          <li>
            <Link to="/doador/meus-lotes">Consultar meus lotes</Link>
          </li>
          <li>
            <Link to="/recompensas">Acessar painel de recompensas</Link>
          </li>
        </ul>
      </nav>

      <aside className="aviso-local" aria-label="Limites da demonstração">
        <h2>Demonstração local</h2>
        <p>
          Use somente dados fictícios. Os cadastros ficam neste navegador e
          não são sincronizados com outros dispositivos.
        </p>
        <p>
          Cadastrar um lote não confirma entrega, segurança para consumo ou
          direito a pontos e selos.
        </p>
      </aside>

      <GeradorLotesDemo />
    </section>
  );
}
