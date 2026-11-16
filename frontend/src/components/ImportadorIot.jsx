import { useState } from "react";
import { interpretarLogIot } from "../services/iotImportService";
import {
  limparRegistrosIot,
  salvarRegistrosIot,
} from "../services/iotService";

function numero(valor, unidade) {
  return Number.isFinite(valor)
    ? `${new Intl.NumberFormat("pt-BR").format(valor)} ${unidade}`
    : "Não informado";
}

function estadoDoRegistro(registro) {
  const { mensagem, tipo } = registro;

  if (mensagem.temp_c === -127) {
    return "Falha de leitura de temperatura";
  }

  if (tipo === "alerta") {
    return mensagem.estado === "normalizado"
      ? "Normalização registrada pelo IoT"
      : "Alerta de quebra da cadeia de frio";
  }

  return mensagem.estado === "ALERTA"
    ? "Telemetria com alerta ativo"
    : "Telemetria sem alerta ativo";
}

export default function ImportadorIot({ lotes }) {
  const [dados, setDados] = useState(null);
  const [arquivo, setArquivo] = useState("");
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const [somenteAlertas, setSomenteAlertas] = useState(false);

  async function importar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const selecionado = formulario.elements.namedItem("logIot").files[0];

    setErro("");

    if (!selecionado) {
      setErro("Selecione um arquivo de log.");
      return;
    }

    if (selecionado.size > 2 * 1024 * 1024) {
      setErro("Selecione um arquivo de até 2 MB.");
      return;
    }

    setProcessando(true);

    try {
      const resultado = interpretarLogIot(await selecionado.text(), lotes);
      const lotesAtualizados = salvarRegistrosIot(resultado.registros);

      setDados(resultado);
      setArquivo(selecionado.name);
      setErro("");
    } catch (falha) {
      setErro(
        `${falha.message || "Não foi possível ler o arquivo."} A visualização anterior, se houver, foi mantida.`,
      );
    } finally {
      setProcessando(false);
    }
  }

  function limpar() {
    limparRegistrosIot();
    setDados(null);
    setArquivo("");
    setErro("");
    setSomenteAlertas(false);
  }

  const exibidos = dados
    ? dados.registros.filter(
        (registro) => !somenteAlertas || registro.tipo === "alerta",
      )
    : [];

  return (
    <section className="secao-recompensas" aria-labelledby="titulo-iot">
      <h2 id="titulo-iot">Registros IoT do lote</h2>

      <aside className="aviso-local" aria-label="Limites da importação IoT">
        <h3>Arquivo histórico — não é monitoramento ao vivo</h3>
        <p>
          Importe o log original do lote LOTE-2026-0001, dispositivo
          esp32-caixa-01. O lote precisa pertencer a esta conta.
        </p>
        <p>
          Nenhuma conexão MQTT é aberta. Não há envio ao ESP32, geração de
          recompensas ou validação de segurança para consumo.
        </p>
        <p>
          Os registros aceitos ficam salvos neste navegador, vinculados ao
          lote, e podem ser incluídos na exportação para a AIPA. Uma nova
          importação bem-sucedida substitui os registros anteriores do mesmo
          lote; não altera os lotes cadastrados.
        </p>
      </aside>

      <form onSubmit={importar}>
        <label htmlFor="log-iot">Arquivo de captura MQTT (.log ou .txt)</label>
        <input
          id="log-iot"
          name="logIot"
          type="file"
          accept=".log,.txt,text/plain"
          aria-describedby="ajuda-log-iot"
          required
          disabled={processando}
        />
        <small id="ajuda-log-iot">
          Até 2 MB. Formato: um tópico MQTT seguido do JSON por linha.
          ACKs, status e registros de outros lotes são ignorados.
        </small>
        <button type="submit" disabled={processando}>
          {processando ? "Lendo arquivo..." : "Importar registros históricos"}
        </button>
      </form>

      {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

      {dados && (
        <>
          <p className="mensagem-sucesso" role="status">
            Arquivo: {arquivo}. {dados.registros.length} registro(s) aceito(s),{" "}
            {dados.ignorados} ignorado(s) e {dados.duplicados} duplicado(s).
          </p>

          <label className="confirmacao-demo">
            <input
              type="checkbox"
              checked={somenteAlertas}
              onChange={(evento) => setSomenteAlertas(evento.target.checked)}
            />
            Mostrar somente eventos de alerta e normalização
          </label>

          <button type="button" onClick={limpar}>
            Limpar registros IoT importados
          </button>

          <p role="status">{exibidos.length} registro(s) exibido(s).</p>
          <p>
            Ordem preservada do arquivo. Normalização não apaga ocorrências
            anteriores. O estado é o informado pelo IoT, não recalculado
            pela interface.
          </p>

          <ul className="lista-lotes">
            {exibidos.map((registro) => {
              const m = registro.mensagem;
              return (
                <li className="cartao-lote" key={registro.chave}>
                  <h3>{estadoDoRegistro(registro)}</h3>
                  <dl>
                    <dt>Lote / dispositivo</dt>
                    <dd>{m.lote_id} / {m.device_id}</dd>
                    <dt>Data/hora registrada no payload</dt>
                    <dd>
                      {m.ts}
                      {m.ts_valido === false &&
                        " — relógio não validado pelo dispositivo"}
                    </dd>
                    <dt>Sequência</dt>
                    <dd>{m.seq}</dd>
                    <dt>Temperatura</dt>
                    <dd>
                      {m.temp_c === -127
                        ? "Indisponível — valor sentinela do firmware"
                        : numero(m.temp_c, "°C")}
                    </dd>
                    <dt>Evento / estado do payload</dt>
                    <dd>{m.evento} / {m.estado || "Não informado"}</dd>
                    <dt>Limite informado</dt>
                    <dd>{numero(m.limite_c, "°C")}</dd>
                    {registro.tipo === "telemetria" && (
                      <>
                        <dt>Umidade</dt>
                        <dd>{numero(m.umid_pct, "%")}</dd>
                        <dt>Presença de caixa informada</dt>
                        <dd>{m.caixa_presente ? "Sim" : "Não"}</dd>
                      </>
                    )}
                    {registro.tipo === "alerta" && (
                      <>
                        <dt>Duração acima do limite</dt>
                        <dd>{numero(m.duracao_acima_s, "s")}</dd>
                        <dt>Severidade informada</dt>
                        <dd>{m.severidade || "Não informada"}</dd>
                      </>
                    )}
                    <dt>Origem declarada no payload</dt>
                    <dd>{m.origem || "Não informado"}</dd>
                  </dl>
                  <p>
                    Registro histórico importado. Não confirma entrega,
                    aproveitamento ou segurança para consumo.
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
