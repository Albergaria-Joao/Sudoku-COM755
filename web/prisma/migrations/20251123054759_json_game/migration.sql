/*
  Warnings:

  - Changed the type of `tabuleiro_atual` on the `jogo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tabuleiro_gerado` on the `jogo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "jogo" DROP COLUMN "tabuleiro_atual",
ADD COLUMN     "tabuleiro_atual" JSONB NOT NULL,
DROP COLUMN "tabuleiro_gerado",
ADD COLUMN     "tabuleiro_gerado" JSONB NOT NULL;
