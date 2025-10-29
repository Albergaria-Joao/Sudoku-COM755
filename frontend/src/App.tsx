import { useState } from "react";
import "./App.css";
import SudokuBoard from "./components/SudokuBoard";
import GenButton from "./components/GenButton";
import "./index.css";

function App() {
  const [tabuleiro, setTabuleiro] = useState(0);

  async function onGenGameClick(): Promise<void> {
    const res = await fetch("http://localhost:5000/gerar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setTabuleiro(data["tabuleiro"]);
    //console.log(data["tabuleiro"]);
    //alert(data.valido ? "✅ Sudoku válido!" : "❌ Sudoku inválido!");
  }

  return (
    <div>
      <SudokuBoard tab={tabuleiro}></SudokuBoard>
      <GenButton onGenGameClick={onGenGameClick}></GenButton>
    </div>
  );
}

export default App;
