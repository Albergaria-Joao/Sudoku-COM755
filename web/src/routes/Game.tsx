import { useState, useEffect } from "react";
import "./../App.css";
import SudokuBoard from "../components/SudokuBoard";
import GenButton from "../components/GenButton";
import "./../index.css";
import SolveButton from "../components/SolveButton";
import Timer from "../components/Timer";
import UploadBoard from "../components/UploadBoard";
import Button from "../components/Button";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
type StateType = {
  board: number[][];
};

function Game() {
  const api = "http://localhost:5000";
  const backend = "http://localhost:4000";

  console.log(api);
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as StateType;

  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );
  const [generatedBoard, setGeneratedBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  ); // Tabuleiro gerado para ver quais são as células que não podem ser alteradas
  const [time, setTime] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);

  useEffect(() => {
    //onGenGameClick();
    if (!localStorage.getItem("user") || localStorage.getItem("user") === "") {
      navigate("/login");
    } else {
      setBoard(state?.board || Array(9).fill(Array(9).fill(0)));
      setGeneratedBoard(state?.board || Array(9).fill(Array(9).fill(0)));
    }
  }, []); // Roda isso logo que carregar a página

  async function onSolveClick(): Promise<void> {
    const res = await fetch(`${api}/resolver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: generatedBoard }),
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
    const res = await fetch(`${api}/verificar`, {
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

  async function onSaveClick(): Promise<void> {
    const res = await fetch(`${backend}/save-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board,
        generatedBoard,
        userId: localStorage.getItem("user_id"),
      }),
    });
  }

  return (
    <div>
      <h1>Bem-vindo, {localStorage.getItem("usuario")}</h1>
      <Button onClick={onSaveClick}>Novo Jogo</Button>
      <SudokuBoard
        tab={board}
        generatedBoard={generatedBoard}
        onNewValue={onNewValue}
        solved={solved}
      ></SudokuBoard>
      <SolveButton onSolveClick={onSolveClick}></SolveButton>
      <Timer t={time}></Timer>
      <UploadBoard onUpload={onUpload}></UploadBoard>
    </div>
  );
}

export default Game;
