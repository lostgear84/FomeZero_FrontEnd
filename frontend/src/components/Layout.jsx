import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { destinoDoPerfil, useAuth } from "../context/auth";
import StatusServicos from "./StatusServicos";
import { MATERIAS } from "../materias";
import logoBranco from "../assets/marca/logo-branco.png";
import logoVermelho from "../assets/marca/logo-vermelho.png";

const MENU = {
  doador: [
    { para: "/doador", rotulo: "Início", fim: true },
    { para: "/doador/meus-lotes", rotulo: "Meus lotes" },
    { para: "/recompensas", rotulo: "Recompensas" },
  ],
  beneficiario: [
    { para: "/beneficiario", rotulo: "Início", fim: true },
    { para: "/beneficiario/lotes-disponiveis", rotulo: "Lotes disponíveis" },
    { para: "/beneficiario/registrar-entrega", rotulo: "Registrar entrega" },
  ],
  operador: [{ para: "/operador", rotulo: "Revisão humana", fim: true }],
};

const ROTULO_PERFIL = {
  doador: "Doador",
  beneficiario: "Beneficiário",
  operador: "Operador",
};

export default function Layout() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const itens = MENU[usuario.perfil] || MENU.beneficiario;

  function handleSair() {
    sair();
    navigate("/login", { replace: true });
  }

  return (
    <div className="layout">
      <a href="#conteudo-principal">Ir para o conteúdo principal</a>

      <header className="cabecalho">
        <Link to={destinoDoPerfil(usuario.perfil)} className="marca">
          <img src={logoBranco} alt="FOMEZERO, página inicial" />
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="menu">
            {itens.map((item) => (
              <li key={item.para}>
                <NavLink to={item.para} end={item.fim}>
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="usuario">
          <span>
            {usuario.nome} · {ROTULO_PERFIL[usuario.perfil] || "Beneficiário"}
          </span>
          <button type="button" onClick={handleSair}>
            Sair
          </button>
        </div>
      </header>

      <div className="faixa-status">
        <span>Módulos de IA:</span>
        <StatusServicos />
      </div>

      <main id="conteudo-principal" className="conteudo" tabIndex={-1}>
        <img src={logoVermelho} alt="" className="marca-dagua" aria-hidden="true" />
        <Outlet />
      </main>

      <footer className="rodape">
        <img src={logoVermelho} alt="" aria-hidden="true" />
        <p>
          Protótipo acadêmico da Global Solution FIAP 2026. Cadastros locais de
          demonstração: use somente dados fictícios.
        </p>
        <p>Portal desenvolvido em {MATERIAS.femd}.</p>
      </footer>
    </div>
  );
}
