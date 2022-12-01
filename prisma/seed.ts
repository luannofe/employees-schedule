
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    const carros = ['KDS-1234', 'AWS-5445', 'WBF-7777', 'OOO-8888']
    const funcionarios = ['Pedro Martins', 'Ricardo Silva', 'Evandro Marques', 'Julio Santos', 'Hygor Pereira', 'Reginaldo Rossi', 'Mylon Fernando']
    const responsaveis = ['Luigi Bueno', 'Dionatan Machado', 'Luis Alexandria']

    carros.map( async (item) => {
        return await prisma.carros.create({data: {nome: item}})
    })

    funcionarios.map( async (item) => {
        return await prisma.funcionarios.create({data: {nome: item}})
    })

    responsaveis.map( async (item) => {
        return await prisma.responsaveis.create({data: {nome: item}})
    })

    console.log('SEEDED.')
    console.log(carros)
    console.log(funcionarios)
    console.log(responsaveis)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })