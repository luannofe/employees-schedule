'use client'

import styles from './addevent.module.scss'
import iconPersonWorker from '../public/iconPersonWorker.svg'
import iconVehicle from '../public/iconVehicle.svg'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import Event from './Event'
import { frameContext, frontEndEventos } from './Frame'
import ColorsBoxInput from './components/ColorsBoxInput'
import { createContext } from 'react'
import SelectedDates from './components/SelectedDates'
import SelectInput from './components/SelectInput'
import { apiDataResponse } from '../pages/api/data'
import SpecialEventButtons from './components/SpecialEventButtons'


export const addEventContext = createContext<addEventContext | null>(null)

export default function AddEvent(props: {selectedEvent?: frontEndEventos, cerData: apiDataResponse}) {


    //TODO: deletar dias passados
    //TODO: traço pra diferenciar meses
    

    //FIXME: popup não sai do input de carro
    //FIXME: editing the first repeated event doesnt shows it as a repeated
    //FIXME: databsae opening everly
    //FIXME: sistema de desselecionar
    //FIXME: mudar fontes
    //FIXME: datas bugadas

    //FIXME: evento especial deve ser o primeiro do dia


    const [eventType, setEventType] = useState(props.selectedEvent?.type || 0)

    let employeesArr : string[];

    if (props.selectedEvent?.funcionarios) {
        employeesArr = String(props.selectedEvent?.funcionarios).split(',')
    } else {
        employeesArr = []
    }

    let vehiclesArr : string[];

    if (props.selectedEvent?.veiculo) {
        vehiclesArr = String(props.selectedEvent?.veiculo).split(',')
    } else {
        vehiclesArr = []
    }
     
    console.log(employeesArr)

    const [selectedDates, setSelectedDates] = useState<string[]>([])

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
            <div className={styles.addEventContainer}  >
                <div className={styles.addEventWraperContainer}>  
                    <SelectedDates/>
                    <div className={styles.addEventDiv}>
                        <form action="post" ref={FormContext?.formRef}>
                            <div style={{display: 'flex', width: '95%', alignItems: 'flex-end'}}>
                                <span className={styles.addEventTitle} style={{flex: 1}}>Inserir evento...</span>
                                <input className={styles.inputBase} style={{width: '100px', fontSize: '14px', padding: '4px 4px 4px 4px', height: 'fit-content', textAlign: 'center'}} disabled={eventType != 0} value={FormContext?.formInputs.proposta} maxLength={9} onChange={(e)=>{handleChange(e)}} name="proposta" type="text" placeholder='2677_22_M'  defaultValue={props.selectedEvent?.proposta}></input>
                            </div>
                            <div style={{display: 'flex', width: '95%', justifyContent: 'space-around'}}> 
                                <label htmlFor="" style={{flex: 1}}>
                                    <input className={styles.inputBase} maxLength={40} onChange={(e)=>{handleChange(e)}} value={FormContext?.formInputs.titulo} name="titulo" type="text" placeholder='Titulo'  defaultValue={props.selectedEvent?.titulo || FormContext?.formInputs.titulo}/>
                                </label>
                                <label htmlFor="" style={{width: '150px', height: '100%', justifyContent: 'flex-end'}}>
                                    <input className={styles.inputBase} onBlur={e => handleDate(e)} onKeyDown={e => handleDateEnter(e)} style={{width:'110px', paddingLeft: '8px'}} name="dataEvento" type="date" placeholder='Data do evento' defaultValue={props.selectedEvent?.dataEvento} min={new Date().toISOString().split("T")[0]}/>
                                </label>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', gap:'16px', width: '95%'}}>
                                <label htmlFor="" style={{width: '220px'}}>
                                    <Image className={styles.inputIcon} src={iconPersonWorker} alt=''/>
                                    <input className={styles.inputBase} style={{width: '230px'}} maxLength={16} disabled={eventType != 0} value={FormContext?.formInputs.responsavel} onChange={(e)=>{handleChange(e)}} name="responsavel" type="text" placeholder='Supervisor' defaultValue={FormContext?.formInputs.titulo || props.selectedEvent?.responsavel}/>
                                </label>
                                <label htmlFor="">
                                    <Image className={styles.inputIcon} src={iconVehicle} alt=''/>
                                    <SelectInput propertyName='veiculo' defaultValue={vehiclesArr} disabled={eventType != 0} placeholder='Selecione...' inputLimit={2} propertyOptions={props.cerData.carros}/>
                                </label>
                            </div>
                            <label htmlFor="">
                                <textarea className={styles.inputBase} disabled={eventType != 0} onChange={(e)=>{handleChange(e)}} value={FormContext?.formInputs.desc} style={{width: '100%', resize:'none'}} name="desc" maxLength={260} rows={4} placeholder='Descrição do evento (max: 280 carácteres.)' defaultValue={props.selectedEvent?.desc}/>
                            </label>
                            <span className={styles.addEventTitle}  style={{fontSize: '22px'}}>Colaboradores:</span>
                            <label htmlFor="" >
                                <SelectInput propertyName='funcionarios' disabled={(eventType != 0 && eventType != 2)}  defaultValue={employeesArr || FormContext?.formInputs.funcionarios} placeholder='Selecione ou digite...' inputLimit={99} propertyOptions={props.cerData.funcionarios} />                        
                            </label>
                            <span className={styles.addEventTitle}  style={{fontSize: '22px'}}>Selecione uma cor:</span>
                            <ColorsBoxInput eventTypeState={{state: eventType, set: setEventType}}/>
                            <SpecialEventButtons eventTypeState={{state: eventType, set: setEventType}}/>
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

    function handleDate(event : React.FormEvent<HTMLInputElement>) {

        const value = event.currentTarget.value;

        if (new Date(value + ' 00:00:00').toLocaleDateString() == 'Invalid Date') {
            return
        }

        if (viewContext?.state == ('EditEvent')) {
            return setSelectedDates([value])
        }

        let checkRepeated = new Set(selectedDates)

        checkRepeated.add(value)

        return setSelectedDates(Array.from(checkRepeated).sort())   
    }

    function handleDateEnter(event : React.KeyboardEvent<HTMLInputElement>) {

        if (event.key == 'Enter') {

            
            const value = event.currentTarget.value;
            
            if (new Date(value + ' 00:00:00').toLocaleDateString() == 'Invalid Date') {
                return
            }

            event.preventDefault()
            
            if (viewContext?.state == ('EditEvent')) {
                return setSelectedDates([value])
            }
    
            let checkRepeated = new Set(selectedDates)
    
            checkRepeated.add(value)
    
            return setSelectedDates(Array.from(checkRepeated).sort())   

        }

    }

}
  

interface addEventContext {

    dateSelection: {
        state: string[],
        setState: React.Dispatch<React.SetStateAction<string[]>>
    }
}