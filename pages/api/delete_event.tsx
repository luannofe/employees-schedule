import { NextApiRequest, NextApiResponse } from "next";
import { validateReq } from "./create_event";
import { prisma } from "./calendar";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method != 'POST') {
        return res.status(422).json({ message: 'POST only allowed method.'})
    }

    if (Object.keys(req.body).length == 0) {
        return res.status(422).json({ message: 'Body is empty.'})
    }

    let body = JSON.parse(req.body)
    console.log('RECEIVED BODY:')
    console.log(body)

    if ((await validateReq(body, ['id'])).result == false) {
        return res.status(422).json({message: `Missing or wrong id parameters.`})
    }

    await updateDiaOrdem(body.id)

    const result = await deleteEvent(body.id)
    
    return res.status(result.status).json({message: result.message})


    async function deleteEvent(id : number) {
        
        const deletedEvent = await prisma.eventos.delete({
            where: {
                id: id
            },
            select: {
                titulo: true,
                dataEvento: true,
                id: true
            }
        })

        if (!deletedEvent.id) {
            return {
                status: 200,
                message: `No event for id ${id}`
            }
        }

        return {
            status: 200,
            message: `Deleted event from ${deletedEvent.dataEvento}, title: ${deletedEvent.titulo} and id ${deletedEvent.id}`
        }
    }

    async function updateDiaOrdem(id : number) {

        console.log(`ID RECEIVED TO UPDATE: ${id}`)

        let eventDate = await prisma.eventos.findFirst({
            where: {
                id: id
            },
            select: {
                dataEvento: true
            }
        })

        await prisma.eventos.updateMany({
            where: {
                dataEvento: eventDate?.dataEvento,
            },
            data: {
                diaOrdem: {
                    decrement: 1
                } 
            }
        })

        return await prisma.eventos.updateMany({
            where: {
                diaOrdem: 0
            },
            data: {
                diaOrdem: 1
            }
        })


    }
}