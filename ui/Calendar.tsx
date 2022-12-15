
'use client'

import { motion } from 'framer-motion'
import React, { createContext, UIEventHandler, useContext, useEffect, useRef, useState } from 'react'
import style from './calendar.module.scss'
import Day from './Day'
import { frameContext, frontEndCalendarEventos } from './Frame'


export const calendarRef = React.createRef<HTMLDivElement>()

export default  function Calendar( props: { data: frontEndCalendarEventos[] } ) {
    
    const isZoomed = useContext(frameContext)?.zoomContext.state

    useEffect(() => {

        const scrollPos = sessionStorage.getItem('calendarScrlPos')
        const initialScrolled = (sessionStorage.getItem('initialScroll') == 'true')

        if (scrollPos && initialScrolled) {
            return calendarRef.current?.scrollTo(0, parseInt(scrollPos))
        }
        
        return

    }, [])

    return  (

        <motion.div className={style.calendar} ref={calendarRef} onScroll={(e) => {sessionStorage.setItem('calendarScrlPos', String(e.currentTarget.scrollTop))}}>
            <div className={style.calendarCapsule} 

            style={{
                transform: isZoomed? 'scale(0.85)' : '', 
                transition: '0.3s',
                minWidth:  '1380px',
                maxWidth: '1380px',
                width: '1380px',
            }}>

                {props.data.map((item, i) => {
                    return(
                        <React.Fragment key={`daykey${i}`}>
                            <Day events={item.eventos} day={item.dia} thisRef={item.thisRef}/>
                            <div className={style.bar} style = {{
                                height: isZoomed? '200px' : '500px'
                            }} ></div>
                            
                        </React.Fragment>
                    )
                })}
            </div>
        </motion.div>

        )
    

}

