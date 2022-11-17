'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import Calendar from "./Calendar"
import { calendarInterface, databaseEventInterface } from '../pages/api/calendar';
import AddEvent from "./AddEvent";
import NavbarBot from "./NavbarBot";
import NavbarTop from "./NavbarTop";



export const formContext = createContext<{formInputs: databaseEventInterface, insertFormInputs: React.SetStateAction<any>} | null>(null)

export default function Frame(
    props: {
        events: calendarInterface,
    }) {
    
    //TODO: animate components mounting
    //TODO: check if user is admin 

    const [choosenView, setChoosenView] = useState('Calendar')
    const [addEventFormInputs, setAddEventFormInputs] = useState({} as any)

    

    useEffect(()=> {
        console.log(addEventFormInputs)
    }, [addEventFormInputs])
    

    return <formContext.Provider value={{formInputs: addEventFormInputs, insertFormInputs: setAddEventFormInputs}}>
        <NavbarTop/>
        {choosenView == 'Calendar' && <Calendar data={props.events}/>}
        {choosenView == 'AddEvent' && <AddEvent/>}
        <NavbarBot choosenView={choosenView} setChoosenView={setChoosenView}/>
    </formContext.Provider>   
    
    


}