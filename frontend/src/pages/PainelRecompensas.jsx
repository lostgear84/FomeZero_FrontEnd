import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function IndicadorRecompensa({ titulo, valor, descricao }) {
  return (
    <article className="indicador-recompensa">
      <h2>{titulo}</h2>
      <p className="valor-recompensa">{valor}</p>
      <p>{descricao}</p>
    </article>
  );
}

export default function PainelRecompensas() {
  const { usuario } = useAuth();

  return (
    <section aria-labelledby="titulo-recompensas">
      <Link to="/doador">Voltar à área do Doador</Link>

      <h1 id="titulo-recompensas">Painel de Recompensas</h1>

      <p>
        Doador: <span>{usuario.nome}</span>
      </p>

      <aside className="aviso-local" aria-label="Situação da integração">
        <h2>Integração com a AIPA pendente</h2>
        <p>
          Este painel ainda não recebe resultados da automação. Nenhum ponto,
          selo ou valor de CO₂ evitado foi atribuído por esta aplicação.
        </p>
        <p>
          O cadastro de um lote não comprova entrega ou aproveitamento dos
          alimentos e não gera recompensas automaticamente.
        </p>
      </aside>

      <div className="grade-recompensas">
        <IndicadorRecompensa
          titulo="Pontos"
          valor="Aguardando dados da AIPA"
          descricao="O saldo será exibido quando os dados e as regras da automação estiverem definidos."
        />

        <IndicadorRecompensa
          titulo="Selo Verde ESG"
          valor="Não atribuído"
          descricao="Aguardando dados da AIPA. As categorias previstas são Bronze, Prata e Ouro, sem faixa de pontuação definida nesta aplicação."
        />

        <IndicadorRecompensa
          titulo="CO₂ evitado (kg CO₂eq)"
          valor="Não calculado"
          descricao="A metodologia, o escopo e a fonte do fator de cálculo ainda precisam ser definidos."
        />
      </div>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-extrato-pontos"
      >
        <h2 id="titulo-extrato-pontos">Extrato de pontos</h2>
        <p>
          Nenhum lançamento disponível. O painel não cria transações a partir
          dos lotes cadastrados.
        </p>
      </section>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-extrato-carbono"
      >
        <h2 id="titulo-extrato-carbono">
          Extrato de CO₂ evitado (kg CO₂eq)
        </h2>
        <p>
          Nenhum cálculo disponível. A ausência de cálculo não representa
          emissão evitada igual a zero.
        </p>
      </section>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-limites-recompensas"
      >
        <h2 id="titulo-limites-recompensas">Limites do reconhecimento</h2>
        <p>
          O Selo Verde ESG é uma proposta de reconhecimento interno do FOMEZERO,
          não uma certificação externa.
        </p>
        <p>
          Telemetria, alerta térmico e normalização não comprovam entrega,
          aproveitamento do lote ou impacto ambiental.
        </p>
      </section>

      <nav aria-label="Ações relacionadas às doações">
        <ul className="acoes-doador">
          <li>
            <Link to="/doador/meus-lotes">Consultar meus lotes de doação</Link>
          </li>
          <li>
            <Link to="/doador/cadastro-lote">Cadastrar lote de doação</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
