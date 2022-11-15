'use client'

import { useState } from "react"
import Calendar from "./Calendar"
import { calendarInterface, databaseEventInterface } from '../pages/api/calendar';
import AddEvent from "./AddEvent";
import NavbarBot from "./NavbarBot";
import NavbarTop from "./NavbarTop";

export default function Frame(
    props: {
        events: calendarInterface,
    }) {
    
    //TODO: animate components mounting
    //TODO: check if user is admin 

    const [choosenView, setChoosenView] = useState('Calendar')
    

    return <>
        <NavbarTop/>
        {choosenView == 'Calendar' && <Calendar data={props.events}/>}
        {choosenView == 'AddEvent' && <AddEvent/>}
        <NavbarBot choosenView={choosenView} setChoosenView={setChoosenView}/>
    </>    
}