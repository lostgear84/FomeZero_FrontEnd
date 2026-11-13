import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cadastrarLote } from "../services/lotesService";

export default function CadastroLote() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [loteId, setLoteId] = useState("");
  const [alimento, setAlimento] = useState("");
  const [quantidadeKg, setQuantidadeKg] = useState("");
  const [condicaoInformada, setCondicaoInformada] = useState("");
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
        },
        usuario,
      );

      navigate("/doador/meus-lotes", {
        state: {
          mensagem: `Lote ${lote.lote_id} cadastrado neste navegador.`,
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
