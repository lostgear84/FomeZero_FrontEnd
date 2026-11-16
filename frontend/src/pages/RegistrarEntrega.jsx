import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { listarLotesParaDoacao } from "../services/lotesService";
import {
  DIVERGENCIAS,
  baixarJson,
  entregasEmCt03,
  gerarExportacaoAipa,
  listarEntregas,
  loteParaCt03,
  registrarEntrega,
} from "../services/entregasService";
import {
  lerResultadosAipa,
  lerUrlAipa,
  motivoLegivel,
  processarNaAipa,
  resultadoDoLote,
  rotuloSituacao,
  salvarUrlAipa,
} from "../services/aipaService";

const ROTULO_DIVERGENCIA = Object.fromEntries(
  DIVERGENCIAS.map((item) => [item.codigo, item.rotulo]),
);

function lerDados() {
  try {
    return {
      lotes: listarLotesParaDoacao(),
      entregas: listarEntregas(),
      resultados: lerResultadosAipa(),
      erro: "",
    };
  } catch (falha) {
    return { lotes: [], entregas: [], resultados: null, erro: falha.message };
  }
}

function numero(valor) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(valor);
}

// Situação do lote na AIPA, em linguagem do beneficiário.
function SituacaoAipa({ resultado }) {
  if (!resultado) {
    return (
      <p>
        <strong>Aguardando a AIPA.</strong> A entrega está salva, mas ainda não
        foi processada pelo robô.
      </p>
    );
  }

  if (resultado.status === "processado") {
    return (
      <p>
        <strong>
          {resultado.revisao?.situacao === "aprovado"
            ? "Aprovada na revisão humana:"
            : "Validada automaticamente pela AIPA:"}
        </strong>{" "}
        {numero(resultado.quantidade_recebida_kg)} kg confirmados. Termo de
        Doação {resultado.termo_doacao_id} emitido para o doador.
      </p>
    );
  }

  return (
    <p>
      <strong>{rotuloSituacao(resultado)}.</strong>{" "}
      {resultado.motivo?.length > 0 &&
        `Motivo: ${resultado.motivo.map(motivoLegivel).join("; ")}.`}{" "}
      {resultado.status === "revisao_humana" &&
        resultado.revisao?.situacao !== "reprovado" &&
        "Uma pessoa da equipe FOMEZERO decide este caso."}
    </p>
  );
}

export default function RegistrarEntrega() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(lerDados);
  const [loteId, setLoteId] = useState("");
  const [kgRecebido, setKgRecebido] = useState("");
  const [divergencias, setDivergencias] = useState([]);
  const [confirmacao, setConfirmacao] = useState("");
  const [urlAipa, setUrlAipa] = useState(lerUrlAipa);
  const [erro, setErro] = useState(dados.erro);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const entreguesIds = useMemo(
    () => new Set(dados.entregas.map((entrega) => entrega.lote_id)),
    [dados.entregas],
  );
  const pendentes = dados.lotes.filter((lote) => !entreguesIds.has(lote.lote_id));
  const loteEscolhido = dados.lotes.find((lote) => lote.lote_id === loteId);
  const minhasEntregas = dados.entregas.filter(
    (entrega) => entrega.beneficiario.id === usuario.id,
  );
  const naoProcessadas = minhasEntregas.filter(
    (entrega) => !resultadoDoLote(dados.resultados, entrega.lote_id),
  );

  function alternarDivergencia(codigo) {
    setDivergencias((atuais) =>
      atuais.includes(codigo)
        ? atuais.filter((item) => item !== codigo)
        : [...atuais, codigo],
    );
  }

  async function enviarParaAipa(lotesCt03) {
    const endereco = salvarUrlAipa(urlAipa);
    return processarNaAipa(lotesCt03, endereco);
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");

    let entrega;

    try {
      entrega = registrarEntrega(
        {
          lote_id: loteId,
          quantidade_recebida_kg: kgRecebido,
          divergencias,
          confirmacao,
        },
        usuario,
      );
    } catch (falha) {
      setErro(falha.message || "Não foi possível registrar a entrega.");
      return;
    }

    setLoteId("");
    setKgRecebido("");
    setDivergencias([]);
    setConfirmacao("");
    setEnviando(true);

    try {
      const [resultado] = await enviarParaAipa([loteParaCt03(loteEscolhido, entrega)]);
      setMensagem(
        resultado.status === "processado"
          ? `Entrega do lote ${entrega.lote_id} registrada e validada pela AIPA.`
          : `Entrega do lote ${entrega.lote_id} registrada. A AIPA encaminhou o caso para revisão humana.`,
      );
    } catch (falha) {
      setErro(
        `Entrega do lote ${entrega.lote_id} registrada neste navegador, mas não foi processada: ${falha.message} Use "Enviar entregas pendentes" quando o serviço estiver no ar.`,
      );
    } finally {
      setEnviando(false);
      setDados(lerDados());
    }
  }

  async function enviarPendentes() {
    setErro("");
    setMensagem("");
    const ids = new Set(naoProcessadas.map((entrega) => entrega.lote_id));
    const lotesCt03 = entregasEmCt03(dados.lotes).filter((lote) => ids.has(lote.lote_id));

    if (lotesCt03.length === 0) {
      setMensagem("Nenhuma entrega pendente de processamento.");
      return;
    }

    setEnviando(true);

    try {
      const devolvidos = await enviarParaAipa(lotesCt03);
      setMensagem(`${devolvidos.length} entrega(s) processada(s) pela AIPA.`);
    } catch (falha) {
      setErro(falha.message || "Não foi possível enviar as entregas para a AIPA.");
    } finally {
      setEnviando(false);
      setDados(lerDados());
    }
  }

  function exportar() {
    setErro("");
    setMensagem("");

    const arquivo = gerarExportacaoAipa(dados.lotes);

    if (arquivo.lotes.length === 0) {
      setErro("Nenhuma entrega registrada para exportar.");
      return;
    }

    baixarJson("lotes_entregues.json", arquivo);
    setMensagem(
      `${arquivo.lotes.length} entrega(s) exportada(s) em lotes_entregues.json.`,
    );
  }

  return (
    <section aria-labelledby="titulo-registrar-entrega">
      <Link to="/beneficiario">Voltar à área do Beneficiário</Link>

      <h1 id="titulo-registrar-entrega">Registrar entrega de lote</h1>

      <p id="aviso-entrega">
        Informe quantos kg chegaram, marque se houve algum problema e confirme
        com suas palavras. Ao registrar, o robô da AIPA confere na hora o kg
        cadastrado, o kg informado e o kg escrito no texto (extraído pela IA),
        identifica ocorrências e decide se a entrega gera as recompensas do
        doador ou se vai para revisão humana. Use somente dados fictícios e não
        escreva nomes, telefones ou documentos.
      </p>

      <form
        className="formulario-lote"
        onSubmit={handleSubmit}
        aria-describedby="aviso-entrega"
      >
        <label htmlFor="lote-entregue">Lote de doação recebido</label>
        <select
          id="lote-entregue"
          value={loteId}
          onChange={(evento) => setLoteId(evento.target.value)}
          required
        >
          <option value="">Selecione o lote</option>
          {pendentes.map((lote) => (
            <option key={lote.lote_id} value={lote.lote_id}>
              {lote.lote_id} · {lote.alimento} · {lote.quantidade_kg} kg
              cadastrados
            </option>
          ))}
        </select>

        <label htmlFor="kg-recebido">Quantidade recebida (kg)</label>
        <input
          id="kg-recebido"
          type="number"
          inputMode="decimal"
          min="0.001"
          step="0.001"
          value={kgRecebido}
          onChange={(evento) => setKgRecebido(evento.target.value)}
          aria-describedby="ajuda-kg-recebido"
          required
        />
        <small id="ajuda-kg-recebido">
          {loteEscolhido
            ? `Cadastrado pelo doador: ${numero(loteEscolhido.quantidade_kg)} kg. Pese o que chegou.`
            : "Pese o que chegou."}
        </small>

        <fieldset>
          <legend>Houve algum problema na entrega?</legend>
          {DIVERGENCIAS.map((item) => (
            <label
              key={item.codigo}
              className="opcao-marcavel"
              htmlFor={`divergencia-${item.codigo}`}
            >
              <input
                id={`divergencia-${item.codigo}`}
                type="checkbox"
                checked={divergencias.includes(item.codigo)}
                onChange={() => alternarDivergencia(item.codigo)}
              />{" "}
              {item.rotulo}
            </label>
          ))}
        </fieldset>

        <label htmlFor="confirmacao-entrega">Confirmação da entrega</label>
        <textarea
          id="confirmacao-entrega"
          value={confirmacao}
          onChange={(evento) => setConfirmacao(evento.target.value)}
          placeholder="Ex.: recebemos 12 kg de pão, chegou tudo certo."
          maxLength={1000}
          rows={4}
          aria-describedby="ajuda-confirmacao"
          required
        />
        <small id="ajuda-confirmacao">
          Diga quantos kg chegaram e se houve problema. Esta confirmação não
          atesta que o alimento é seguro para consumo.
        </small>

        <details>
          <summary>Endereço do serviço da AIPA</summary>
          <label htmlFor="url-aipa">Serviço local da AIPA</label>
          <input
            id="url-aipa"
            type="url"
            value={urlAipa}
            onChange={(evento) => setUrlAipa(evento.target.value)}
            aria-describedby="ajuda-url-aipa"
          />
          <small id="ajuda-url-aipa">
            Padrão: http://127.0.0.1:5070 (python servico_aipa.py na pasta da
            AIPA, neste computador).
          </small>
        </details>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}
        {mensagem && (
          <p className="mensagem-sucesso" role="status">
            {mensagem}
          </p>
        )}

        <button type="submit" disabled={enviando}>
          {enviando ? "Processando na AIPA..." : "Registrar entrega"}
        </button>
      </form>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-minhas-entregas"
      >
        <h2 id="titulo-minhas-entregas">Entregas registradas por você</h2>
        {minhasEntregas.length === 0 ? (
          <p>Nenhuma entrega registrada nesta conta.</p>
        ) : (
          <ul className="lista-lotes">
            {minhasEntregas.map((entrega) => (
              <li key={entrega.lote_id} className="cartao-lote">
                <h3>{entrega.lote_id}</h3>
                {entrega.quantidade_recebida_kg != null && (
                  <p>Informado: {numero(entrega.quantidade_recebida_kg)} kg</p>
                )}
                {entrega.divergencias_informadas?.length > 0 && (
                  <p>
                    Problemas marcados:{" "}
                    {entrega.divergencias_informadas
                      .map((codigo) => ROTULO_DIVERGENCIA[codigo] || codigo)
                      .join("; ")}
                  </p>
                )}
                <p className="texto-preservado">
                  {entrega.confirmacao_entrega_texto}
                </p>
                <p>
                  Registrada em{" "}
                  {new Date(entrega.entrega_confirmada_em).toLocaleString(
                    "pt-BR",
                  )}
                </p>
                <SituacaoAipa
                  resultado={resultadoDoLote(dados.resultados, entrega.lote_id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="secao-recompensas"
        aria-labelledby="titulo-exportar-aipa"
      >
        <h2 id="titulo-exportar-aipa">Entregas pendentes na AIPA</h2>
        <p>
          {naoProcessadas.length === 0
            ? "Todas as suas entregas já foram processadas pela AIPA."
            : `${naoProcessadas.length} entrega(s) ainda sem processamento (por exemplo, se o serviço estava fora do ar).`}
        </p>
        <button
          type="button"
          onClick={enviarPendentes}
          disabled={enviando || naoProcessadas.length === 0}
        >
          Enviar entregas pendentes à AIPA
        </button>
        <details>
          <summary>Sem o serviço: exportar arquivo para o robô</summary>
          <p>
            Coloque o arquivo em <code>AIPA/entrada/lotes_entregues.json</code>,
            execute <code>python executar_robo.py</code> e importe o resultado no
            Painel de Recompensas do Doador.
          </p>
          <button type="button" onClick={exportar}>
            Exportar entregas para a AIPA (JSON)
          </button>
        </details>
      </section>
    </section>
  );
}
