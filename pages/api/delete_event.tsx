import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";
import { validateReq } from "./create_event";

const db = new Database('db.sqlite');

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
    return res.status(await deleteEvent(body.id)).json({message: 'Successfully deleted.'})


    async function deleteEvent(id : number) {
        
        return new Promise<number>((resolve, reject) => {
            db.exec(`DELETE FROM eventos WHERE id = ${id}`, async (err) => {
                if (err) {
                    console.log(err)
                    resolve(422)
                }
                
                    resolve(200)


            })       
        })


    }

    async function updateDiaOrdem(id : number) {

        console.log(`ID RECEIVED TO UPDATE: ${id}`)

        return new Promise<boolean>((resolve, reject) => {

            db.get(`SELECT diaId FROM eventos WHERE id = ${id} LIMIT 1`, (err, row) => {
                if (err) {
                    console.log(`ERROR at selecting id`)
                    console.log(err)
                    resolve(false)
                }
                console.log('ID SELECTED')
                console.log(row)

                db.exec(`
                UPDATE eventos 
                SET diaOrdem = 
                CASE WHEN diaOrdem > 1 
                THEN diaOrdem - 1 
                ELSE diaOrdem END
                WHERE diaId = ${row.diaId}`, (err) => {

                    if (err) {
                        console.log(`ERROR at updating diaOrdem with id ${row.diaId}`)
                        console.log(err)
                        resolve(false)
                    }

                    resolve(true)
                })
            })
            
        })


    }
}