import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import DoadorHome from "./pages/DoadorHome";
import CadastroLote from "./pages/CadastroLote";
import MeusLotes from "./pages/MeusLotes";
import BeneficiarioHome from "./pages/BeneficiarioHome";
import LotesDisponiveis from "./pages/LotesDisponiveis";
import SolicitacaoCidadao from "./pages/SolicitacaoCidadao";
import PainelRecompensas from "./pages/PainelRecompensas";
import AssistenteConsulta from "./pages/AssistenteConsulta";
import RegistrarEntrega from "./pages/RegistrarEntrega";
import TriagemInteligente from "./pages/TriagemInteligente";
import RevisaoHumana from "./pages/RevisaoHumana";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoadorHome />} />

            <Route path="doador" element={<DoadorHome />} />
            <Route path="doador/cadastro-lote" element={<CadastroLote />} />
            <Route path="doador/meus-lotes" element={<MeusLotes />} />
            <Route path="doador/assistente" element={<AssistenteConsulta />} />
            <Route path="doador/triagem" element={<TriagemInteligente />} />

            <Route path="beneficiario" element={<BeneficiarioHome />} />
            <Route
              path="beneficiario/lotes-disponiveis"
              element={<LotesDisponiveis />}
            />
            <Route
              path="beneficiario/solicitacao"
              element={<SolicitacaoCidadao />}
            />
            <Route
              path="beneficiario/registrar-entrega"
              element={<RegistrarEntrega />}
            />

            <Route path="recompensas" element={<PainelRecompensas />} />

            <Route path="operador" element={<RevisaoHumana />} />
          </Route>

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
