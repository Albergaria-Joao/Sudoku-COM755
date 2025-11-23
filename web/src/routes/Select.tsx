import { useState, useEffect } from "react";
import "./../App.css";
import "./../index.css";
import GenButton from "../components/GenButton";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Select() {
  const api = "http://localhost:5000";
  const backend = "http://localhost:4000";
  console.log(api);
  const navigate = useNavigate();

  const [games, setGames] = useState<any[]>([]);

  async function getGames(): Promise<void> {
    const res = await fetch(`${backend}/get-games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("user_id") }),
    });

    const data = await res.json();
    setGames(data.games || []); // ← salva os jogos no estado
  }

  useEffect(() => {
    //onGenGameClick();
    if (!localStorage.getItem("user") || localStorage.getItem("user") === "") {
      navigate("/login");
      return;
    }

    getGames();
  }, []);

  async function onGenGameClick(): Promise<void> {
    const dif: number = Number(
      (document.getElementById("select_dif") as HTMLSelectElement).value
    );
    const nSol: number = Number(
      (document.getElementById("select_nsol") as HTMLSelectElement).value
    );
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

    const gameData = await gameDB.json();
    localStorage.setItem("game_id", gameData.gameId);
    console.log("Game ID:", gameData.gameId);
    //localStorage.setItem("game", "comecou");
    navigate("/", {
      state: {
        board: data["tabuleiro"],
      },
    });
  }

  function onLogoutClick() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Button onClick={onLogoutClick}>Logout</Button>

      <h1 className="text-2xl font-bold mb-6 text-center">
        Novo jogo: <GenButton onGenGameClick={onGenGameClick}></GenButton>
        Selecione a Dificuldade
      </h1>

      <table>
        <thead>
          <tr>
            <th>Criado</th>
            <th>Atualizado</th>
            <th>Dificuldade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="games-table">
          {games.length === 0 ? (
            <tr>
              <td colSpan={3}>Nenhum jogo encontrado</td>
            </tr>
          ) : (
            // Se não for vazio, mapeia os jogos
            games.map((game) => (
              <tr key={game.id}>
                <td>{new Date(game.createdAt).toLocaleString()}</td>
                <td>{new Date(game.updatedAt).toLocaleString()}</td>
                <td>{game.difficulty}</td>
                <td>{game.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
