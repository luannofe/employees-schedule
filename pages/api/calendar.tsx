import {PrismaClient} from '@prisma/client'
import type {eventos} from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'




export const prisma = new PrismaClient()
console.log('1')

export default async function calendarHandler(req: NextApiRequest, res: NextApiResponse) {

    //TODO: CHANGE THIS FUNCTION TO API CALL, TO FORCE DB RE-READ


    let db = await readDatabase()
    console.log('PURE DATABASE')
    console.log(db)

    let sortedDb = await sortDays(db)
    console.log('SORTED DATABASE')
    console.log(sortedDb)

    let populatedCalendar = await populateMonthsArray(sortedDb)
    console.log('POPULATED DATABASE')
    console.log(populatedCalendar)

    return res.status(200).send(populatedCalendar) 

}

  
async function readDatabase() {
    console.log('2')
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

async function mountMonthsPeriod(initialDate: Date, span: number) {

    let date = new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    )
    let dates = []
  
    let MonthsAhead = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + span,
      new Date().getDate()
    );
  
  
    while (date.getMonth() != MonthsAhead.getMonth()) {
      dates.push(date.toDateString())
      date.setDate(date.getDate() + 1)
    }
  
    return dates as string[]
}

async function populateMonthsArray(eventsArray : calendarInterface) {

    let unpopulatedMonthsArray = await mountMonthsPeriod(new Date(), 1)

  
    // console.log(eventsArray)
    // console.log(unpopulatedMonthsArray)
  
  
  
    return unpopulatedMonthsArray.map((item, i, arr) => {
  
      let j = 0
      while (j < eventsArray.length) {
        
        if (eventsArray[j].dia == item) {
          return eventsArray[j]
        }
        j++
      }
      return { dia: item }
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
    funcionarios?: string
}
