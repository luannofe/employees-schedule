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

    const result = await deleteEvent(body.id)
    
    return res.status(result.status).json(result.message)


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
                status: 422,
                message: `No event for id ${id}`
            }
        }

        return {
            status: 200,
            message: {
                dataEvento: deletedEvent.dataEvento,
                id: deletedEvent.id
            }
        }
    }

}