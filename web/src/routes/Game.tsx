import { useState, useEffect } from "react";
import "./../App.css";
import SudokuBoard from "../components/SudokuBoard";
import "./../index.css";
import SolveButton from "../components/SolveButton";
import Timer from "../components/Timer";
import UploadBoard from "../components/UploadBoard";
import Button from "../components/Button";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
type StateType = {
  generatedBoard: number[][];
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
  const [time, setTime] = useState<number[]>([0, 0, 0]);
  const [solved, setSolved] = useState<boolean>(false);

  function loadSavedBoard() {
    const saved = localStorage.getItem("saved_game");
    //console.log("Saved game:", saved);
    return saved ? JSON.parse(saved) : Array(9).fill(Array(9).fill(0));
  }

  useEffect(() => {
    //onGenGameClick();
    console.log(localStorage.getItem("game_on"));
    if (!localStorage.getItem("user") || localStorage.getItem("user") === "") {
      navigate("/login");
    } else if (localStorage.getItem("game_on") === "true") {
      // console.log("Carregando jogo salvo...", state.board);
      setBoard(loadSavedBoard());
      setGeneratedBoard(
        state?.generatedBoard || Array(9).fill(Array(9).fill(0))
      );
    } else {
      navigate("/select");
    }

    if (localStorage.getItem("game_solved") === "true") {
      setSolved(true);
    }
  }, []); // Roda isso logo que carregar a página

  useEffect(() => {
    function handleBeforeUnload() {
      // salva o jogo no localstorage antes de fechar/recarregar a aba
      localStorage.setItem("saved_game", JSON.stringify(board));
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [board]);

  console.log(generatedBoard);
  async function onSolveClick(): Promise<void> {
    const res = await fetch(`${api}/resolver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: generatedBoard }),
    });
    //console.log("resolveu");
    const data = await res.json();
    if (data.sucesso == false) {
      alert("Solução não encontrada");
      return;
    }
    console.log(data["tempo"]);
    setTime(data["tempo"]);
    setBoard(data["tabuleiro"]);
    setSolved(true);

    const update = fetch(`${backend}/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: localStorage.getItem("game_id"),
        status: "Resolvido com algoritmo",
      }),
    });

    console.log(time);
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

  function setBoardState(newBoard: number[][]) {
    setBoard(newBoard);
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
    setGeneratedBoard(newBoard);
  }

  async function onSaveClick(): Promise<void> {
    console.log("Salvando jogo...", localStorage.getItem("game_id"));
    let confirmSave = window.confirm(
      "Tem certeza que deseja voltar à seleção? O progresso atual será salvo."
    );

    if (confirmSave === false) {
      return;
    }

    const res = await fetch(`${backend}/save-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: localStorage.getItem("game_id"),
        board: board,
      }),
    });

    // Salva no localstorage, etc
    if (res.status !== 200) {
      alert("Erro ao salvar o jogo.");
      return;
    }
    localStorage.setItem("game_id", "");
    localStorage.setItem("game_on", "false");
    localStorage.setItem("saved_game", "");
    localStorage.setItem("game_solved", "false");
    navigate("/select");
  }

  function checkSolved(
    validMatrix: boolean[][],
    board: number[][],
    i: number,
    j: number
  ): void {
    if (
      !board.flat().every((m) => m !== 0) ||
      !validMatrix.flat().every((v) => v === true)
    ) {
      setSolved(false);
      //console.log("Checou solved:", solved);
      return;
    }

    const res = fetch(`${backend}/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: localStorage.getItem("game_id"),
        status: "Resolvido",
      }),
    });

    setSolved(true);
  }

  return (
    <div>
      <h1>Bem-vindo, {localStorage.getItem("usuario")}</h1>
      <Button onClick={onSaveClick}>Voltar à seleção</Button>
      <SudokuBoard
        tab={board}
        generatedBoard={generatedBoard}
        solved={solved}
        setBoardState={setBoardState}
        checkSolved={checkSolved}
      ></SudokuBoard>
      <SolveButton onSolveClick={onSolveClick}></SolveButton>
      <Timer t={time}></Timer>
      <UploadBoard onUpload={onUpload}></UploadBoard>
    </div>
  );
}

export default Game;
