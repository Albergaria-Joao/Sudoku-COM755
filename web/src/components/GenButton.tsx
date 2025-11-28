import Button from "./Button";
import { useNavigate } from "react-router-dom";

function GenButton({ onGenGameClick }: { onGenGameClick: () => void }) {
  const navigate = useNavigate();
  // Formata a parte de gerar o jogo
  return (
  <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
    <h2 className="text-xl font-semibold mb-3">Novo jogo</h2>

    <div className="flex items-end gap-6">

      {/* Dificuldade */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Dificuldade:</label>
        <select id="select_dif" className="bg-gray-700 p-2 rounded text-white">
          <option value={0}>Fácil</option>
          <option value={1}>Médio</option>
          <option value={2}>Difícil</option>
          <option value={3}>Expert</option>
          <option value={4}>Insano</option>
        </select>
      </div>

      {/* Nº de soluções */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Nº de soluções:</label>
        <select id="select_nsol" className="bg-gray-700 p-2 rounded text-white">
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>

      <Button onClick={() => onGenGameClick()}>
        Gerar
      </Button>
    </div>
  </div>
);


}

export default GenButton;
