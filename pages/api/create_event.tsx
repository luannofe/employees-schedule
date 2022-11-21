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
        db.exec(`INSERT OR IGNORE INTO dias(dia) VALUES ('${new Date(body.dataEvento).toDateString()}')`)

        db.get(`SELECT id FROM dias WHERE dia = '${new Date(body.dataEvento).toDateString()}'`, (err, row) => {
            if (err) {
                return reject(err)
            }
            
            db.get(`SELECT COUNT(*) as 'eventCount' FROM eventos WHERE diaId = ${row.id}`, (err, count) => {
                if (err) {
                    return reject(err)
                }

                return resolve({id: row.id, eventCount: count.eventCount + 1})
            })
        })
    })
    
}

async function writeEvent(body : databaseEventInterface, diaId : number, diaOrdem: number) {

    let processedDate = new Date(body.dataEvento + ' 00:00:00').toDateString() 




    return new Promise<number>(async (resolve, reject) => {

        let id = await validateId(body)

        if (!id) {
            db.exec(`INSERT INTO 
            eventos(titulo, desc, veiculo, responsavel, dataEvento, dataRegistrado, diaId, diaOrdem, funcionarios) 
            VALUES ('${body.titulo}', '${body.desc}', '${body.veiculo}', '${body.responsavel}', '${processedDate}', '${new Date().toDateString()}', '${diaId}', '${diaOrdem}', '${body.funcionarios}')`,
            (err) => {
                if (err) {
                    return reject(422);
                }
                console.log('REGISTERED')
                return resolve(200);
            }
            )     
        } else {

            db.exec(`UPDATE eventos
            SET titulo = '${body.titulo}', desc = '${body.desc}', veiculo = '${body.veiculo}', responsavel = '${body.responsavel}', dataEvento = '${processedDate}', dataRegistrado = '${new Date().toDateString()}', 
            diaId = '${diaId}', diaOrdem = '${diaOrdem - 1}', funcionarios = '${body.funcionarios}' 
            WHERE id = ${body.id}`,
            (err) => {
                if (err) {
                    console.error(err)
                    return reject(422);
                }
                console.log('UPDATED')
                return resolve(200);
            }
            )

       
    }
    })

}

export async function validateReq(body : databaseEventInterface, neededProperties: string[]) {

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

async function validateId(body: databaseEventInterface) {

    
    return new Promise<boolean >((resolve, reject) => {

        if (!body.id) {
            console.log(`body id ${body.id} doesnt exists, returning false`)
           return resolve(false)
        } 

        db.get(`SELECT id FROM eventos WHERE eventos.id = ${body.id}`, (err, row) => {

            if (err) {
                console.log('ERRO AQUI')
                return reject(err)
            }
            return resolve(true)
        })
        
    })
}