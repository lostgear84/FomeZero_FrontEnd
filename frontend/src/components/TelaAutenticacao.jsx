import logoBranco from "../assets/marca/logo-branco.png";

// Moldura das telas de entrada e cadastro: fundo vermelho com o logo principal.
export default function TelaAutenticacao({ children }) {
  return (
    <div className="tela-autenticacao">
      <img src={logoBranco} alt="FOMEZERO" className="logo-autenticacao" />
      <p className="slogan-autenticacao">
        Comida que sobra vira doação. Doação que chega vira recompensa.
      </p>
      <main className="pagina-autenticacao">{children}</main>
    </div>
  );
}
