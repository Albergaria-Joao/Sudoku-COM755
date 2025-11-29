import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
//import "./App.css";

import "../index.css";

function CreateUser() {
  const backend = "http://localhost:4000";
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/select");
    }
  }, []);

  // Faz o cadastro do usuário
  async function createUser(login: string, pass: string): Promise<void> {
    const res = await fetch(`${backend}/create-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password: pass }),
    });

    const data = await res.json();

    if (data.status === 200) {
      navigate("/login");
    } else {
      alert("Erro no cadastro. Já existe um usuário com esse login!");
    }
  }
  return (
  <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white">
    

    <form className="w-80 p-6 bg-zinc-800 shadow-xl shadow-black/40 rounded-2xl flex flex-col gap-5 border border-zinc-700">
      <h1>Cadastro</h1>
      <div className="flex flex-col">
        <label htmlFor="login" className="text-sm font-medium text-zinc-300">
          Usuário
        </label>
        <input
          className="mt-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          type="text"
          id="login"
          name="login"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="senha" className="text-sm font-medium text-zinc-300">
          Senha
        </label>
        <input
          className="mt-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          type="password"
          id="senha"
          name="senha"
        />
      </div>

      <Button
        onClick={(e) => {
          e.preventDefault();
          createUser(
            (document.getElementById("login") as HTMLInputElement).value,
            (document.getElementById("senha") as HTMLInputElement).value
          );
        }}
      >
        Cadastrar
      </Button>
    </form>
  </div>
  );
}

export default CreateUser;
