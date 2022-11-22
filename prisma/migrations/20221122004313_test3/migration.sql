/*
  Warnings:

  - You are about to drop the `dia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "dia";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "dias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dia" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "dias_dia_key" ON "dias"("dia");
