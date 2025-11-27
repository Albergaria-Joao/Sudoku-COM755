import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
//import "./App.css";

import "../index.css";

function Login() {
  const backend = "http://localhost:4000";
  const navigate = useNavigate();

  useEffect(() => {
    //onGenGameClick();
    if (localStorage.getItem("user")) {
      navigate("/select");
    }
  }, []); // Roda isso logo que carregar a página

  async function verifyLogin(login: string, pass: string): Promise<void> {
    const res = await fetch(`${backend}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password: pass }),
    });

    const data = await res.json();

    if (data.status === 200) {
      localStorage.setItem("user", login);
      localStorage.setItem("user_id", data.userId);
      console.log(localStorage.getItem("user_id"));
      navigate("/select");
    } else {
      alert("Usuário ou senha incorretos!");
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="p-6 bg-white shadow-md rounded">
        <label htmlFor="login">Usuário:</label>
        <input
          className="bg-slate-100 border border-gray-400 rounded mx-2"
          type="text"
          id="login"
          name="login"
        />
        <br />
        <br />
        <label htmlFor="password">Senha:</label>
        <input
          className="bg-slate-100 border border-gray-400 rounded mx-2"
          type="password"
          id="senha"
          name="senha"
        />
        <br />
        <br />
        <Button
          onClick={(e) => {
            e.preventDefault();
            verifyLogin(
              (document.getElementById("login") as HTMLInputElement).value,
              (document.getElementById("senha") as HTMLInputElement).value
            );
          }}
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
