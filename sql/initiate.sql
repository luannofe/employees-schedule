CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS carros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS responsaveis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    desc VARCHAR(200) NOT NULL,
    veiculo VARCHAR(200) NOT NULL,
    responsavel VARCHAR(200) NOT NULL,
    data VARCHAR(200) NOT NULL,
    dataRegistrado VARCHAR(200) NOT NULL
);

INSERT OR REPLACE INTO funcionarios VALUES
    (1, 'Pedro'),
    (2, 'Joao');


INSERT OR REPLACE INTO responsaveis VALUES
    (1, 'Ricardo');

INSERT OR REPLACE INTO carros VALUES
    (1, 'FIAT UNO');



