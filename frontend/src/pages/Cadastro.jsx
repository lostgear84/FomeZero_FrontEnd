import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { destinoDoPerfil, useAuth } from "../context/AuthContext";

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("doador");
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setProcessando(true);

    try {
      const usuario = await cadastrar({ nome, email, senha, perfil });
      navigate(destinoDoPerfil(usuario.perfil), { replace: true });
    } catch (erroCadastro) {
      setErro(erroCadastro.message || "Não foi possível cadastrar a conta.");
    } finally {
      setProcessando(false);
    }
  }

  return (
    <main className="pagina-autenticacao">
      <h1>Criar conta no FOMEZERO</h1>
      <p id="aviso-cadastro">
        Demonstração local. Use somente nome, e-mail e senha fictícios.
        A conta ficará salva apenas neste navegador.
      </p>

      <form onSubmit={handleSubmit} aria-describedby="aviso-cadastro">
        <label htmlFor="nome">Nome fictício</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          autoComplete="off"
          maxLength={100}
          required
        />

        <label htmlFor="email">E-mail fictício</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          autoComplete="off"
          required
        />

        <label htmlFor="senha">Senha de demonstração</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          autoComplete="new-password"
          minLength={8}
          aria-describedby="ajuda-senha"
          required
        />
        <small id="ajuda-senha">
          Pelo menos 8 caracteres. Não reutilize uma senha real.
        </small>

        <label htmlFor="perfil">Tipo de conta</label>
        <select
          id="perfil"
          value={perfil}
          onChange={(evento) => setPerfil(evento.target.value)}
          required
        >
          <option value="doador">Doador</option>
          <option value="beneficiario">Beneficiário</option>
        </select>

        {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

        <button type="submit" disabled={processando}>
          {processando ? "Cadastrando..." : "Criar conta"}
        </button>
      </form>

      <p>Já possui conta? <Link to="/login">Entrar</Link></p>
    </main>
  );
}
