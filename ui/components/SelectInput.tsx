'use client'

import style from './selectinput.module.scss'
import React, { useContext, useEffect, useState } from "react"
import { frameContext, frontEndCalendarEventos } from '../Frame'
import Select, { CSSObjectWithLabel, SelectInstance } from 'react-select'
import { transform } from 'typescript'

//a função checkifrepeated pega direto da FormInputs, portanto, ao carregar, ele n recebe nada. Tenho que fazer com que, ao abrir, 
//ja mande para FormInputs o que esse input receber, ou fazer com q ele leia algo alem da forminputs
// ao editar um evento tb tem um limite sendo aplicado atoa, resolver isso antes

type repeatedInfo = {
    day: string,
    repeated: string[]
}[]

export default function SelectInput(props: {
    propertyName: 'funcionarios' | 'veiculo',
    propertyOptions: { id: number, nome: string }[],
    placeholder: string,
    inputLimit: number,
    defaultValue: string[],
    defaultRepeatedInfo?: repeatedInfo
}) {

    
    const { propertyName, propertyOptions, inputLimit, defaultValue, defaultRepeatedInfo } = props

    const [repeatedInfo, setRepeatedInfo] = useState<repeatedInfo>(defaultRepeatedInfo || [])

    const [isHovering, setHovering] = useState(false)


    let defaultVal = defaultValue.map((item) => { return { value: item, label: item } })

    const selectOptions = propertyOptions.map((item) => { return { value: item.nome, label: item.nome } })

    const FormContext = useContext(frameContext)?.formContext
    const eventosContext = useContext(frameContext)?.eventsContext


    useEffect(() => {
        console.log('ran')
        checkIfRepeated()
    }, [])


    useEffect(() => {

        checkIfRepeated()

        return () => {
            setRepeatedInfo([])
        }

    }, [FormContext?.formInputs[propertyName], FormContext?.formInputs.dataEvento])

    useEffect(() => {

        const thisSelect = document.getElementById(`react-select-${propertyName}`)

        if (repeatedInfo.length > 0) {
            if (thisSelect) {
                thisSelect.addEventListener('mouseenter', handleHoverIn)
                thisSelect.addEventListener('mouseleave', handleHoverOut)
            }
        }

        return () => {
            thisSelect?.removeEventListener('mouseenter', handleHoverIn)
            thisSelect?.removeEventListener('mouseleave', handleHoverOut)
        }

    }, [repeatedInfo])

    return <><Select


        id={`react-select-${propertyName}`}


        closeMenuOnSelect={propertyName == 'funcionarios' ? false : true}

        options={selectOptions}

        isClearable={true}

        isOptionDisabled={() => checkLimit()}

        isMulti

        defaultValue={defaultVal}

        noOptionsMessage={({ inputValue }) => !inputValue ? "Sem opções." : `Não foi encontrado nenhum ${propertyName}`}

        styles={{

            container: (baseStyles, state) => ({
                ...baseStyles,
                width: '100%',
                fontFamily: 'Roboto'
            }),

            control: (baseStyles, state) => ({
                ...baseStyles,
                padding: '8px 8px 8px 32px',
                border: 0,
                fontSize: '14px',
                borderRadius: '8px',
                boxShadow: state.isFocused ? '0 0 0 1px rgb(160, 160, 160)' : 'none',
                outline: repeatedInfo.length > 0 ? 'solid 2px red' : 'none'

            }),

            multiValue: (baseStyles, state) => ({
                ...baseStyles,
                height: '26px',
                width: 'fit-content',
                fontSize: '16px',
                borderRadius: '4px',
                verticalAlign: 'middle',
                textAlign: 'center',
                alignItems: 'center',
                fontFamily: 'Roboto'
            }),

            placeholder: (baseStyles, state) => ({
                ...baseStyles,
                fontFamily: 'Roboto',
                fontStyle: 'italic',
                color: 'rgb(179,179,179)'
            }),

            valueContainer: (baseStyles, state) => ({
                ...baseStyles,
                padding: '0px'
            }),



        }}

        onChange={(e: any) => { handleChange(e) }}

        placeholder={props.placeholder}

    />
        {repeatedInfo.length > 0 && <>
                <div style={{
                    position: 'absolute',
                    width: '24px',
                    height: '24px',
                    transform: 'rotate(45deg)',
                    backgroundColor: 'rgb(236, 217, 217)',
                    bottom: '76px',
                    left: '16px',
                    borderRadius: '2px',
                    visibility: isHovering? 'visible' : 'hidden'
                }}></div>

                <div style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: '80px',
                    left: '-4px',
                    backgroundColor: 'rgb(236, 217, 217)',
                    borderRadius: '8px',
                    padding: '4px 4px 4px 4px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    visibility: isHovering? 'visible' : 'hidden',
                    lineHeight: '27px'

                }}>

                    <span style={{fontStyle: 'italic', color: 'red'}}>Já existem eventos registrados com os dados:</span>    
                    {repeatedInfo.map((item) => {

                        return <>
                            <span style={{fontWeight: '700'}}>{ new Date(item.day).toLocaleDateString()}: <span style={{fontWeight: '400'}}> {item.repeated.map( (repeatedProp) => `${repeatedProp}; ` )}</span></span>
                        </>   
                        
                    })}




                </div>

            </>

        }





    </>

    function handleChange(e: { value: string, label: string }[]) {
        FormContext?.insertFormInputs((values: any) => ({ ...values, [propertyName]: e.map(item => item.label) }))
    }

    function checkLimit() {

        const count = FormContext?.formInputs[propertyName]?.length

        if (!count) {
            return false
        }

        if (count >= inputLimit) {
            return true
        }

        return false
    }


    function checkIfRepeated() {

        console.log('/////////////////////////////////////////////////////////////')
        console.log(`/////////PROPERTY NAME ${propertyName}//////////////////////`)


        if (!FormContext?.formInputs.dataEvento) {
            console.log('No Data Evento, returning early')
            return false
        }

        let inputedDates: string[];

        if (Array.isArray(FormContext.formInputs.dataEvento)) {
            inputedDates = FormContext.formInputs.dataEvento
        } else {
            inputedDates = [FormContext.formInputs.dataEvento]
        }

        const toCompareInputs = FormContext?.formInputs[propertyName] as string[]

        console.log(inputedDates)

        const daysInputed = getDaysThatAreInputed()

        let eventsRepeated: { day: string, repeated: string }[] = []

        for (let day of daysInputed) {

            if (!day) {
                console.log('breaking...')
                break
            }

            let i = 0
            for (let evento of day.eventos) {

                if (evento.id == FormContext.formInputs.id) {
                    break
                }

                const eventoPropertyName = String(evento[propertyName]).split(',')

                console.log(`entering evento loop ${i} of ${day.eventos.length}`)
                i++

                if (!evento[propertyName] || !eventoPropertyName) {
                    console.log('breaking...')
                    break
                }

                let j = 0;
                for (let item of eventoPropertyName) {

                    console.log(`entering item loop ${j} of ${eventoPropertyName.length}`)
                    j++

                    for (let input of toCompareInputs) {

                        if (input == item) {
                            console.log(`found repeated ${input}`)
                            eventsRepeated = [...eventsRepeated, { day: day.dia, repeated: input }]



                        }

                    }

                }

            }
        }

        let parsedRepeated: { day: string, repeated: string[] }[] = []

        for (let item of eventsRepeated) {

            if (parsedRepeated.length == 0) {
                parsedRepeated = [{ day: item.day, repeated: [] }]
            }

            let i = 0
            for (let itemParsed of parsedRepeated) {

                if (itemParsed.day == item.day) {
                    itemParsed.repeated = [...itemParsed.repeated, item.repeated]
                    break
                }

                i++

                if (i == parsedRepeated.length) {
                    parsedRepeated = [...parsedRepeated, {
                        day: item.day,
                        repeated: [item.repeated]
                    }]
                    break
                }
            }

        }


        if (parsedRepeated.length > 0 ) {
            console.log('MORE THAN ONE REPEATED EVENT:')
            console.log(parsedRepeated)
            console.log('/////////////////////////////////////////////////////////////')
            return setRepeatedInfo(parsedRepeated)
        }

        console.log('NO REPEATED PROPERTY ON EVENT, RETURNING FALSE.')
        console.log('/////////////////////////////////////////////////////////////')
        return


        function getDaysThatAreInputed() {


            if (!inputedDates) {
                return []
            }

            const Days = inputedDates.map((inputedDate) => {
                return eventosContext?.state?.find((event) => {
                    return event.dia == new Date(inputedDate + ' 00:00:00').toString().slice(0, 15)
                })
            })

            if (Days.length > 0) {
                return Days
            }

            return []
        }


    }

    function handleHoverIn() {
        setHovering(true)
    }

    function handleHoverOut() {
        setHovering(false)
    }

}

