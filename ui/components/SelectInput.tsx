'use client'

import style from './selectinput.module.scss'
import React, { useState } from "react"


export default function SelectInput(props : { insertedValues: string[], setInsertedValues: any}) {

    let insertedValues = props.insertedValues
    let setInsertedValues = props.setInsertedValues

    return (
        <div className={style.input} >
            {insertedValues.map((item) => {
                return <InsertedInput insertedValues={insertedValues} setInsertedValues={setInsertedValues} text={item}/>
            })}
            <span className={style.span} contentEditable placeholder='Oi' onKeyDown={(e) => {insertValue(e)}}></span>
        </div>
    )


    async function insertValue(e :  React.KeyboardEvent<HTMLSpanElement>) {

        let innerText = e.currentTarget.innerText
        let el = e.currentTarget

        if (e.key === 'Enter') {
            let validation = await validateValues(innerText)
            e.preventDefault()

            if (validation) {
                setInsertedValues(
                    [...insertedValues, innerText]
                )
                el.innerText = ''
            }
            el.innerText = ''
        }

        validateSize(innerText)

        async function validateValues(val: string) {

            if (insertedValues.length > 14) {
                return false
            }

            let i = 0;
            while (i < insertedValues.length) {

                if (e.currentTarget.innerText.toLowerCase() === insertedValues[i].toLowerCase()) {
                    return false
                }
                i++
                
            }

            return true
            
        }

        function validateSize(val:string) {
            if (el.innerText.length > 22 && e.key !== 'Backspace') {
                e.preventDefault()
            }
        }
    }
}

export function InsertedInput(props: {text:string, insertedValues: string[], setInsertedValues: React.Dispatch<React.SetStateAction<string[]>>}) {

    return <div className={style.insertedInput}>
        {props.text}
        <button onClick={(e) => {
            destroyItem(e, props.text)
        }}>
            X
        </button>
    </div>


    async function destroyItem(e: React.MouseEvent<HTMLButtonElement>, string: string) {
        e.preventDefault()
        return props.setInsertedValues(props.insertedValues.filter((item) => {
            return item.toLowerCase() != string.toLowerCase()
        }))
    }
}