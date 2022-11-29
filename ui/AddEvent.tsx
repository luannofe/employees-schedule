'use client'

import styles from './addevent.module.scss'
import iconPersonWorker from '../public/iconPersonWorker.svg'
import iconVehicle from '../public/iconVehicle.svg'
import Image from 'next/image'
import SelectInput from './components/SelectInput'
import { useContext, useEffect, useRef, useState } from 'react'
import Event from './Event'
import { frameContext, frontEndEventos } from './Frame'
import { eventos } from '@prisma/client'
import ColorsBoxInput from './components/ColorsBoxInput'
import { createContext } from 'react'
import SelectedDates from './components/SelectedDates'


export const addEventContext = createContext<addEventContext | null>(null)

export default function AddEvent(props: {selectedEvent?: frontEndEventos}) {

    //TODO: select more than one car
    //TODO: !! NÃO PODEM: mesmo dia carro / colaborador !!
    //TODO: tentar arrastar os eventos
    //TODO: colaborador e carro devem ser checklists
    //TODO: MELHORAR SISTEMA DE CALENDARIO, TALVEZ ABRIR JÁ NO DIA ATUAL?
    //TODO: admin


    let employeesArr : string[];
    if (props.selectedEvent?.funcionarios) {
        employeesArr = String(props.selectedEvent?.funcionarios).split(',')
    } else {
        employeesArr = []
    }
     
    const [selectedDates, setSelectedDates] = useState<string[]>([])
    const [inputInsertedValues, setInputInsertedValues] = useState<string[]>(employeesArr)

    const FormContext = useContext(frameContext)?.formContext
    const viewContext = useContext(frameContext)?.choosenViewContext
    
    const addEventContextValues : addEventContext = {

        dateSelection: {
            state: selectedDates,
            setState: setSelectedDates
        }
    }

    useEffect(() => {

        if (selectedDates.length == 0 && viewContext?.state == 'EditEvent') {
            if (props.selectedEvent?.dataEvento) {
                setSelectedDates([props.selectedEvent.dataEvento as string])
            }
        }

        FormContext?.insertFormInputs( prev => {
            return {
                ...prev,
                dataEvento: selectedDates
            }
        })

    }, [selectedDates])




    return  (
        <addEventContext.Provider value={addEventContextValues}>
            <div className={styles.addEventContainer} >
                <div className={styles.addEventWraperContainer}>  
                    <SelectedDates/>
                    <div className={styles.addEventDiv}>
                        <form action="post" ref={FormContext?.formRef}>
                            <div style={{display: 'flex', width: '95%'}}>
                                <span className={styles.addEventTitle} style={{flex: 1}}>Inserir evento...</span>
                                <input className={styles.inputBase} style={{width: '100px', fontSize: '16px', padding: '4px 4px 4px 4px', height: 'fit-content', textAlign: 'center'}} onKeyDown={(e) => {validateSize(e, 8)}} onChange={(e)=>{handleChange(e)}} name="proposta" type="text" placeholder='2677_22_M'  defaultValue={props.selectedEvent?.proposta}></input>
                            </div>
                            <div style={{display: 'flex', width: '95%', justifyContent: 'space-around'}}> 
                                <label htmlFor="" style={{flex: 1}}>
                                    <input className={styles.inputBase} onKeyDown={(e) => {validateSize(e, 40)}} onChange={(e)=>{handleChange(e)}} name="titulo" type="text" placeholder='Titulo'  defaultValue={props.selectedEvent?.titulo}/>
                                </label>
                                <label htmlFor="" style={{width: '150px', height: '100%', justifyContent: 'flex-end'}}>
                                    <input className={styles.inputBase}  onChange={(e)=>{handleDate(e)}} style={{width:'110px', paddingLeft: '8px'}} name="dataEvento" type="date" placeholder='Data do evento' defaultValue={props.selectedEvent?.dataEvento} min={new Date().toISOString().split("T")[0]}/>
                                </label>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', gap:'64px', width: '95%'}}>
                                <label htmlFor="">
                                    <Image className={styles.inputIcon} src={iconPersonWorker} alt=''/>
                                    <input className={styles.inputBase}  onKeyDown={(e) => {validateSize(e, 16)}} onChange={(e)=>{handleChange(e)}} name="responsavel" type="text" placeholder='Supervisor' defaultValue={props.selectedEvent?.responsavel}/>
                                </label>
                                <label htmlFor="">
                                    <Image className={styles.inputIcon} src={iconVehicle} alt=''/>
                                    <input className={styles.inputBase}  onKeyDown={(e) => {validateSize(e, 16)}} onChange={(e)=>{handleChange(e)}} name="veiculo" type="text" placeholder='Carro' defaultValue={props.selectedEvent?.veiculo} />
                                </label>
                            </div>
                            <label htmlFor="">
                                <textarea className={styles.inputBase}  onChange={(e)=>{handleChange(e)}} style={{width: '100%', resize:'none'}} name="desc" maxLength={260} rows={4} placeholder='Descrição do evento (max: 280 carácteres.)' defaultValue={props.selectedEvent?.desc}/>
                            </label>
                            <span className={styles.addEventTitle}  style={{fontSize: '22px'}}>Colaboradores:</span>
                            <label htmlFor="">                           
                                <SelectInput  insertedValues={inputInsertedValues} setInsertedValues={setInputInsertedValues}/>
                            </label>
                            <ColorsBoxInput/>
                        </form>
                    </div>
                    <div style={{position: 'absolute', right: '120px'}}>
                        <Event event={FormContext!.formInputs}></Event>
                    </div>
                </div>  
            </div>
        </addEventContext.Provider>    
    )





    function handleChange(event : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)  {

        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        FormContext?.insertFormInputs((values: any) => ({...values, [name]: value}))

    }

    function handleDate(event : React.ChangeEvent<HTMLInputElement>) {

        const value = event.currentTarget.value;

        if (viewContext?.state == ('EditEvent')) {
            return setSelectedDates([value])
        }

        let checkRepeated = new Set(selectedDates)

        checkRepeated.add(value)

        return setSelectedDates(Array.from(checkRepeated).sort())   
    }

    function validateSize(e: React.KeyboardEvent<HTMLInputElement>, maxLength : number) {

        let el = e.currentTarget

        console.log(el.value.length)

        if (el.value.length > maxLength && e.key !== 'Backspace' ) {
            e.preventDefault()
        }

    }

}
  

interface addEventContext {

    dateSelection: {
        state: string[],
        setState: React.Dispatch<React.SetStateAction<string[]>>
    }
}