
'use client'

import { motion } from 'framer-motion'
import { calendarInterface, databaseEventInterface } from '../pages/api/calendar'
import style from './calendar.module.scss'
import Day from './Day'

export default  function Calendar( props: {data: calendarInterface }) {

    

    return  (
        <motion.div className={style.calendar} >
            <div className={style.calendarCapsule}>
                {props.data.map((item) => {
                    return(
                        <>
                            <Day events={item.eventos} day={item.dia}/>
                            <div className={style.bar}></div>
                        </>
                    )
                })}
            </div>
        </motion.div>
        )
    

}

