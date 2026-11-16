import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import {
  importarArquivoCt04,
  lerResultadosAipa,
  limparResultadosAipa,
  proximoSelo,
  resumoDoDoador,
} from "../services/aipaService";

const ROTULO_STATUS = {
  processado: "Processado pela AIPA",
  revisao_humana: "Em revisão humana",
  falha: "Falha no processamento",
};

// Motivos do CT-04 em linguagem simples. Código desconhecido aparece como veio.
const ROTULO_MOTIVO = {
  ocorrencia_avaria: "possível avaria informada na confirmação",
  ocorrencia_divergencia_quantidade: "possível diferença entre o cadastrado e o recebido",
  ocorrencia_problema_temperatura: "possível problema de temperatura informado",
  ocorrencia_ilegivel_outro: "confirmação pouco clara",
  baixa_confianca: "a IA não teve confiança suficiente para seguir sozinha",
  divergencia_kg: "kg recebidos diferentes do cadastrado",
  alerta_iot_quebra_cadeia_frio: "alerta de quebra da cadeia de frio no transporte (IoT)",
  sem_confirmacao: "sem texto de confirmação da entrega",
};

function motivoLegivel(codigo) {
  const base = String(codigo).split(":")[0];
  return ROTULO_MOTIVO[codigo] || ROTULO_MOTIVO[base] || codigo;
}

function frase(texto) {
  const limpo = String(texto || "").trim();
  return limpo ? `${limpo.charAt(0).toUpperCase()}${limpo.slice(1)}.` : "";
}

function semCodigoInterno(texto) {
  return String(texto || "").replace(/\s*\(F-\d+\)\s*$/, "");
}

function numero(valor, casas = 2) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(
    valor,
  );
}

function IndicadorRecompensa({ titulo, valor, descricao }) {
  return (
    <article className="indicador-recompensa">
      <h2>{titulo}</h2>
      <p className="valor-recompensa">{valor}</p>
      <p>{descricao}</p>
    </article>
  );
}

function ProgressoSelo({ kgAcumulado }) {
  const progresso = proximoSelo(kgAcumulado);

  if (!progresso) {
    return null;
  }

  if (!progresso.selo) {
    return <p>Faixa máxima (Ouro) alcançada.</p>;
  }

  return (
    <div className="progresso-selo">
      <label htmlFor="barra-selo">
        Faltam {numero(progresso.faltamKg)} kg para o Selo {progresso.selo}
      </label>
      <progress id="barra-selo" max="100" value={progresso.percentual}>
        {progresso.percentual}%
      </progress>
    </div>
  );
}

export default function PainelRecompensas() {
  const { usuario } = useAuth();
  const [resultados, setResultados] = useState(lerResultadosAipa);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);

  const resumo = resumoDoDoador(resultados, usuario.id);
  const temResultados = Boolean(resumo && resumo.lotes.length > 0);

  async function importar(evento) {
    evento.preventDefault();
    const arquivo = evento.currentTarget.elements.namedItem("arquivoCt04")
      .files[0];
    setErro("");
    setProcessando(true);

    try {
      setResultados(await importarArquivoCt04(arquivo));
    } catch (falha) {
      setErro(
        `${falha.message || "Não foi possível ler o arquivo."} Os resultados anteriores, se houver, foram mantidos.`,
      );
    } finally {
      setProcessando(false);
    }
  }

  function limpar() {
    limparResultadosAipa();
    setResultados(null);
  }

  return (
    <section aria-labelledby="titulo-recompensas">
      <Link to="/doador">Voltar à área do Doador</Link>

      <h1 id="titulo-recompensas">Painel de Recompensas</h1>

      <p>
        Doador: <span>{usuario.nome}</span>
      </p>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-importar-aipa"
      >
        <h2 id="titulo-importar-aipa">Resultados do robô da AIPA</h2>
        <p>
          Depois de executar o robô, importe o arquivo{" "}
          <code>saida/ct04/ct04_lotes.json</code>. Pontos, Selo Verde ESG e
          CO₂ evitado são calculados pela AIPA; este painel só exibe.
        </p>
        <form className="formulario-lote" onSubmit={importar}>
          <label htmlFor="arquivo-ct04">Arquivo de resultados (JSON)</label>
          <input
            id="arquivo-ct04"
            name="arquivoCt04"
            type="file"
            accept="application/json,.json"
            required
          />
          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}
          <button type="submit" disabled={processando}>
            {processando ? "Importando..." : "Importar resultados da AIPA"}
          </button>
        </form>
        {resultados && (
          <p role="status">
            Importado de {resultados.arquivo} em{" "}
            {new Date(resultados.importado_em).toLocaleString("pt-BR")}.{" "}
            <button type="button" onClick={limpar}>
              Remover resultados importados
            </button>
          </p>
        )}
      </section>

      {!temResultados && (
        <aside className="aviso-local" aria-label="Situação da integração">
          <h2>Nenhum resultado da AIPA para esta conta</h2>
          <p>
            Nenhum ponto, selo ou valor de CO₂ evitado foi atribuído a esta
            conta. O cadastro de um lote não comprova entrega nem gera
            recompensas: é preciso registrar a entrega, exportar para a AIPA,
            executar o robô e importar o resultado.
          </p>
        </aside>
      )}

      <div className="grade-recompensas">
        <IndicadorRecompensa
          titulo="Pontos"
          valor={
            resumo && resumo.pontosAcumulados !== null
              ? numero(resumo.pontosAcumulados, 0)
              : "Sem pontos lançados"
          }
          descricao="10 pontos por kg recebido e validado (regra de demonstração da AIPA, não aprovada pelo grupo)."
        />

        <IndicadorRecompensa
          titulo="Selo Verde ESG"
          valor={
            resumo && resumo.kgAcumulado !== null
              ? resumo.selo || "Ainda sem selo"
              : "Não atribuído"
          }
          descricao="Pelo total acumulado: Bronze a partir de 50 kg, Prata 200 kg, Ouro 500 kg. Reconhecimento interno, não certificação."
        />

        <IndicadorRecompensa
          titulo="CO₂ evitado (kg CO₂eq)"
          valor={
            resumo && resumo.co2Estimado !== null
              ? `${numero(resumo.co2Estimado)} (estimativa)`
              : "Não calculado"
          }
          descricao="Estimativa da AIPA com fator da FAO (2013); não é redução medida. A ausência de cálculo não representa zero."
        />
      </div>

      {resumo && resumo.kgAcumulado !== null && (
        <section
          className="secao-recompensas"
          aria-labelledby="titulo-progresso"
        >
          <h2 id="titulo-progresso">Progresso do Selo Verde ESG</h2>
          <p>{numero(resumo.kgAcumulado)} kg recebidos e validados no total.</p>
          <ProgressoSelo kgAcumulado={resumo.kgAcumulado} />
        </section>
      )}

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-extrato-pontos"
      >
        <h2 id="titulo-extrato-pontos">Extrato por lote de doação</h2>
        {!temResultados ? (
          <p>Nenhum lançamento disponível para esta conta.</p>
        ) : (
          <ul className="lista-lotes">
            {resumo.lotes.map((lote) => (
              <li key={lote.lote_id} className="cartao-lote">
                <h3>{lote.lote_id}</h3>
                <p>
                  <strong>{ROTULO_STATUS[lote.status] || lote.status}</strong>
                </p>
                {lote.status === "processado" ? (
                  <ul>
                    <li>
                      Recebido e validado: {numero(lote.quantidade_recebida_kg)} kg
                    </li>
                    <li>Pontos: {numero(lote.pontos, 0)}</li>
                    <li>
                      CO₂ evitado: {numero(lote.co2_evitado_kg_co2eq)} kg CO₂eq
                      (estimativa)
                    </li>
                    <li>Termo de Doação: {lote.termo_doacao_id}</li>
                  </ul>
                ) : (
                  <p>
                    Sem pontos neste lote.{" "}
                    {lote.motivo && lote.motivo.length > 0 && (
                      <>Motivo: {lote.motivo.map(motivoLegivel).join("; ")}.</>
                    )}{" "}
                    {lote.status === "revisao_humana" &&
                      "Uma pessoa da equipe FOMEZERO decide este caso."}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {resumo && resumo.metodologia && (
        <section
          className="secao-recompensas"
          aria-labelledby="titulo-metodologia"
        >
          <h2 id="titulo-metodologia">Como o CO₂ evitado é estimado</h2>
          <p>
            Fator de {numero(resumo.metodologia.fator_kg_co2eq_por_kg)} kg CO₂eq
            por kg. Fonte: {semCodigoInterno(resumo.metodologia.fonte)}.
          </p>
          <p>
            {frase(resumo.metodologia.escopo)}{" "}
            {frase(resumo.metodologia.cenario_referencia)} Não inclui:{" "}
            {resumo.metodologia.nao_inclui}.
          </p>
        </section>
      )}

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-limites-recompensas"
      >
        <h2 id="titulo-limites-recompensas">Limites do reconhecimento</h2>
        <p>
          O Selo Verde ESG é uma proposta de reconhecimento interno do FOMEZERO,
          não uma certificação externa. As regras de pontos e de selo são de
          demonstração e ainda dependem de aprovação do grupo.
        </p>
        <p>
          Telemetria, alerta térmico e normalização não comprovam entrega,
          aproveitamento do lote ou impacto ambiental. Nenhum resultado atesta
          que um alimento é seguro para consumo.
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
