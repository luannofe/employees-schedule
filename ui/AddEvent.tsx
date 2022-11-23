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



export default function AddEvent(props: {selectedEvent?: frontEndEventos}) {

    // TODO: reset when submitted

    let employeesArr : string[];
    if (props.selectedEvent?.funcionarios) {
        employeesArr = String(props.selectedEvent?.funcionarios).split(',')
    } else {
        employeesArr = []
    }
     

    const [inputInsertedValues, setInputInsertedValues] = useState<string[]>(employeesArr)
    const FormContext = useContext(frameContext)?.formContext
    





    return  (
            <div className={styles.addEventContainer} >
                    
                    <div className={styles.addEventDiv}>
                        <form action="post" ref={FormContext?.formRef}>
                            <span className={styles.addEventTitle}>Inserir evento...</span>
                            <div style={{display: 'flex', width: '95%', justifyContent: 'space-around'}}> 
                                <label htmlFor="" style={{flex: 1}}>
                                    <input className={styles.inputBase} onKeyDown={(e) => {validateSize(e, 40)}} onChange={(e)=>{handleChange(e)}} name="titulo" type="text" placeholder='Titulo'  defaultValue={props.selectedEvent?.titulo}/>
                                </label>
                                <label htmlFor="" style={{width: '150px', height: '100%', justifyContent: 'flex-end'}}>
                                    <input className={styles.inputBase}  onChange={(e)=>{handleChange(e)}} style={{width:'110px', paddingLeft: '8px'}} name="dataEvento" type="date" placeholder='Data do evento' defaultValue={props.selectedEvent?.dataEvento} min={new Date().toISOString().split("T")[0]}/>
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
                    <Event event={FormContext!.formInputs}></Event>
            </div>
        )

    function handleChange(event : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)  {

        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        FormContext?.insertFormInputs((values: any) => ({...values, [name]: value}))

    }

    function validateSize(e: React.KeyboardEvent<HTMLInputElement>, maxLength : number) {

        let el = e.currentTarget

        console.log(el.value.length)

        if (el.value.length > maxLength && e.key !== 'Backspace' ) {
            e.preventDefault()
        }

    }

}
  