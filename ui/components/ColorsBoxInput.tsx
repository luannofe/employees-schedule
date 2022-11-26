'use client'
import { useContext } from 'react'
import { frameContext } from '../Frame'
import style from './colorsboxinput.module.scss'

export default function ColorsBoxInput() {

    const colors = ['#BFD7D9', '#d9bfbf', '#d7bfd9', '#c2d9bf', '#d9bfd3', '#bfc0d9', '#d8d9bf']
    const propColor = useContext(frameContext)?.formContext

    

    return (
        <div className ={ style.container}>
            {colors.map((color) => {
                return <div className={style.colorBox} style={{
                    backgroundColor: color, 
                    transform: propColor?.formInputs.propColor == color? 'scale(1.8)' : 'scale(1)'
                }} 
                onClick={()=>{clickHandler(color)}}>

                </div>
            })}
        </div>
    )

    function clickHandler(color : string) {
        propColor?.insertFormInputs((previousValues) => {
            return {
                ...previousValues,
                propColor: color
            }
        })
    }
}