import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";
import { databaseEventInterface } from "./calendar";

const db = new Database('db.sqlite');





export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method != 'POST') {
        return res.status(422).json({ message: 'POST only allowed method.'})
    }

    if (Object.keys(req.body).length == 0) {
        return res.status(422).json({ message: 'Body is empty.'})
    }

    let body = JSON.parse(req.body) 
    console.log(body)

    let validatedParameters = await validateReq(body, ['veiculo', 'responsavel', 'dataEvento', 'titulo'])
    
    if (validatedParameters.result == false) {
        return res.status(422).json({message: `Missing or wrong ${validatedParameters.missingParameter} parameters.`})
    }

    
    let dayData = await validateDay(body)
    let responseStatus = await writeEvent(body, dayData.id, dayData.eventCount)
    

    return res.status(responseStatus).json('Event registered')
}

async function validateDay(body : databaseEventInterface) {
    
    return new Promise<{id: number, eventCount: number}>((resolve, reject) => {
        db.exec(`INSERT OR IGNORE INTO dias(dia) VALUES ('${body.dataEvento}')`)

        db.get(`SELECT id FROM dias WHERE dia = '${body.dataEvento}'`, (err, row) => {
            if (err) {
                reject(err)
            }
            
            db.get(`SELECT COUNT(*) as 'eventCount' FROM eventos WHERE diaId = ${row.id}`, (err, count) => {
                if (err) {
                    reject(err)
                }

                resolve({id: row.id, eventCount: count.eventCount + 1})
            })
        })
    })
    
}

async function writeEvent(body : databaseEventInterface, diaId : number, diaOrdem: number) {

    let processedDate = body.dataEvento

    return new Promise<number>((resolve, reject) => {


        db.exec(`INSERT INTO 
        eventos(titulo, desc, veiculo, responsavel, dataEvento, dataRegistrado, diaId, diaOrdem, funcionarios) 
        VALUES ('${body.titulo}', '${body.desc}', '${body.veiculo}', '${body.responsavel}', '${processedDate}', '${new Date().toDateString()}', '${diaId}', '${diaOrdem}', '${body.funcionarios}')`,
        (err) => {
            if (err) {
                console.error(err)
                reject(422);
            }
            console.log('REGISTERED')
            console.log(body)
            resolve(200);
        }
        )
       
        
    })

}

async function validateReq(body : databaseEventInterface, neededProperties: string[]) {

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
                    resolve({result: false, missingParameter: `[${missingParameters}]`})
                }
                resolve({result: true})
            }
            i++
        }
    })


}

async function processDate(date: string) {
    if (!date) {
        return ''
    }

    let strArr = date.split('/')
    let processedDate = new Date(`${strArr[1]}/${strArr[0]}/${strArr[2]}`).toDateString()
    return `${processedDate}`
}