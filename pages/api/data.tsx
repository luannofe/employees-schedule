import { prisma } from "./calendar";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) { 

    if (req.method == 'GET') {
        return res.status(200).send(await readDatabase())

    }

    if (req.method != 'POST') {
        return res.status(422).send(`${req.method} not allowed.`)
    }

}


  
async function readDatabase() {

    const funcionarios = await prisma.funcionarios.findMany()
    const carros = await prisma.carros.findMany()
    const responsaveis = await prisma.responsaveis.findMany()

    return {
        carros,
        funcionarios,
        responsaveis
    }
    
}

export interface apiDataResponse {
    
    carros: {
        id: number,
        nome: string
    }[],

    funcionarios: {
        id: number,
        nome: string
    }[],

    responsaveis: {
        id: number,
        nome: string
    }[]
}