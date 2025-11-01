-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_login_key" ON "usuario"("login");
