import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function seed() {
  await prisma.admin
    .delete({ where: { login: "joao" } })
    .catch((error) => console.log("nao encontrou"));

  await prisma.usuario.create({
    data: {
      login: "joao",
      hash: await bcrypt.hash("joao", 10),
    },
  });

  const user = await prisma.user.console.log(user);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
