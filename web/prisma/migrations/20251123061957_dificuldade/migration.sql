/*
  Warnings:

  - Added the required column `dificuldade` to the `jogo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jogo" ADD COLUMN     "dificuldade" INTEGER NOT NULL;
