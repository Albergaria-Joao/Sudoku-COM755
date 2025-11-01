import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // caminho relativo ao index.ts

const prisma = new PrismaClient();

async function seed() {
  // tenta deletar usuário se existir
  await prisma.usuario
    .delete({ where: { login: "joao" } })
    .catch(() => console.log("Usuário não encontrado, criando novo"));

  // cria usuário com senha criptografada
  const user = await prisma.usuario.create({
    data: {
      login: "joao",
      senha: await bcrypt.hash("joao", 10), // campo correto é 'senha'
    },
  });

  console.log("Usuário criado:", user);
  console.log("Database has been seeded. 🌱");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
