import { useEffect, useState } from "react";
import { lerUrlAipa } from "../services/aipaService";
import { lerUrlVcia } from "../services/triagemService";
import { lerUrlIntegrada } from "../services/assistenteService";

const INTERVALO_MS = 30000;
const TEMPO_LIMITE_MS = 4000;

// Só confere se o endereço responde (no-cors basta para saber se está no ar).
async function noAr(url, opcoes = { mode: "no-cors" }) {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(url, { ...opcoes, cache: "no-store", signal: controle.signal });
    return resposta.type === "opaque" || resposta.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(relogio);
  }
}

async function verificar() {
  const urlGenai = lerUrlIntegrada();
  const [aipa, vcia, genai] = await Promise.all([
    noAr(`${lerUrlAipa()}/api/saude`, {}),
    // HEAD: só confere se responde, sem baixar a página do Gradio (evita conexões cortadas no log da VCIA)
    noAr(`${lerUrlVcia()}/`, { mode: "no-cors", method: "HEAD" }),
    urlGenai ? noAr(urlGenai, { mode: "no-cors", method: "HEAD" }) : Promise.resolve(null),
  ]);

  return [
    {
      nome: "AIPA",
      situacao: aipa ? "no_ar" : "fora",
      detalhe: aipa ? "robô pós-entrega no ar" : "serviço local fora do ar",
    },
    {
      nome: "VCIA",
      situacao: vcia ? "no_ar" : "fora",
      detalhe: vcia ? "triagem por foto no ar" : "app da triagem fora do ar",
    },
    {
      nome: "GENAI",
      situacao: genai === null ? "simulado" : genai ? "no_ar" : "fora",
      detalhe:
        genai === null
          ? "assistente em modo simulado"
          : genai
            ? "assistente integrado no ar"
            : "link do assistente fora do ar",
    },
  ];
}

const ROTULO = { no_ar: "no ar", fora: "fora do ar", simulado: "simulado" };

export default function StatusServicos() {
  const [servicos, setServicos] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function atualizar() {
      const lista = await verificar();
      if (ativo) {
        setServicos(lista);
      }
    }

    atualizar();
    const relogio = setInterval(atualizar, INTERVALO_MS);

    return () => {
      ativo = false;
      clearInterval(relogio);
    };
  }, []);

  if (!servicos) {
    return null;
  }

  return (
    <ul className="status-servicos" aria-label="Situação dos módulos de IA">
      {servicos.map((servico) => (
        <li
          key={servico.nome}
          className={`status-servico status-${servico.situacao}`}
          title={servico.detalhe}
        >
          <span aria-hidden="true" className="status-ponto" />
          {servico.nome}{" "}
          <span className="status-texto">{ROTULO[servico.situacao]}</span>
        </li>
      ))}
    </ul>
  );
}
