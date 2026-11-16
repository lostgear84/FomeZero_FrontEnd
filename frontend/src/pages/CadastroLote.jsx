import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { cadastrarLote } from "../services/lotesService";
import { AVISO_TRIAGEM, ehDeterioracao } from "../services/triagemService";

export default function CadastroLote() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const triagem = location.state?.triagem || null;
  const destinoCompostagem = Boolean(
    triagem && ehDeterioracao({ condicao: { classe: triagem.classe }, inconclusivo: triagem.inconclusivo }),
  );

  const [loteId, setLoteId] = useState("");
  const [alimento, setAlimento] = useState("");
  const [quantidadeKg, setQuantidadeKg] = useState("");
  const [condicaoInformada, setCondicaoInformada] = useState(
    triagem?.texto_sugerido || "",
  );
  const [erro, setErro] = useState("");

  function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    try {
      const lote = cadastrarLote(
        {
          lote_id: loteId,
          alimento,
          quantidade_kg: quantidadeKg,
          condicao_informada: condicaoInformada,
          triagem,
        },
        usuario,
      );

      navigate("/doador/meus-lotes", {
        state: {
          mensagem:
            lote.destino === "compostagem"
              ? `Lote ${lote.lote_id} cadastrado com destino compostagem; ele não aparece para beneficiários.`
              : `Lote ${lote.lote_id} cadastrado neste navegador.`,
        },
      });
    } catch (erroCadastro) {
      setErro(erroCadastro.message || "Não foi possível cadastrar o lote.");
    }
  }

  return (
    <section aria-labelledby="titulo-cadastro-lote">
      <Link to="/doador">Voltar à área do Doador</Link>

      <h1 id="titulo-cadastro-lote">Cadastrar lote de doação</h1>

      <p id="aviso-lote">
        Cadastro local de demonstração. Use somente dados fictícios.
        Todos os campos são obrigatórios.
      </p>

      {triagem ? (
        <aside className="aviso-local" aria-label="Triagem visual anexada">
          <h2>Triagem visual anexada</h2>
          <p>
            {triagem.classe} (confiança {Math.round(triagem.confianca * 100)}%),
            produto {triagem.produto || "não identificado"}. O texto sugerido
            foi colocado em "Condição informada pelo doador"; você pode editar.
          </p>
          {destinoCompostagem && (
            <p>
              <strong>
                Destino: compostagem. Este lote não aparecerá para os
                beneficiários.
              </strong>
            </p>
          )}
          {triagem.pede_confirmacao_humana && !destinoCompostagem && (
            <p>
              <strong>
                O modelo pediu avaliação pessoal: confira o alimento antes de
                salvar.
              </strong>
            </p>
          )}
          <p>{AVISO_TRIAGEM}</p>
        </aside>
      ) : (
        <p>
          <Link to="/doador/triagem">
            Fazer a triagem inteligente por foto antes de cadastrar
          </Link>
        </p>
      )}

      <form
        className="formulario-lote"
        onSubmit={handleSubmit}
        aria-describedby="aviso-lote"
      >
        <label htmlFor="lote-id">Identificador do lote</label>
        <input
          id="lote-id"
          type="text"
          value={loteId}
          onChange={(evento) => setLoteId(evento.target.value)}
          placeholder="LOTE-2026-0001"
          maxLength={80}
          aria-describedby="ajuda-lote-id"
          required
        />
        <small id="ajuda-lote-id">
          Para o lote demonstrativo associado ao IoT, use LOTE-2026-0001.
          O cadastro não cria uma conexão com o dispositivo.
        </small>

        <label htmlFor="doador-lote">Doador</label>
        <input
          id="doador-lote"
          type="text"
          value={usuario.nome}
          readOnly
          aria-describedby="ajuda-doador"
        />
        <small id="ajuda-doador">
          Preenchido automaticamente pela conta autenticada.
        </small>

        <label htmlFor="alimento">Alimento</label>
        <input
          id="alimento"
          type="text"
          value={alimento}
          onChange={(evento) => setAlimento(evento.target.value)}
          placeholder="Ex.: cenouras"
          maxLength={120}
          required
        />

        <label htmlFor="quantidade-kg">Quantidade em kg</label>
        <input
          id="quantidade-kg"
          type="number"
          value={quantidadeKg}
          onChange={(evento) => setQuantidadeKg(evento.target.value)}
          min="0.001"
          step="0.001"
          required
        />

        <label htmlFor="condicao-informada">Condição informada pelo doador</label>
        <textarea
          id="condicao-informada"
          value={condicaoInformada}
          onChange={(evento) => setCondicaoInformada(evento.target.value)}
          placeholder="Descreva a apresentação e o acondicionamento do lote fictício."
          maxLength={1000}
          rows={4}
          aria-describedby="ajuda-condicao"
          required
        />
        <small id="ajuda-condicao">
          Descrição declarada pelo doador. Não representa validação sanitária
          nem garantia de segurança para consumo.
        </small>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit">Salvar lote neste navegador</button>
      </form>
    </section>
  );
}
