import { Navigate, useLocation } from "react-router-dom";
import { destinoDoPerfil, useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  const { pathname } = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const destino = destinoDoPerfil(usuario.perfil);

  if (pathname === "/") {
    return <Navigate to={destino} replace />;
  }

  const rotaDoador =
    pathname === "/doador" ||
    pathname.startsWith("/doador/") ||
    pathname === "/recompensas" ||
    pathname.startsWith("/recompensas/");

  const rotaBeneficiario =
    pathname === "/beneficiario" ||
    pathname.startsWith("/beneficiario/");

  if (
    (rotaDoador && usuario.perfil !== "doador") ||
    (rotaBeneficiario && usuario.perfil !== "beneficiario")
  ) {
    return <Navigate to={destino} replace />;
  }

  return children;
}
