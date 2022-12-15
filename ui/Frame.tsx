'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import Calendar from "./Calendar"
import AddEvent from "./AddEvent";
import NavbarBot from "./NavbarBot";
import NavbarTop from "./NavbarTop";
import Loading from "./components/LoadingPage";
import { apiDataResponse } from "../pages/api/data";



export const frameContext = createContext<frameContext | null>(null)

export const frameRef = React.createRef()



export default function Frame() {
    
    //TODO: check if user is admin 

    const [events, setEvents] = useState<frontEndCalendarEventos[]> ()

    const [data, setData] = useState<apiDataResponse>()

    const [choosenView, setChoosenView] = useState('Update')

    const [addEventFormInputs, setAddEventFormInputs] = useState({} as any)

    const [isZoomedOut, setZoomedOut] = useState(false)
    
    const [selectedEvent, setSelectedEvent] = useState<eventSelectionState>({
        selected : false
    })



    const contextProviders : frameContext = {
        
        formContext: {
            formRef: React.createRef<HTMLFormElement>(),
            formInputs: addEventFormInputs,
            insertFormInputs: setAddEventFormInputs
        },
        eventSelectionContext: {
            state: selectedEvent,
            setState: setSelectedEvent
        },
        choosenViewContext: {
            state: choosenView,
            setState: setChoosenView
        },
        eventsContext: {
            state: events,
            setState: setEvents
        }, 
        zoomContext: {
            state: isZoomedOut,
            setState: setZoomedOut
        }
        
    }
    
    


    useEffect(() => {


        if (choosenView == 'Update') {
            getCalendarData() 
            getData()
            sessionStorage.setItem('initialScroll', 'false')
            setChoosenView('Calendar') 
        } 
        
        return

    }, [choosenView])

    useEffect(()=> {
        console.log('FORM INPUT:')
        console.log(addEventFormInputs)
    }, [addEventFormInputs])
    
    useEffect(() => {
        console.log('SELECTED EVENT:')
        console.log(selectedEvent.eventData)
    }, [selectedEvent.eventData])
    
    
    return <frameContext.Provider value={contextProviders} >
            <NavbarTop/>
            {
                events && data
                ? 
                    <>
                        {choosenView == 'Calendar' && <Calendar data={events}/>}
                        {choosenView == 'AddEvent' && <AddEvent cerData={data}/>}
                        {choosenView == 'EditEvent' && <AddEvent cerData={data} selectedEvent={selectedEvent.eventData}/>}
                    </>
                :
                    <Loading/>
            }
            <NavbarBot choosenView={choosenView} setChoosenView={setChoosenView}/>
    </frameContext.Provider>   
    
    
    

    
    async function getCalendarData() {
        let data = await fetch('/api/calendar').then( data => data.json()) as frontEndCalendarEventos[]
        setEvents(data.map((item) => {
            return {
                ...item,
                thisRef: React.createRef<HTMLDivElement>(),
                eventos: item.eventos.map((item) => {
                    return {
                        ...item,
                        thisRef: React.createRef<HTMLDivElement>()
                    }
                })
            }
        }))
    }

    async function getData() {
        const data = await fetch('/api/data').then( data => data.json()) as apiDataResponse
        return setData(data)
    }
    
}








export interface frontEndEventos  {
    veiculo: string[],
    titulo: string,
    responsavel: string,
    dataEvento: string[] | string,
    diaId?: number,
    id?: number,
    desc?: string,
    proposta: string,
    funcionarios?: string[],
    dataRegistrado?: string,
    propColor?: string,
    thisRef: React.RefObject<HTMLDivElement>
} 

export interface frontEndCalendarEventos {
    dia: string,
    thisRef: React.RefObject<HTMLDivElement>,
    eventos: frontEndEventos[]
}[]

type eventSelectionState = {
    selected: boolean,
    eventData?: frontEndEventos
}


interface frameContext  {

    formContext: {
        formRef: React.RefObject<HTMLFormElement>
        formInputs: frontEndEventos,
        insertFormInputs: React.Dispatch<React.SetStateAction<frontEndEventos>>
    },

    eventSelectionContext: {
        state: eventSelectionState,
        setState: React.Dispatch<React.SetStateAction<eventSelectionState>>
    },
    

    choosenViewContext: {
        state: string
        setState: React.Dispatch<React.SetStateAction<string>>,
    },

    eventsContext: {
        state: frontEndCalendarEventos[] | undefined,
        setState: React.Dispatch<React.SetStateAction<frontEndCalendarEventos[] | undefined>>
    },

    zoomContext: {
        state: boolean,
        setState: React.Dispatch<React.SetStateAction<boolean>>
    }
} 