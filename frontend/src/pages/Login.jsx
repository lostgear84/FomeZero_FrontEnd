import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { destinoDoPerfil, useAuth } from "../context/auth";

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");
    setProcessando(true);

    try {
      const usuario = await entrar({ email, senha });
      navigate(destinoDoPerfil(usuario.perfil), { replace: true });
    } catch (erroLogin) {
      setErro(erroLogin.message || "Não foi possível entrar.");
    } finally {
      setProcessando(false);
    }
  }

  return (
    <main className="pagina-autenticacao">
      <h1>Entrar no FOMEZERO</h1>
      <p id="aviso-login">
        Autenticação local de demonstração. Entre com uma conta fictícia
        cadastrada neste navegador.
      </p>

      <form onSubmit={handleSubmit} aria-describedby="aviso-login">
        <label htmlFor="email">E-mail fictício</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="senha">Senha de demonstração</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          autoComplete="current-password"
          required
        />

        {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

        <button type="submit" disabled={processando}>
          {processando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>Não possui conta? <Link to="/cadastro">Criar conta</Link></p>
    </main>
  );
}
