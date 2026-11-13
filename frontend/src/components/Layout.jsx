import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate("/login");
  }

  return (
    <div className="layout">
      <header className="cabecalho">
        <Link to="/" className="marca">
          FOMEZERO
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="menu">
            <li>
              <NavLink to="/doador">Doador</NavLink>
            </li>
            <li>
              <NavLink to="/beneficiario">Beneficiário</NavLink>
            </li>
            <li>
              <NavLink to="/recompensas">Recompensas</NavLink>
            </li>
          </ul>
        </nav>

        {usuario ? (
          <div className="usuario">
            <span>{usuario.nome}</span>
            <button type="button" onClick={handleSair}>
              Sair
            </button>
          </div>
        ) : (
          <Link to="/login" className="botao-entrar">
            Entrar
          </Link>
        )}
      </header>

      <main className="conteudo">
        <Outlet />
      </main>

      <footer className="rodape">
        <p>
          FOMEZERO — protótipo acadêmico. Os dados são locais e sintéticos.
        </p>
      </footer>
    </div>
  );
}
