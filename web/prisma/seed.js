import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // caminho relativo ao index.ts

const prisma = new PrismaClient();

async function seed() {
  // tenta deletar usuário se existir
  await prisma.user
    .delete({ where: { login: "joao" } })
    .catch(() => console.log("Usuário não encontrado, criando novo"));

  // cria usuário com password criptografada
  const user = await prisma.user.create({
    data: {
      login: "joao",
      password: await bcrypt.hash("joao", 10), // campo correto é 'password'
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
