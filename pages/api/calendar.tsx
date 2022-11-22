import {PrismaClient} from '@prisma/client'
import type {eventos} from '@prisma/client'




export const prisma = new PrismaClient()

export default async function calendarHandler() {

    //TODO: CHANGE THIS FUNCTION TO API CALL, TO FORCE DB RE-READ

    let db = await readDatabase()
    console.log('PURE DATABASE')
    console.log(db)
    let sortedDb = await sortDays(db)
    console.log('SORTED DATABASE')
    console.log(sortedDb)
    return sortedDb

}

  
async function readDatabase() {
 
    return await prisma.eventos.findMany()
}

async function sortDays(array: eventos[]) {

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

        return resolve(days)
            
    })

        
        
}



export type calendarInterface = {
    dia: string,
    eventos?: eventos[]
}[]


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
