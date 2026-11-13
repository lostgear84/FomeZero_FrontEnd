import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "fomezero.usuario";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (dadosSalvos) {
      try {
        setUsuario(JSON.parse(dadosSalvos));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function entrar(dados) {
    const usuarioAutenticado = {
      nome: dados.nome,
      email: dados.email,
      perfil: dados.perfil,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioAutenticado));
    setUsuario(usuarioAutenticado);
  }

  function sair() {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return contexto;
}
