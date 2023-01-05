import styles from './specialeventbuttons.module.scss'
import React, { SetStateAction, useContext } from 'react'
import { frameContext } from '../Frame'

export default function SpecialEventButtons(
    props: {
        eventTypeState: {
            set:  React.Dispatch<SetStateAction<number>>,
            state: number
        }
    }
) {

    const {eventTypeState} = props
    const formContext = useContext(frameContext)?.formContext
    const choosenView = useContext(frameContext)?.choosenViewContext.state

    return <div className={styles.container}>

        <button className={styles.specialButton} type={'button'} style={{
            backgroundColor: eventTypeState.state == 0? 'white' : 'rgb(182, 182, 182)',
            outline: eventTypeState.state == 0? 'solid 2px rgb(182, 182, 182)' : '2px solid rgb(228, 228, 228)'
        }}
            onClick={(e)=>{handleClick(e,0)}}
        >PADRÃO</button>

        <button className={styles.specialButton} type={'button'} style={{
            backgroundColor: eventTypeState.state == 1? 'white' : 'rgb(182, 182, 182)',
            outline: eventTypeState.state == 1? 'solid 2px rgb(182, 182, 182)' : '2px solid rgb(228, 228, 228)'
        }}
            onClick={(e)=>{handleClick(e,1)}}
        >FERIADO</button>

        <button className={styles.specialButton} type={'button'} style={{
            backgroundColor: eventTypeState.state == 2? 'white' : 'rgb(182, 182, 182)',
            outline: eventTypeState.state == 2? 'solid 2px rgb(182, 182, 182)' : '2px solid rgb(228, 228, 228)',
            color: 'rgb(140, 0, 0)'
        }}
            onClick={(e)=>{handleClick(e,2)}}
        >AFAST. MÉDICO</button>
    </div>


    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, typeNumber: number) {


        if (choosenView == 'EditEvent') {
            return
        }

  

        const typeValues = [
            {
                proposta: '',
                type: typeNumber
            },
            {
                proposta: 'FERIADO',
                type: typeNumber
            },
            {
                proposta: 'ATESTADO',
                type: typeNumber
            }
        ]

        const clearedFormData = getClearedFormData()

        eventTypeState.set(typeNumber)


        formContext?.insertFormInputs( prev => {
            return {

                ...clearedFormData,
                titulo: prev.titulo,
                funcionarios: typeNumber == 1? [] : prev.funcionarios,
                dataEvento: prev.dataEvento,
                ...typeValues[typeNumber]

            }
        })


 
    }


    function getClearedFormData() {
        return {
            titulo: '',
            dataEvento: '',
            veiculo: [],
            responsavel: '',
            desc: '',
            funcionarios: [],
            propColor: '#BFD7D9',
            proposta: '',
            thisRef: React.createRef<HTMLDivElement>()
        }
    }
}