import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";
import fs from 'fs'

const db = new Database('db.sqlite');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let body : {table : string} = JSON.parse(req.body)
    

    if (!body.table) {
        res.status(405).send({ message: 'Missing "table" property in request body.' })
    }

    res.status(200).json(await readDB(body.table))
}



async function initiateDB() {

    db.exec(fs.readFileSync('./sql/initiate.sql').toString());
  
}
  
async function readDB(table: string) {

    return new Promise<any>((resolve, reject) => {
        db.all(`SELECT * FROM ${table}`, (err, res) => {

            if (err) {
            reject(err.message)
            }
    
            resolve(res)
        })  
    })

}

export interface databaseEventInterface {
    id: number,
    desc: string,
    veiculo: string,
    responsavel: string,
    data: string,
    dataRegistrado: string,
    titulo: string
}