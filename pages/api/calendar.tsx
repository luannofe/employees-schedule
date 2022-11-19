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
    console.log('SORTANDO DIAS')

    if (array.length <= 0) {
        return 'no'
    }

    return new Promise<calendarInterface>((resolve, reject) => {

        let days: calendarInterface = [
        ]

        let i = 0;
        while (i < array.length) {
            console.log(`Event for day ${array[i].dataEvento}, searching matchs...`)
            let inserted = false
            let j = 0;
            while (j < days.length) {
                console.log(`Tried matching witch ${days[j].dia}`)
                if (array[i].dataEvento == days[j].dia ) {
                     days[j].eventos = [...days[j].eventos!, array[i]]
                     inserted = true
                     console.log(`matched.`)
                     console.log(days)
                }
                j++
            }  

            if (!inserted) {
                console.log(`not matched`)
                days = [...days, {dia: array[i].dataEvento, eventos: [array[i]]}]
                console.log(days)
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