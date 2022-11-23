import {PrismaClient} from '@prisma/client'
import type {eventos} from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

dayjs().format



export const prisma = new PrismaClient()
console.log('1')

export default async function calendarHandler(req: NextApiRequest, res: NextApiResponse) {


    //TODO: days span selectable by user 


    let db = await readDatabase()
    console.log('PURE DATABASE')

    let sortedDb = await sortDays(db)
    console.log('SORTED DATABASE')

    let populatedCalendar = await populateMonthsArray(sortedDb)
    console.log('POPULATED DATABASE')

    return res.status(200).send(populatedCalendar) 

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

async function mountMonthsPeriod(initialDate: Date, span: number) {

    let date = new Date(dayjs().set('day', 0).set('day', -7).toString())

    let dates = []
  

    let i = 0
    
    while (i < span) {

      dates.push(date.toDateString())
      date.setDate(date.getDate() + 1)
      i++

    }
    console.log('ended loop')
  
    return dates as string[]


}

async function populateMonthsArray(eventsArray : calendarInterface) {

    let unpopulatedMonthsArray = await mountMonthsPeriod(new Date(), 84)

  
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
    funcionarios?: string[]
}
