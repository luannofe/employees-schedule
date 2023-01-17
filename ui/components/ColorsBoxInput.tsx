'use client'
import { SetStateAction, useContext } from 'react'
import { frameContext } from '../Frame'
import style from './colorsboxinput.module.scss'
import { getClearedFormData } from './SpecialEventButtons'

export default function ColorsBoxInput(
    props: {
        eventTypeState: {
            set:  React.Dispatch<SetStateAction<number>>,
            state: number
        }
    }
) {

    const colors = ['#BFD7D9', '#d9bfbf', '#d7bfd9', '#c2d9bf', '#d9bfd3', '#bfc0d9', '#d8d9bf', '#d9cebf']
    const formContext = useContext(frameContext)?.formContext
    const choosenView = useContext(frameContext)?.choosenViewContext.state

    

    return (
        <div className ={ style.container}>
            {colors.map((color) => {
                return <div className={style.colorBox} style={{
                    backgroundColor: color, 
                    transform: formContext?.formInputs.propColor == color? 'scale(1.8)' : 'scale(1)'
                }} 
                onClick={()=>{clickHandler(color)}}>

                </div>
            })}
        </div>
    )

    function clickHandler(color : string) {

        if (props.eventTypeState.state != 0) {
            setType()
        }


        formContext?.insertFormInputs((previousValues) => {
            return {
                ...previousValues,
                propColor: color,
                type: 0
            }
        })
    }

    function setType() {

        if (choosenView == 'EditEvent') {
            return
        }



        const clearedFormData = getClearedFormData()

        props.eventTypeState.set(0)


        formContext?.insertFormInputs( prev => {
            return {

                ...clearedFormData,
                titulo: prev.titulo,
                funcionarios: prev.funcionarios,
                dataEvento: prev.dataEvento,
                proposta: '',
                type: 0


            }
        })
 
    }
    
}