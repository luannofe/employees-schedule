import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";


const db = new Database('db.sqlite');

const sqlInitiate = `CREATE TABLE IF NOT EXISTS funcionarios (
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

CREATE TABLE IF NOT EXISTS dias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia VARCHAR(200) NOT NULL UNIQUE

);

CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    desc VARCHAR(200) NOT NULL,
    veiculo VARCHAR(200) NOT NULL,
    responsavel VARCHAR(200) NOT NULL,
    dataEvento VARCHAR(200) NOT NULL,
    dataRegistrado VARCHAR(200) NOT NULL,
    diaId INTEGER NOT NULL,
    diaOrdem INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    funcionarios TEXT,
    FOREIGN KEY (diaId)
        REFERENCES dias (id)

);


INSERT OR REPLACE INTO funcionarios VALUES
    (1, 'Pedro'),
    (2, 'Joao');


INSERT OR REPLACE INTO responsaveis VALUES
    (1, 'Ricardo');

INSERT OR REPLACE INTO carros VALUES
    (1, 'FIAT UNO');`

db.exec(sqlInitiate)

export default async function calendarHandler() {

    let db = await readDatabase()
    let sortedDb = await sortDays(db)
    return sortedDb

}

  
async function readDatabase() {

    return new Promise<any>((resolve, reject) => {
        db.all(`SELECT eventos.id, eventos.titulo, eventos.desc, eventos.veiculo, eventos.responsavel, eventos.dataEvento, eventos.diaOrdem, eventos.funcionarios, dias.dia
        FROM eventos INNER JOIN dias ON eventos.diaId = dias.id`, (err, res) => {

            if (err) {
            reject(err.message)
            }
            resolve(res)
        })  
    })

}

async function sortDays(array: databaseEventInterface[]) {

    if (array.length <= 0) {
        return []
    }

    return new Promise<calendarInterface>((resolve, reject) => {

        let days: calendarInterface = [
        ]

        let i = 0;
        while (i < array.length) {
            let inserted = false
            let j = 0;
            while (j < days.length) {
                if (array[i].dataEvento == days[j].dia ) {
                     days[j].eventos = [...days[j].eventos!, array[i]]
                     inserted = true
                }
                j++
            }  

            if (!inserted) {
                days = [...days, {dia: array[i].dataEvento, eventos: [array[i]]}]
            }
            i++
        }  

       resolve(days)
            
    })

        
        
}






export type calendarInterface = Array<{
    dia: string,
    eventos?: databaseEventInterface[]
}>


export interface databaseEventInterface {
    id?: number,
    desc?: string,
    veiculo: string,
    responsavel: string,
    dataEvento: string,
    dataRegistrado?: string,
    titulo: string,
    diaId?: number,
    diaOrdem?: number,
    funcionarios?: string[]
}
