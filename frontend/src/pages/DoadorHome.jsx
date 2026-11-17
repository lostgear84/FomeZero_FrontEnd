import { useAuth } from "../context/auth";
import GeradorLotesDemo from "../components/GeradorLotesDemo";
import AtalhoAcao from "../components/AtalhoAcao";

export default function DoadorHome() {
  const { usuario } = useAuth();

  return (
    <section aria-labelledby="titulo-doador">
      <div className="boas-vindas">
        <h1 id="titulo-doador">Olá, {usuario.nome}!</h1>
        <p>
          O que sobrou hoje pode virar a refeição de alguém. Cadastre um lote
          de doação e acompanhe as suas recompensas.
        </p>
      </div>

      <nav aria-label="Ações do doador">
        <ul className="acoes-doador">
          <AtalhoAcao
            para="/doador/triagem"
            icone="📸"
            titulo="Triagem inteligente por foto"
            materia="vcia"
          />
          <AtalhoAcao
            para="/doador/cadastro-lote"
            icone="🥕"
            titulo="Cadastrar lote de doação"
          />
          <AtalhoAcao para="/doador/meus-lotes" icone="📦" titulo="Meus lotes" />
          <AtalhoAcao
            para="/recompensas"
            icone="🏅"
            titulo="Painel de recompensas"
            materia="aipa"
          />
          <AtalhoAcao
            para="/doador/assistente"
            icone="💬"
            titulo="Tirar dúvidas com o assistente"
            materia="genai"
          />
        </ul>
      </nav>

      <aside className="aviso-local" aria-label="Limites da demonstração">
        <h2>Como funciona nesta demonstração</h2>
        <p>
          Use somente dados fictícios. Os cadastros ficam neste navegador e
          não são sincronizados com outros dispositivos.
        </p>
        <p>
          Cadastrar um lote não confirma entrega, segurança para consumo ou
          direito a pontos e selos. Pontos e Selo Verde ESG só aparecem depois
          que o beneficiário registra a entrega e o robô pós-entrega valida o
          lote.
        </p>
      </aside>

      <GeradorLotesDemo />
    </section>
  );
}
