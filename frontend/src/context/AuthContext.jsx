import { useState } from "react";
import { AuthContext } from "./auth";

const CONTAS_KEY = "fomezero.contas.v1";
const SESSAO_KEY = "fomezero.sessao.v1";
const ITERACOES = 600000;



function lerContas() {
  const texto = localStorage.getItem(CONTAS_KEY);
  if (!texto) return [];

  const contas = JSON.parse(texto);
  if (!Array.isArray(contas)) {
    throw new Error("O cadastro local está inválido.");
  }

  return contas;
}

function dadosPublicos(conta) {
  return {
    id: conta.id,
    nome: conta.nome,
    email: conta.email,
    perfil: conta.perfil,
  };
}

function carregarSessao() {
  try {
    const id = localStorage.getItem(SESSAO_KEY);
    if (!id) return null;

    const conta = lerContas().find((item) => item.id === id);
    return conta ? dadosPublicos(conta) : null;
  } catch {
    return null;
  }
}

async function derivarSenha(senha, salt, iteracoes) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Abra o app em localhost ou HTTPS para usar o login local.");
  }

  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(senha),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: iteracoes,
      hash: "SHA-256",
    },
    chave,
    256,
  );

  return Array.from(new Uint8Array(bits));
}

function hashesIguais(a, b) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i += 1) {
    diferenca |= a[i] ^ b[i];
  }
  return diferenca === 0;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(carregarSessao);

  function iniciarSessao(conta) {
    localStorage.setItem(SESSAO_KEY, conta.id);
    const dados = dadosPublicos(conta);
    setUsuario(dados);
    return dados;
  }

  async function cadastrar({ nome, email, senha, perfil }) {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      throw new Error("Informe um nome fictício e um e-mail válido.");
    }

    if (senha.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres.");
    }

    if (!["doador", "beneficiario"].includes(perfil)) {
      throw new Error("Selecione um perfil válido.");
    }

    if (lerContas().some((conta) => conta.email === emailLimpo)) {
      throw new Error("Já existe uma conta local com esse e-mail.");
    }

    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)));
    const hash = await derivarSenha(senha, salt, ITERACOES);

    const contas = lerContas();
    if (contas.some((conta) => conta.email === emailLimpo)) {
      throw new Error("Já existe uma conta local com esse e-mail.");
    }

    const conta = {
      id: crypto.randomUUID(),
      nome: nomeLimpo,
      email: emailLimpo,
      perfil,
      salt,
      hash,
      iteracoes: ITERACOES,
    };

    localStorage.setItem(CONTAS_KEY, JSON.stringify([...contas, conta]));
    return iniciarSessao(conta);
  }

  async function entrar({ email, senha }) {
    const emailLimpo = email.trim().toLowerCase();
    const conta = lerContas().find((item) => item.email === emailLimpo);

    if (!conta) {
      throw new Error("E-mail ou senha incorretos.");
    }

    const hash = await derivarSenha(senha, conta.salt, conta.iteracoes);

    if (!hashesIguais(hash, conta.hash)) {
      throw new Error("E-mail ou senha incorretos.");
    }

    return iniciarSessao(conta);
  }

  function sair() {
    localStorage.removeItem(SESSAO_KEY);
    localStorage.removeItem("fomezero.usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cadastrar, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}
