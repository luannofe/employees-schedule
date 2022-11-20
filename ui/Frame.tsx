'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import Calendar from "./Calendar"
import { calendarInterface, databaseEventInterface } from '../pages/api/calendar';
import AddEvent from "./AddEvent";
import NavbarBot from "./NavbarBot";
import NavbarTop from "./NavbarTop";


type eventSelectionState = {
    selected: boolean,
    eventData?: databaseEventInterface
}

interface frameContext  {

    formContext: {
        formInputs: databaseEventInterface,
        insertFormInputs: React.Dispatch<React.SetStateAction<databaseEventInterface>>
    },

    eventSelectionContext: {
        state: eventSelectionState,
        setState: React.Dispatch<React.SetStateAction<eventSelectionState>>
    }
    
} 

export const frameContext = createContext<frameContext | null>(null)



export default function Frame(
    props: {
        events: calendarInterface,
    }) {
    
    //TODO: animate components mounting
    //TODO: check if user is admin 

    const [choosenView, setChoosenView] = useState('Calendar')

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


    useEffect(()=> {
        console.log(addEventFormInputs)
    }, [addEventFormInputs])

    useEffect(() => {
        console.log(selectedEvent.eventData)
    }, [selectedEvent.eventData])
    

    return <frameContext.Provider value={contextProviders}>
        <NavbarTop/>
            {choosenView == 'Calendar' && <Calendar data={props.events}/>}
            {choosenView == 'AddEvent' && <AddEvent/>}
            {choosenView == 'EditEvent' && <AddEvent selectedEvent={selectedEvent.eventData}/>}
        <NavbarBot choosenView={choosenView} setChoosenView={setChoosenView}/>
    </frameContext.Provider>   
    
    


}