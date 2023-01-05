/*
  Warnings:

  - Added the required column `type` to the `eventos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_eventos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "desc" TEXT NOT NULL,
    "veiculo" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "dataEvento" TEXT NOT NULL,
    "dataRegistrado" TEXT NOT NULL,
    "diaId" INTEGER NOT NULL,
    "proposta" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "funcionarios" TEXT NOT NULL,
    "propColor" TEXT NOT NULL,
    "type" INTEGER NOT NULL
);
INSERT INTO "new_eventos" ("dataEvento", "dataRegistrado", "desc", "diaId", "funcionarios", "id", "propColor", "proposta", "responsavel", "titulo", "veiculo") SELECT "dataEvento", "dataRegistrado", "desc", "diaId", "funcionarios", "id", "propColor", "proposta", "responsavel", "titulo", "veiculo" FROM "eventos";
DROP TABLE "eventos";
ALTER TABLE "new_eventos" RENAME TO "eventos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
