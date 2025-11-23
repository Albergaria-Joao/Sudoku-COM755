/*
  Warnings:

  - You are about to drop the `jogo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."jogo" DROP CONSTRAINT "jogo_usuarioId_fkey";

-- DropTable
DROP TABLE "public"."jogo";

-- DropTable
DROP TABLE "public"."usuario";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "curr_board" JSONB NOT NULL,
    "gen_board" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Em andamento',
    "userId" TEXT NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
