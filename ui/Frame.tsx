'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import Calendar from "./Calendar"
import { calendarInterface, databaseEventInterface } from '../pages/api/calendar';
import AddEvent from "./AddEvent";
import NavbarBot from "./NavbarBot";
import NavbarTop from "./NavbarTop";
import { eventos } from "@prisma/client";


export interface frontEndEventos  {
    veiculo: string,
    titulo: string,
    responsavel: string,
    dataEvento: string,
    diaId?: number,
    id?: number,
    desc?: string,
    diaOrdem?: number,
    funcionarios?: string[],
    dataRegistrado?: string
} 

export interface frontEndCalendarEventos {
    dia: string,
    eventos: frontEndEventos[]
}[]

type eventSelectionState = {
    selected: boolean,
    eventData?: frontEndEventos
}

interface frameContext  {

    formContext: {
        formInputs: frontEndEventos,
        insertFormInputs: React.Dispatch<React.SetStateAction<frontEndEventos>>
    },

    eventSelectionContext: {
        state: eventSelectionState,
        setState: React.Dispatch<React.SetStateAction<eventSelectionState>>
    }
    
} 

export const frameContext = createContext<frameContext | null>(null)



export default function Frame() {
    
    //TODO: animate components mounting
    //TODO: check if user is admin 

    const [events, setEvents] = useState<frontEndCalendarEventos[]> ()

    const [choosenView, setChoosenView] = useState('Update')

    const [addEventFormInputs, setAddEventFormInputs] = useState({} as any)

    const [selectedEvent, setSelectedEvent] = useState<eventSelectionState>({
        selected : false
    })




    
    const contextProviders : frameContext = {
        formContext: {
            formInputs: addEventFormInputs,
            insertFormInputs: setAddEventFormInputs
        },
        eventSelectionContext: {
            state: selectedEvent,
            setState: setSelectedEvent
        }
    }



    useEffect(() => {

        if (choosenView == 'Update') {
            getCalendarData() 
            setChoosenView('Calendar') 
        } else {
            return
        }

    }, [choosenView])

    useEffect(()=> {
        return console.log(addEventFormInputs)
    }, [addEventFormInputs])

    useEffect(() => {
        return console.log(selectedEvent.eventData)
    }, [selectedEvent.eventData])
    

    return <frameContext.Provider value={contextProviders}>
        <NavbarTop/>
            {
            events? 
            <>
                {choosenView == 'Calendar' && <Calendar data={events}/>}
                {choosenView == 'AddEvent' && <AddEvent/>}
                {choosenView == 'EditEvent' && <AddEvent selectedEvent={selectedEvent.eventData}/>}
            </>:
            <h1>Loading events...
            </h1>}
        <NavbarBot choosenView={choosenView} setChoosenView={setChoosenView}/>
    </frameContext.Provider>   
    
    



    async function getCalendarData() {
        let data = await fetch('/api/calendar').then( data => data.json()) as frontEndCalendarEventos[]
        setEvents(data)
    }

}