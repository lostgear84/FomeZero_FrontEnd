import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Cadastro() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("doador");
  const [erro, setErro] = useState("");

  function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha nome, e-mail e senha.");
      return;
    }

    entrar({
      nome,
      email,
      perfil,
    });

    navigate(perfil === "beneficiario" ? "/beneficiario" : "/doador");
  }

  return (
    <main className="pagina-autenticacao">
      <h1>Criar conta</h1>

      <p>
        Cadastro local para demonstração acadêmica. Use apenas dados sintéticos.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          autoComplete="name"
          required
        />

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
          autoComplete="new-password"
          required
        />

        <label htmlFor="perfil">Perfil</label>
        <select
          id="perfil"
          value={perfil}
          onChange={(evento) => setPerfil(evento.target.value)}
        >
          <option value="doador">Doador</option>
          <option value="beneficiario">Beneficiário</option>
        </select>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit">Criar conta</button>
      </form>

      <p>
        Já possui conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  );
}
