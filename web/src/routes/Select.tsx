import { useState, useEffect } from "react";
import "./../App.css";
import "./../index.css";
import GenButton from "../components/GenButton";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

import UploadBoard from "../components/UploadBoard";
import { Trash, LogOut } from "lucide-react";

function Select() {
  const api = "http://localhost:5000";
  const backend = "http://localhost:4000";
  console.log(api);
  const navigate = useNavigate();

  // Estados para os jogos e leaderboard
  const [games, setGames] = useState<any[]>([]); 
  const [leaderboard, setLeaderboard] = useState<
    { id: string; name: string; score: number }[]
  >([]);

  // Pega os jogos para colocar na tabela
  async function getGames(): Promise<void> {
    const res = await fetch(`${backend}/get-games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("user_id") }),
    });

    const data = await res.json();
    setGames(data.games || []); // salva os jogos no estado
  }

  // Pega a leaderboard
  async function getLeaderboard(): Promise<void> {
    const res = await fetch(`${backend}/get-leaderboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("user_id") }),
    });

    const data = await res.json();
    const lb: { id: string; name: string; score: number }[] = [];
    console.log(data);

    // Calcula as pontuações a partir da dificuldade dos jogos retornados (resolvidos) de cada usuário 
    for (let i = 0; i < data.users.length; i++) {
      let score = 0;

      for (let j = 0; j < data.users[i].games.length; j++) {
        score += data.users[i].games[j].difficulty + 1;
      }

      const name = data.users[i].login;
      const id = data.users[i].id;
      lb.push({ id, name, score });
    }
    console.log(lb);
    lb.sort((a, b) => b.score - a.score);
    setLeaderboard(lb || []);

    //setGames(data.games || []); // ← salva os jogos no estado
  }

  // Sempre executa quando carrega a página
  useEffect(() => {
    //onGenGameClick();
    if (!localStorage.getItem("user") || localStorage.getItem("user") === "") {
      navigate("/login");
      return;
    } else if (localStorage.getItem("game_on") === "true") {
      onLoadClick(localStorage.getItem("game_id") || "", Number(localStorage.getItem("game_diff")));
      return;
    }
    getLeaderboard();
    getGames();
  }, []);

  // Geração de jogo
  async function onGenGameClick(): Promise<void> {
    const dif: number = Number(
      (document.getElementById("select_dif") as HTMLSelectElement).value
    );
    const nSol: number = Number(
      (document.getElementById("select_nsol") as HTMLSelectElement).value
    );

    // Faz request para o C++ gerar o tabuleiro
    const res = await fetch(`${api}/gerar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dificuldade: dif, nSolucoes: nSol }),
    });
    if (res.status !== 200) {
      alert("Erro ao gerar o jogo. Limite de tentativas atingido.");
      return;
    }
    const data = await res.json();

    // Coloca o tabuleiro no DB
    const gameDB = await fetch(`${backend}/create-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board: data["tabuleiro"],
        generatedBoard: data["tabuleiro"],
        diff: dif,
        userId: localStorage.getItem("user_id"),
      }),
    });

    // Salva no localstorage, etc
    const gameData = await gameDB.json();
    localStorage.setItem("game_id", gameData.gameId);
    localStorage.setItem("game_diff", dif.toString());
    console.log("Game ID:", gameData.gameId);
    //localStorage.setItem("game", "comecou");
    localStorage.setItem("game_on", "true");
    localStorage.setItem("saved_game", JSON.stringify(data["tabuleiro"]));
    navigate("/game", {
      state: {
        generatedBoard: data["tabuleiro"],
      },
    });
  }

  function onLogoutClick() {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    navigate("/login");
  }

  // Carregar jogo salvo da tabela
  async function onLoadClick(gameId: string, gameDif: number): Promise<void> {
    console.log("Loading game ID:", gameId);
    const gameDB = await fetch(`${backend}/load-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: gameId,
      }),
    });

    // Salva no localstorage, etc
    const gameData = await gameDB.json();
    localStorage.setItem("game_id", gameData.gameId);
    localStorage.setItem("game_diff", gameDif.toString());
    localStorage.setItem("game_on", "true");
    localStorage.setItem("saved_game", JSON.stringify(gameData["board"]));
    localStorage.setItem(
      "game_solved",
      gameData.gameStatus.startsWith("Resolvido")
    );

    //console.log("RESOLVIDO", localStorage.getItem("game_solved"));
    navigate("/game", {
      state: {
        generatedBoard: gameData["generatedBoard"],
      },
    });
  }

  // Deletar jogo
  async function onDeleteClick(gameId: string): Promise<void> {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar este jogo? Esta ação não pode ser desfeita."
    );
    if (confirmDelete === false) {
      return;
    }

    await fetch(`${backend}/delete-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: gameId,
      }),
    });
    getGames();
  }

  // Upload de arquivo CSV
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

  // Faz o parsing do CSV para o formato do jogo (matriz)
  async function parseCSV(csvText: string | ArrayBuffer | null) {
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

    // Cria o jogo a partir dessa matriz

    const gameDB = await fetch(`${backend}/create-game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board: newBoard,
        generatedBoard: newBoard,
        diff: 5,
        userId: localStorage.getItem("user_id"),
      }),
    });

    // Salva no localstorage, etc
    const gameData = await gameDB.json();
    localStorage.setItem("game_id", gameData.gameId);
    localStorage.setItem("game_diff", "6");
    console.log("Game ID:", gameData.gameId);
    //localStorage.setItem("game", "comecou");
    localStorage.setItem("game_on", "true");
    localStorage.setItem("saved_game", JSON.stringify(newBoard));
    navigate("/game", {
      state: {
        generatedBoard: newBoard,
      },
    });
    
  }


  const dificuldades = ["Fácil", "Médio", "Difícil", "Expert", "Insano", "[CSV]"];
  

return (
  <div className="min-h-screen bg-gray-900 text-white flex">

    <div className="absolute top-4 left-7">
      <Button onClick={onLogoutClick} className="flex items-center gap-2">
        <LogOut />
        Logout
      </Button>
    </div>

    <div className="w-1/3 p-8 flex flex-col gap-10 mt-5">

      <h1 className="text-2xl font-bold">
        Bem-vindo, {localStorage.getItem("user")}
      </h1>

      <GenButton onGenGameClick={onGenGameClick} />
      <UploadBoard onUpload={onUpload} />

      <div>
        <h2 className="text-xl font-semibold mb-3">Leaderboard</h2>

        <table className="w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-3">Usuário</th>
              <th className="p-3">Pontuação</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center p-4 text-gray-300">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              leaderboard.map((leader) => (
                <tr key={leader.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{leader.name}</td>
                  <td className="p-3">{leader.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    <div className="w-2/3 p-8">
      <h2 className="text-2xl font-bold mb-4">Seus jogos</h2>

      <table className="w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="p-3">Atualizado</th>
            <th className="p-3">Criado</th>
            <th className="p-3">Dificuldade</th>
            <th className="p-3">Status</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>

        <tbody>
          {games.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-300">
                Nenhum jogo encontrado
              </td>
            </tr>
          ) : (
            games.map((game) => (
              <tr key={game.id} className="border-t border-gray-700 hover:bg-gray-700">
                <td className="p-3">
                  {new Date(game.updatedAt).toLocaleString()}
                </td>

                <td className="p-3">
                  {new Date(game.createdAt).toLocaleString()}
                </td>

                <td className="p-3">
                  {dificuldades[game.difficulty]}
                </td>

                <td className="p-3">{game.status}</td>

                <td className="p-3 flex gap-3">
                  <Button onClick={() => onLoadClick(game.id, game.difficulty)}>
                    Carregar
                  </Button>

                  <button
                    className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
                    onClick={() => onDeleteClick(game.id)}
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

  </div>
);



}

export default Select;
