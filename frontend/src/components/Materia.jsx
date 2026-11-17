import { MATERIAS } from "../materias";

// Nome oficial da matéria entre parênteses, logo depois do título.
export default function Materia({ de }) {
  return <span className="materia"> ({MATERIAS[de]})</span>;
}
