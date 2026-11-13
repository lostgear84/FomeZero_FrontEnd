import { useState } from "react";
import { useAuth } from "../context/auth";
import { cadastrarLote } from "../services/lotesService";

const EXEMPLOS = [
  {
    alimento: "Cenouras",
    quantidade_kg: 12,
    condicao_informada:
      "SIMULAÇÃO: lote fictício acondicionado em caixas para teste da interface. Não corresponde a uma doação real.",
  },
  {
    alimento: "Arroz",
    quantidade_kg: 20,
    condicao_informada:
      "SIMULAÇÃO: lote fictício em embalagens fechadas para teste da interface. Não representa inspeção ou validação sanitária.",
  },
  {
    alimento: "Feijão",
    quantidade_kg: 8,
    condicao_informada:
      "SIMULAÇÃO: lote fictício para demonstração do cadastro e da consulta. Não corresponde a uma entrega confirmada.",
  },
];

export default function GeradorLotesDemo() {
  const { usuario } = useAuth();

  const [confirmado, setConfirmado] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function gerarLotes() {
    if (!confirmado || processando || concluido) {
      return;
    }

    setProcessando(true);
    setMensagem("");
    setErro("");

    const identificadores = [];

    try {
      const grupo = crypto.randomUUID();

      for (let indice = 0; indice < EXEMPLOS.length; indice += 1) {
        const lote = cadastrarLote(
          {
            lote_id: `DEMO-${grupo}-${indice + 1}`,
            ...EXEMPLOS[indice],
          },
          usuario,
        );

        identificadores.push(lote.lote_id);
      }

      setConcluido(true);
      setMensagem(
        `${identificadores.length} lotes fictícios criados. ` +
        "Abra “Consultar meus lotes” para visualizá-los.",
      );
    } catch (erroGeracao) {
      const detalhe =
        erroGeracao.message || "Não foi possível concluir a geração.";

      if (identificadores.length > 0) {
        setConcluido(true);
        setErro(
          `${identificadores.length} lote(s) foram salvos antes da falha. ` +
          `Os registros salvos foram preservados. ${detalhe}`,
        );
      } else {
        setErro(detalhe);
      }
    } finally {
      setProcessando(false);
    }
  }

  return (
    <section
      className="aviso-local"
      aria-labelledby="titulo-gerador-demo"
    >
      <h2 id="titulo-gerador-demo">Dados de demonstração</h2>

      <p>
        Crie três lotes fictícios para testar a consulta e a solicitação
        simulada: cenouras, arroz e feijão.
      </p>

      <ul>
        <li>Os identificadores começam por DEMO-.</li>
        <li>A condição informada identifica cada registro como SIMULAÇÃO.</li>
        <li>Os lotes ficam associados à sua conta de Doador.</li>
        <li>Não são criados pontos, selos ou valores de CO₂ evitado.</li>
        <li>Nenhuma mensagem é enviada ao MQTT ou ao ESP32.</li>
      </ul>

      <p>
        Estes registros ficam salvos neste navegador, junto aos demais
        cadastros locais. O botão não apaga nem substitui lotes existentes.
      </p>

      <label className="confirmacao-demo">
        <input
          type="checkbox"
          checked={confirmado}
          onChange={(evento) => setConfirmado(evento.target.checked)}
          disabled={processando || concluido}
        />
        <span>Entendo que os dados gerados são fictícios.</span>
      </label>

      <p>
        <button
          type="button"
          onClick={gerarLotes}
          disabled={!confirmado || processando || concluido}
        >
          {processando
            ? "Gerando..."
            : concluido
              ? "Geração finalizada nesta visita"
              : "Gerar três lotes fictícios"}
        </button>
      </p>

      <small>
        Ao sair e voltar a esta página, uma nova geração ficará disponível.
        Cada geração cria outro conjunto, sem remover o anterior.
      </small>

      {mensagem && (
        <p className="mensagem-sucesso" role="status">
          {mensagem}
        </p>
      )}

      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}
    </section>
  );
}
