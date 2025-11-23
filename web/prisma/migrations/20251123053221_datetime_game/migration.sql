/*
  Warnings:

  - Added the required column `atualizado` to the `jogo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jogo" ADD COLUMN     "atualizado" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
