import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Informe e-mail e senha para entrar.");
      return;
    }

    entrar({
      nome: email.split("@")[0],
      email,
      perfil: "doador",
    });

    navigate("/doador");
  }

  return (
    <main className="pagina-autenticacao">
      <h1>Entrar no FOMEZERO</h1>

      <p>
        Acesso local para demonstração acadêmica. Nenhum dado pessoal real é
        coletado.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          autoComplete="current-password"
          required
        />

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit">Entrar</button>
      </form>

      <p>
        Não possui conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </main>
  );
}
