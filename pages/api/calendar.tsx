import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";


const db = new Database('db.sqlite');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let db = await readDatabase()
    let sortedDb = await sortDays(db)
    return res.status(200).json(sortedDb)

}

  
async function readDatabase() {

    return new Promise<any>((resolve, reject) => {
        db.all(`SELECT eventos.id, eventos.titulo, eventos.desc, eventos.veiculo, eventos.responsavel, eventos.dataEvento, eventos.diaOrdem, dias.dia
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
        return 'no'
    }

    return new Promise<calendarInterface>((resolve, reject) => {
        let days: calendarInterface = [
            {
                dia: array[0].dataEvento,
                eventos: []
            }
        ]
    
        let i = 1
        for (let event of array) {
            let j = 1
            for (let day of days) {
                if (event.dataEvento == day.dia) {
                    day.eventos? day.eventos = [...day.eventos, event] : day.eventos = [event]

                    if (i == array.length) {
                        resolve(days)
                    }
    
                    j++
                    break;
                }
    
                if (j == days.length) {
                    days = [...days, {
                        dia: event.dataEvento,
                        eventos: [event]
                    }]
                }
    
                if (i == array.length && j == days.length) {
                    resolve(days)
                }
                j++
            }
            i ++
        } 
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
    dataRegistrado: string,
    titulo: string,
    diaId?: number,
    diaOrdem?: number,
    funcionarios?: string[]
}