import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function BeneficiarioHome() {
  const { usuario } = useAuth();

  return (
    <section aria-labelledby="titulo-beneficiario">
      <h1 id="titulo-beneficiario">Área do Beneficiário</h1>

      <p>Bem-vindo, {usuario.nome}.</p>
      <p>
        Consulte os lotes de doação cadastrados e registre uma solicitação
        fictícia para testar a resposta simulada.
      </p>

      <nav aria-label="Ações do beneficiário">
        <ul className="acoes-doador">
          <li>
            <Link to="/beneficiario/lotes-disponiveis">
              Consultar lotes disponíveis
            </Link>
          </li>
          <li>
            <Link to="/beneficiario/solicitacao">
              Acessar solicitação do cidadão
            </Link>
          </li>
        </ul>
      </nav>

      <aside className="aviso-local" aria-label="Limites da demonstração">
        <h2>Demonstração local</h2>
        <p>
          Os lotes exibidos são registros fictícios cadastrados neste navegador.
          Não há sincronização com outros dispositivos.
        </p>
        <p>
          A solicitação utiliza IA simulada por regras locais, sem modelo de IA
          ou integração externa.
        </p>
        <p>
          A consulta e a resposta simulada não confirmam reserva, recebimento
          ou segurança para consumo.
        </p>
      </aside>
    </section>
  );
}
