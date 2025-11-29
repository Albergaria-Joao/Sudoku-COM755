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

// Verifica as credenciais de login
app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body; // pega os dados do corpo da request
    const user = await prisma.user.findUnique({ where: { login } });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const isValid = await bcrypt.compare(password, user.password); // Encontrando um usuário, compara a senha dada com a armazenada para ele

    if (!isValid) {
      return res.status(401).json({ error: "password incorreta" });
    }

    res.json({ status: 200, login: user.login, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

// Criar usuário com login e senha fornecidos
app.post("/create-user", async (req, res) => {
  try {
    const { login, password } = req.body;
    if (await prisma.user.findUnique({ where: { login: login } })) {
      return res.json({
        status: 409,
        mensagem: "Já existe um usuário com este login",
      });
    }

    //console.log(board);
    const newUser = await prisma.user.create({
      data: {
        login: login,
        password: await bcrypt.hash(password, 10),
      },
    });

    return res.json({
      status: 200,
      login: newUser.login,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

// Criar jogo
app.post("/create-game", async (req, res) => {
  try {
    const { board, generatedBoard, userId, diff } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    //console.log(board);
    const game = await prisma.game.create({
      data: {
        curr_board: board,
        gen_board: generatedBoard,
        difficulty: diff,
        user: {
          connect: { id: userId },
        },
      },
    });

    res.json({
      status: 200,
      login: user.login,
      userId: user.id,
      gameId: game.id,
      gameStatus: game?.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

// Pega a tabela de jogos
app.post("/get-games", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        games: {
          orderBy: {
            updatedAt: "desc", // string 'asc' ou 'desc'
          },
        },
      },
    });

    const gamesList = user?.games;

    res.json({
      status: 200,
      games: gamesList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

// Carrega jogo salvo
app.post("/load-game", async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await prisma.game.findUnique({ where: { id: gameId } });

    const gamesList = game?.games;

    res.json({
      status: 200,
      gameId: game?.id,
      board: game?.curr_board,
      generatedBoard: game?.gen_board,
      gameStatus: game?.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

  // Deleta jogo
app.post("/delete-game", async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await prisma.game.delete({ where: { id: gameId } });

    res.json({
      status: 200,
      gameId: game?.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

// Salva jogo
app.post("/save-game", async (req, res) => {
  try {
    const { gameId, board } = req.body;

    //console.log(board);
    const update = await prisma.game.update({
      where: { id: gameId },
      data: {
        curr_board: board,
      },
    });

    res.json({
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

// Atualiza status (de "em andamento" para "Resolvido", por ex)
app.post("/update-status", async (req, res) => {
  try {
    const { gameId, status } = req.body;

    console.log(status);
    const update = await prisma.game.update({
      where: { id: gameId },
      data: {
        status: status,
      },
    });

    res.json({
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

// Pega a tabela de usuários, junto com os jogos resolvidos deles
app.post("/get-leaderboard", async (req, res) => {
  try {
    const { userId } = req.body;

    const users = await prisma.user.findMany({
      include: {
        games: {
          where: {
            status: "Resolvido",
          },
        },
      },
    });

    // const gamesList = user?.games;

    res.json({
      status: 200,
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  }
});

app.listen(4000, () => console.log("API rodando em http://localhost:4000"));
