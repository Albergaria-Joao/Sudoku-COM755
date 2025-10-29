import { useState, useEffect } from "react";
import "./App.css";
import SudokuBoard from "./components/SudokuBoard";
import GenButton from "./components/GenButton";
import "./index.css";
import SolveButton from "./components/SolveButton";
import Timer from "./components/Timer";
import UploadBoard from "./components/UploadBoard";

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

  function onUpload(file: File | null): void {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const csvText = e.target?.result;
        if (csvText === undefined || csvText === null) {
          console.error("Erro ao ler o arquivo: resultado indefinido."); // Se não tiver esse check, dá erro
          return;
        }
        parseCSV(csvText);
      };
      reader.readAsText(file);
    }
  }

  function parseCSV(csvText: string | ArrayBuffer | null) {
    if (typeof csvText !== "string") {
      console.error("CSV text is not a string.");
      return;
    }
    const rows = csvText.split("\n");
    const newBoard: number[][] = [];
    for (let i = 0; i < 9; i++) {
      const row = rows[i].split(",").map(Number);
      if (
        row.length === 9 &&
        row.every((num) => !isNaN(num) && num >= 0 && num <= 9)
      ) {
        newBoard.push(row);
      } else {
        console.error(`Invalid row in CSV: ${rows[i]}`);
        return; // Stop parsing if any row is invalid
      }
    }
    setTabuleiro(newBoard);
  }

  return (
    <div>
      <SudokuBoard tab={tabuleiro}></SudokuBoard>
      <GenButton onGenGameClick={onGenGameClick}></GenButton>
      <SolveButton onSolveClick={onSolveClick}></SolveButton>
      <Timer t={time}></Timer>
      <UploadBoard onUpload={onUpload}></UploadBoard>
    </div>
  );
}

export default App;
