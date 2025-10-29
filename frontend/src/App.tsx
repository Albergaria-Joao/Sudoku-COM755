import { useState, useEffect } from "react";
import "./App.css";
import SudokuBoard from "./components/SudokuBoard";
import GenButton from "./components/GenButton";
import "./index.css";
import SolveButton from "./components/SolveButton";
import Timer from "./components/Timer";

function App() {
  const [tabuleiro, setTabuleiro] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );
  const [time, setTime] = useState<number>(0);

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

  useEffect(() => {
    onGenGameClick();
  }, []);

  async function onSolveClick(): Promise<void> {
    const res = await fetch("http://localhost:5000/resolver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: tabuleiro }),
    });
    console.log("resolveu");
    const data = await res.json();
    setTime(data["time"]);
    setTabuleiro(data["tabuleiro"]);

    console.log(time);
    //alert(data.valido ? "✅ Sudoku válido!" : "❌ Sudoku inválido!");
  }
  return (
    <div>
      <SudokuBoard tab={tabuleiro}></SudokuBoard>
      <GenButton onGenGameClick={onGenGameClick}></GenButton>
      <SolveButton onSolveClick={onSolveClick}></SolveButton>
      <Timer t={time}></Timer>
    </div>
  );
}

export default App;
