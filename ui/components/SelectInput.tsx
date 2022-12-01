'use client'

import style from './selectinput.module.scss'
import React, { useContext, useEffect, useState } from "react"
import { frameContext } from '../Frame'
import Select, { CSSObjectWithLabel } from 'react-select'


export default function SelectInput(props: {
    propertyName: 'funcionarios' | 'veiculo',
    propertyOptions: { id: number, nome: string }[],
    placeholder: string,
    inputLimit: number,
    defaultValue: string[]
}) {

    const { propertyName, propertyOptions, inputLimit, defaultValue } = props

    let defaultVal = defaultValue.map((item) => {return { value: item, label: item }})

    const selectOptions = propertyOptions.map((item) => { return { value: item.nome, label: item.nome } })

    const FormContext = useContext(frameContext)?.formContext



    return <Select

        

        closeMenuOnSelect={propertyName == 'funcionarios'? false : true}

        options={selectOptions}

        isClearable={true}

        isOptionDisabled={() => checkLimit()}

        isMulti 

        defaultValue={defaultVal}

        noOptionsMessage={({inputValue}) => !inputValue ? "Sem opções." : `Não foi encontrado nenhum ${propertyName}`} 

        styles={{

            container: (baseStyles, state) => ({
                ...baseStyles,
                width: '100%',
            }),

            control: (baseStyles, state) => ({
                ...baseStyles,
                padding: '8px 8px 8px 32px',
                border: 0,
                fontSize: '14px',
                borderRadius: '8px',
                boxShadow: state.isFocused ? '0 0 0 1px rgb(160, 160, 160)' : 'none'

            }),

            multiValue: (baseStyles, state) => ({
                ...baseStyles,
                height: '26px',
                width: 'fit-content',
                fontSize: '16px',
                borderRadius: '4px',
                verticalAlign: 'middle',
                textAlign: 'center',
                alignItems: 'center'
            }),

            placeholder: (baseStyles, state) => ({
                ...baseStyles,
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

}

