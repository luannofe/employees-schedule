import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./calendar";
import type { eventos }  from '@prisma/client'






export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method != 'POST') {
        return res.status(422).json({ message: 'POST only allowed method.'})
    }

    if (Object.keys(req.body).length == 0) {
        return res.status(422).json({ message: 'Body is empty.'})
    }

    const body = JSON.parse(req.body) 
    console.log('BODY IS')
    console.log(body)

    const validatedParameters = await validateReq(body, ['veiculo', 'responsavel', 'dataEvento', 'titulo', 'proposta'])
    
    if (validatedParameters.result == false) {
        return res.status(422).json({message: `Missing or wrong ${validatedParameters.missingParameter} parameters.`})
    }

    
    let eventDates = processedDate(body.dataEvento)
    console.log(`processed dates to ${eventDates}`)
    
    let daysData = await validateDates(eventDates)

    let writeResponse = await writeCaller(daysData, body)

    return res.status(writeResponse.status).send({message: writeResponse.message, writedEvents: writeResponse.writedEvents})

}

async function validateDates(eventDates : string[]) {

    let i = 0;
    let dateArr = []

    console.log(`PARSING DATES ${eventDates}`)

    while (i < eventDates.length) {
        await prisma.dias.upsert({
            where: {dia: eventDates[i]},
            update: {dia: eventDates[i]},
            create: {dia: eventDates[i]}
        })

        dateArr.push (await prisma.dias.findUnique({
            where: {dia: eventDates[i]},
            select: {dia: true, id: true}
        }))

        i++
    }

    console.log(`ENDED PARSING DATES TO ${dateArr}`)
    return  dateArr as {id: number, dia: string}[]

    
}

async function writeEvent(body : eventos, eventDates: {id: number, dia: string}) {

    let insert;
    let propColor =  body.propColor ||= '#BFD7D9'
    
    if (!body.id) {
        insert = await prisma.eventos.create({
            data: {
                ...body,
                funcionarios: String(body.funcionarios),
                dataRegistrado: new Date().toString().slice(0,15),
                diaId: eventDates.id,
                dataEvento: eventDates.dia,
                propColor: String(propColor)
            }
        })
    } else {
        insert = await prisma.eventos.update({
            where: {
                id: body.id
            },
            data: {
                ...body,
                funcionarios: String(body.funcionarios),
                dataEvento: eventDates.dia
            }
        })
    }

    if (typeof insert !== 'object') {
        return {
            status: 422,
            message: 'There was an error while creating event.'
        }
    }

    return {
        status: 200,
        message: 'Created event successfully.',
        registeredEvent: insert
    }

}

async function writeCaller(daysData: {id: number, dia: string}[], body: eventos) {

    let writeResults : apiCreateEventResponse = {
        message : 'There was a problem while creating all sent events. If the problem persists, please contact your support.',
        status: 422,
        writedEvents: []
    }

    let okCount = 0;
    let i = 0;
    while (i < daysData.length) {

        let thisWriteResult = await writeEvent(body, daysData[i])

        if (thisWriteResult.status == 200){
            okCount++
            writeResults.writedEvents.push(thisWriteResult)
        } else {
            writeResults.writedEvents.push(thisWriteResult)
        }
        i ++
    }

    if (!okCount) {
        return writeResults
    }

    writeResults.status = 200

    if (okCount != daysData.length) {

        writeResults = {
            ...writeResults,
            message: 'Events partially created.',
        }

        return writeResults
    }

    writeResults = {
        ...writeResults,
        message: 'All events created.'
    }

    return writeResults

}

export async function validateReq(body : eventos, neededProperties: string[]) {

    return new Promise<{result: boolean, missingParameter?: string}>(async (resolve, reject) => {

        let isMissingParameters = false;
        let missingParameters : string[] = [];
        let i = 1
        for (let item of neededProperties) {

            if (!(body.hasOwnProperty(item))) {
                isMissingParameters = true;
                missingParameters = [...missingParameters, `${item}`]
            }

            if (i == neededProperties.length) {
                if (isMissingParameters) {
                    return resolve({result: false, missingParameter: `[${missingParameters}]`})
                }
                return resolve({result: true})
            }
            i++
        }
    })


}

export function processedDate(dates: string[]) {
    console.log(`'Received ${dates}'`)
    return dates.map( (stringDate) => new Date(stringDate + ' 00:00:00').toString().slice(0,15) )
   
}








export interface apiCreateEventResponse {

    status: number,
    message : String | {},
    writedEvents: {
        status: number,
        message: string,
        registeredEvent?: eventos
    }[]
}

