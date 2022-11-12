import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "sqlite3";
import { databaseEventInterface } from "./data";

const db = new Database('db.sqlite');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    //TODO: return errors
    //TODO: EVENTS table should have a eventNumber column, to its identification within a day

    if (req.method != 'POST') {
        return res.status(422).json({ message: 'POST only allowed method.'})
    }
    
    if (!req.body) {
        return res.status(422).json({ message: 'Body is empty.'})
    }

    let body : databaseEventInterface = JSON.parse(req.body)
    let validatedParameters = await validateReq(body, ['veiculo', 'responsavel', 'dataEvento', 'dataRegistrado', 'titulo'])

    if (validatedParameters.result == false) {
        return res.status(422).json({message: `Missing or wrong ${validatedParameters.missingParameter} parameters.`})
    }

    
    let dayId = await validateDay(body)
    let responseStatus = await writeEvent(body, dayId)
    

    return res.status(responseStatus).json('Event registered')
}

async function validateDay(body : databaseEventInterface) {
    
    return new Promise<number>((resolve, reject) => {
        db.exec(`INSERT OR IGNORE INTO dias(dia) VALUES ('${body.dataEvento}')`)

        db.get(`SELECT id FROM dias WHERE dia = '${body.dataEvento}'`, (err, row) => {
            if (err) {
                reject(err)
            }
            
            resolve(row.id)
        })
    })
    
}

async function writeEvent(body : databaseEventInterface, diaId : number) {

    return new Promise<number>((resolve, reject) => {
        db.exec(`INSERT INTO 
        eventos(desc, veiculo, responsavel, dataEvento, dataRegistrado, diaId) 
        VALUES ('${body.desc}', '${body.veiculo}', '${body.responsavel}', '${body.dataEvento}', '${body.dataRegistrado}', '${diaId}')`,
        (err) => {
            if (err) {
                console.error(err)
                reject(422);
            }
            resolve(200);
        }
        )
       
        
    })

}

async function validateReq(body : databaseEventInterface, neededProperties: string[]) {
    return new Promise<{result: boolean, missingParameter?: string}>((resolve, reject) => {

        let isMissingParameters = false;
        let missingParameters : string[] = [];
        let i = 1
        for (let item of neededProperties) {

            if (!(body.hasOwnProperty(item))) {
                isMissingParameters = true;
                missingParameters = [...missingParameters, `${item}`]
            }

            i++
            if (i == neededProperties.length) {
                if (isMissingParameters) {
                    resolve({result: false, missingParameter: `[${missingParameters}]`})
                }
                resolve({result: true})
            }
        }
    })


}