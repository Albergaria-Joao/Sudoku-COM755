/*
  Warnings:

  - You are about to drop the `tabuleiro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."tabuleiro";

-- CreateTable
CREATE TABLE "jogo" (
    "id" TEXT NOT NULL,
    "tabuleiro_atual" TEXT NOT NULL,
    "tabuleiro_gerado" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "jogo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jogo" ADD CONSTRAINT "jogo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
