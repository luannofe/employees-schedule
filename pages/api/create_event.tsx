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

    const validatedParameters = await validateReq(body, ['veiculo', 'responsavel', 'dataEvento', 'titulo'])
    
    if (validatedParameters.result == false) {
        return res.status(422).json({message: `Missing or wrong ${validatedParameters.missingParameter} parameters.`})
    }

    
    let eventDate = processedDate(new Date(body.dataEvento + ' 00:00:00'))
    let dayData = await validateDay(eventDate)

    let writeResult = await writeEvent(body, dayData!)
    

    return res.status(writeResult.status).json(writeResult.message)
}

async function validateDay(eventDate : string) {

    await prisma.dias.upsert({
        where: {dia: eventDate},
        update: {dia: eventDate},
        create: {dia: eventDate}
    })

    console.log(`VALIDATING DATE ${eventDate}`)

    return await prisma.dias.findUnique({
        where: {dia: eventDate},
        select: {dia: true, id: true}
    })

    
}

async function writeEvent(body : eventos, dayData: {id: number, dia: string}) {

    let count = await prisma.eventos.count({
        where: {diaId: dayData.id}
    })

    let insert;

    

    let propColor =  body.propColor ||= '#BFD7D9'
    
    if (!body.id) {
        insert = await prisma.eventos.create({
            data: {
                ...body,
                diaOrdem: count + 1,
                funcionarios: String(body.funcionarios),
                dataRegistrado: processedDate(new Date()),
                diaId: dayData.id,
                dataEvento: dayData.dia,
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
                dataEvento: dayData.dia
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
        message: {
            registeredEvent: insert
        }
    }

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

export function processedDate(date: Date) {
    return date.toString().slice(0,15)
}

