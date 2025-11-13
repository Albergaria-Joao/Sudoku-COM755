import { useState, useEffect } from "react";
import "./App.css";
import SudokuBoard from "./components/SudokuBoard";
import GenButton from "./components/GenButton";
import "./index.css";
import SolveButton from "./components/SolveButton";
import Timer from "./components/Timer";
import UploadBoard from "./components/UploadBoard";
import Button from "./components/Button";

import { useNavigate } from "react-router-dom";

function App() {
  const backend = "http://localhost:5000";
  console.log(backend);
  const navigate = useNavigate();

  useEffect(() => {
    //onGenGameClick();
    if (
      !localStorage.getItem("usuario") ||
      localStorage.getItem("usuario") === ""
    ) {
      navigate("/login");
    }
  }, []); // Roda isso logo que carregar a página

  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );
  const [generatedBoard, setGeneratedBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );
  const [time, setTime] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);

  async function onGenGameClick(): Promise<void> {
    const dif: number = Number(
      (document.getElementById("select_dif") as HTMLSelectElement).value
    );
    const res = await fetch(`${backend}/gerar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dificuldade: dif }),
    });
    const data = await res.json();

    setBoard(data["tabuleiro"]);
    setGeneratedBoard(data["tabuleiro"]);
  }

  async function onSolveClick(): Promise<void> {
    const res = await fetch(`${backend}/resolver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: board }),
    });
    console.log("resolveu");
    const data = await res.json();
    setTime(data["time"]);
    setBoard(data["tabuleiro"]);
    setSolved(true);

    console.log(time);
  }

  async function onNewValue(
    r: number,
    c: number,
    num: number
  ): Promise<boolean> {
    const res = await fetch(`${backend}/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: board, r: r, c: c, num: num }),
    });
    const data = await res.json();
    //console.log(data["valido"]);
    if (data["valido"] == true) {
      return true;
    }

    return false;
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
      console.error("Não é string");
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
        console.error(`Erro no csv: ${rows[i]}`);
        return;
      }
    }
    setBoard(newBoard);
  }

  function onLogoutClick() {
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <div>
      <Button onClick={onLogoutClick}>Logout</Button>
      <SudokuBoard
        tab={board}
        generatedBoard={generatedBoard}
        onNewValue={onNewValue}
        solved={solved}
      ></SudokuBoard>
      <GenButton onGenGameClick={onGenGameClick}></GenButton>
      <SolveButton onSolveClick={onSolveClick}></SolveButton>
      <Timer t={time}></Timer>
      <UploadBoard onUpload={onUpload}></UploadBoard>
    </div>
  );
}

export default App;
