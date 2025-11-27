import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Game from "./routes/Game.tsx";
import Login from "./routes/Login.tsx";
import Select from "./routes/Select.tsx";
import CreateUser from "./routes/CreateUser.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Imports para usar coisas de bibliotecas
// Incluindo importação de arquivos (como o App)

// Router que deve ser criado após instalar o React Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Game />, // O que será renderizado na página inicial
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/select",
    element: <Select />,
  },
  {
    path: "/cadastro",
    element: <CreateUser />,
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root nao encontrado");

createRoot(rootElement).render(
  // Fazemos a inserção do HTML por meio do JS nessas linhas de código
  // Ou seja, ele vai criar (renderizar) nossa aplicação dentro da div com ID root no nosso HTML

  // A primeira letra do componente sempre deve ser maiúscula (para diferenciar de uma tag comum HTML)
  // StrictMode ajuda no processo de desenvolvimento
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
