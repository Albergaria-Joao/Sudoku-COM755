import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: "../.env" }); // caminho relativo ao index.ts

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// rota de teste do banco
app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.usuario.findMany(); // troque 'user' pelo nome da sua tabela
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { login, senha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { login } });
    if (!usuario || !usuario.senha) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const isValid = await bcrypt.compare(senha, usuario.senha);

    if (!isValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    res.json({ status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

app.listen(4000, () => console.log("API rodando em http://localhost:4000"));
