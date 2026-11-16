import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { destinoDoPerfil, useAuth } from "../context/auth";
import StatusServicos from "./StatusServicos";

export default function Layout() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const doador = usuario?.perfil === "doador";
  const operador = usuario?.perfil === "operador";
  const rotuloPerfil = doador ? "Doador" : operador ? "Operador" : "Beneficiário";

  function handleSair() {
    sair();
    navigate("/login", { replace: true });
  }

  return (
    <div className="layout">
      <a href="#conteudo-principal">Ir para o conteúdo principal</a>

      <header className="cabecalho">
        <Link to={destinoDoPerfil(usuario.perfil)} className="marca">
          FOMEZERO
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="menu">
            {doador && (
              <>
                <li><NavLink to="/doador" end>Doador</NavLink></li>
                <li><NavLink to="/recompensas">Recompensas</NavLink></li>
              </>
            )}
            {operador && (
              <li><NavLink to="/operador">Revisão humana</NavLink></li>
            )}
            {!doador && !operador && (
              <li>
                <NavLink to="/beneficiario">Beneficiário</NavLink>
              </li>
            )}
          </ul>
        </nav>

        <StatusServicos />

        <div className="usuario">
          <span>
            {usuario.nome} — {rotuloPerfil}
          </span>
          <button type="button" onClick={handleSair}>Sair</button>
        </div>
      </header>

      <main id="conteudo-principal" className="conteudo" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="rodape">
        <p>
          FOMEZERO — protótipo acadêmico. Cadastros locais de demonstração;
          use somente dados fictícios.
        </p>
      </footer>
    </div>
  );
}
