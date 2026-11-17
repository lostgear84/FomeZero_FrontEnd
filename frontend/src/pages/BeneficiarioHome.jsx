import AtalhoAcao from "../components/AtalhoAcao";
import { useAuth } from "../context/auth";

export default function BeneficiarioHome() {
  const { usuario } = useAuth();

  return (
    <section aria-labelledby="titulo-beneficiario">
      <div className="boas-vindas">
        <h1 id="titulo-beneficiario">Olá, {usuario.nome}!</h1>
        <p>
          Veja os lotes de doação disponíveis, faça uma solicitação e confirme
          o que chegou para liberar as recompensas do doador.
        </p>
      </div>

      <nav aria-label="Ações do beneficiário">
        <ul className="acoes-doador">
          <AtalhoAcao
            para="/beneficiario/lotes-disponiveis"
            icone="🛒"
            titulo="Lotes disponíveis"
          />
          <AtalhoAcao
            para="/beneficiario/solicitacao"
            icone="🙋"
            titulo="Solicitação do cidadão"
          />
          <AtalhoAcao
            para="/beneficiario/registrar-entrega"
            icone="✅"
            titulo="Registrar entrega de lote"
            materia="aipa"
          />
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
