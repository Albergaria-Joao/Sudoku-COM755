import { useState, useEffect } from "react";
import "./../App.css";
import SudokuBoard from "../components/SudokuBoard";
import "./../index.css";
import SolveButton from "../components/SolveButton";
import Timer from "../components/Timer";

import Button from "../components/Button";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { DownloadIcon, ArrowLeftToLineIcon } from "lucide-react";
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
  
  // Estados para o tabuleiro atual e o tabuleiro inicial (gerado)

  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );
  const [generatedBoard, setGeneratedBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  ); // Tabuleiro gerado para ver quais são as células que não podem ser alteradas
  const [time, setTime] = useState<number[]>([0, 0, 0]);
  const [solved, setSolved] = useState<boolean>(false);

  // Função para carregar o tabuleiro salvo localmente (ex: a página foi recarregada/fechada)
  function loadSavedBoard() {
    const saved = localStorage.getItem("saved_game");
    //console.log("Saved game:", saved);
    return saved ? JSON.parse(saved) : Array(9).fill(Array(9).fill(0));
  }

  useEffect(() => {
    //onGenGameClick();
    console.log(localStorage.getItem("game_on"));
    if (!localStorage.getItem("user") || localStorage.getItem("user") === "") { // Se não estiver logado
      navigate("/login");
    } else if (localStorage.getItem("game_on") === "true") { // Se estiver com jogo em curso, ele carrega o tabuleiro
      // console.log("Carregando jogo salvo...", state.board);
      setBoard(loadSavedBoard());
      setGeneratedBoard(
        state?.generatedBoard || Array(9).fill(Array(9).fill(0))
      );
    } else {
      navigate("/");
    }
    console.log(localStorage.getItem("game_diff"));
    if (localStorage.getItem("game_solved") === "true") { // Se o jogo estiver resolvido, já atualiza o estado dele ==> vai desabilitar o tabuleiro e deixar verde
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
  async function onSolveClick(): Promise<void> { // Resolver por algoritmo
    const res = await fetch(`${api}/resolver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tabuleiro: generatedBoard }),
    }); // Manda o C++ resolver
    //console.log("resolveu");
    const data = await res.json();
    if (data.sucesso == false) {
      alert("Solução não encontrada");
      return;
    }
    // Seta os valores recebidos na response
    console.log(data["tempo"]);
    setTime(data["tempo"]);
    setBoard(data["tabuleiro"]);
    setSolved(true);
    
    // Atualiza o status do jogo no banco de dados
    fetch(`${backend}/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: localStorage.getItem("game_id"),
        status: "Resolvido com algoritmo",
      }),
    });

    console.log(time);
  }

  // Para setar o estado do tabuleiro nesse componente pai, a partir do filho SudokuBoard
  function setBoardState(newBoard: number[][]) {
    setBoard(newBoard);
  }

  // Método para salvar o jogo quando clicar no botão de voltar
  async function onSaveClick(): Promise<void> {
    console.log("Salvando jogo...", localStorage.getItem("game_id"));
    const confirmSave = window.confirm(
      "Tem certeza que deseja voltar à seleção? O progresso atual será salvo."
    );
    
    if (confirmSave === false) {
      return;
    }
    // Salva o tabuleiro atual do jogo correspondente no banco de dados
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
    localStorage.setItem("game_diff", "");
    localStorage.setItem("game_on", "false");
    localStorage.setItem("saved_game", "");
    localStorage.setItem("game_solved", "false");
    navigate("/");
  }

  // Checa se o último input resolveu o jogo 
  function checkSolved(
    validMatrix: boolean[][],
    board: number[][],
  ): void {
    if (
      !board.flat().every((m) => m !== 0) ||
      !validMatrix.flat().every((v) => v === true)
    ) {
      setSolved(false);
      //console.log("Checou solved:", solved);
      return;
    }

    // Se tiver sido um jogo gerado a partir de arquivo CSV, dá um status diferente para não contabilizar na leaderboard
    let gameStatus;
    if (localStorage.getItem("game_diff") == "6") {
      gameStatus = "Resolvido (CSV)";
    } else {
      console.log("não pegou dif")
      gameStatus = "Resolvido";
    }

    fetch(`${backend}/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: localStorage.getItem("game_id"),
        status: gameStatus,
      }),
    });

    setSolved(true);
  }

  // Exportar o tabuleiro como CSV
  function exportCSV(board: number[][]) {
    const csvContent = board
      .map(row => row.join(","))  // transforma cada linha em valores separados por vírgula
      .join("\n");                // quebra de linha entre cada linha

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tabuleiro.csv";  // nome do arquivo
    link.click();

    URL.revokeObjectURL(url);
  }


  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">

    {/* Botão no canto superior esquerdo */}
    <div className="absolute top-4 left-4">
      <Button onClick={onSaveClick} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                 transition-all rounded-lg font-semibold shadow-md inline-flex">
                  <ArrowLeftToLineIcon className="mr-2"/>Voltar
      </Button>
    </div>

    <div className="max-w-6xl mx-auto mt-16">

      {/* Título centralizado */}
      {/* <h1 className="text-4xl font-bold mb-8 text-center">
        Sudoku
      </h1> */}

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* TABULEIRO */}
        <div className="md:col-span-2 bg-gray-800 rounded-xl shadow-xl p-6 flex justify-center">
          <SudokuBoard
            tab={board}
            generatedBoard={generatedBoard}
            solved={solved}
            setBoardState={setBoardState}
            checkSolved={checkSolved}
          />
        </div>

        <div className="flex flex-col gap-6">

          {/* Botão Exportar */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex justify-center">
            <button
              onClick={() => exportCSV(generatedBoard)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow inline-flex"
              >
              <DownloadIcon className="mr-2"/> Baixar em CSV
            </button>
          </div>


          {/* Botão Resolver */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex justify-center">
            <SolveButton onSolveClick={onSolveClick} />
          </div>

          {/* Timer */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <Timer t={time} />
          </div>

        </div>
      </div>

    </div>
  </div>
);

}

export default Game;
