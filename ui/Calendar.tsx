
'use client'

import { motion } from 'framer-motion'
import React, { createContext, useState } from 'react'
import { calendarInterface, databaseEventInterface } from '../pages/api/calendar'
import style from './calendar.module.scss'
import Day from './Day'



export default  function Calendar( props: {data: calendarInterface }) {
    
    

    return  (
        <motion.div className={style.calendar} >
            <div className={style.calendarCapsule}>
                {props.data.map((item, i) => {
                    return(
                        <React.Fragment key={`daykey${i}`}>
                            <Day events={item.eventos} day={item.dia} />
                            <div className={style.bar} ></div>
                        </React.Fragment>
                    )
                })}
            </div>
        </motion.div>
        )
    

}

