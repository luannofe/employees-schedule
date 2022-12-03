
'use client'

import { motion } from 'framer-motion'
import React, { createContext, UIEventHandler, useContext, useEffect, useRef, useState } from 'react'
import style from './calendar.module.scss'
import Day from './Day'
import { frontEndCalendarEventos } from './Frame'


export const calendarRef = React.createRef<HTMLDivElement>()

export default  function Calendar( props: { data: frontEndCalendarEventos[] } ) {
    
    

    useEffect(() => {

        const scrollPos = sessionStorage.getItem('calendarScrlPos')
        const initialScrolled = (sessionStorage.getItem('initialScroll') == 'true')

        if (scrollPos && initialScrolled) {
            return calendarRef.current?.scrollTo(0, parseInt(scrollPos))
        }
        
        return

    }, [])

    return  (

        <motion.div className={style.calendar} ref={calendarRef} onScroll={(e) => {sessionStorage.setItem('calendarScrlPos', String(e.currentTarget.scrollTop)); console.log(e.currentTarget.scrollTop)}}>
            <div className={style.calendarCapsule} >
                {props.data.map((item, i) => {
                    return(
                        <React.Fragment key={`daykey${i}`}>
                            <Day events={item.eventos} day={item.dia} thisRef={item.thisRef}/>
                            <div className={style.bar} ></div>
                        </React.Fragment>
                    )
                })}
            </div>
        </motion.div>

        )
    

}

