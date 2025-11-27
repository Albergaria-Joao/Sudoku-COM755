import Button from "./Button";
import { useNavigate } from "react-router-dom";

function GenButton({ onGenGameClick }: { onGenGameClick: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <h1>Dificuldade: </h1>
      <select id="select_dif" name="mySelectName">
        <option value={0}>Fácil</option>
        <option value={1}>Médio</option>
        <option value={2}>Difícil</option>
        <option value={3}>Expert</option>
        <option value={4}>Insano</option>
      </select>
      <h1>Nº de soluções: </h1>
      <select id="select_nsol" name="mySelectName">
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
      <Button onClick={() => onGenGameClick()}>Gerar novo jogo</Button>
    </div>
  );
}

export default GenButton;
