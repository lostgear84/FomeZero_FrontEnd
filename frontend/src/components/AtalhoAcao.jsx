import { Link } from "react-router-dom";
import Materia from "./Materia";

// Atalho em cartão, com ícone, título e (quando houver) a matéria responsável.
export default function AtalhoAcao({ para, icone, titulo, materia }) {
  return (
    <li>
      <Link to={para}>
        <span className="icone-acao" aria-hidden="true">
          {icone}
        </span>
        <span>
          {titulo}
          {materia && <Materia de={materia} />}
        </span>
      </Link>
    </li>
  );
}
