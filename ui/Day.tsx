import { eventos } from '@prisma/client'
import { useInView } from 'framer-motion'
import { useContext, useEffect, useRef } from 'react'
import style from './day.module.scss'
import Event from './Event'
import { frameContext, frontEndEventos, viewPortContext } from './Frame'

export default function Day(props: {events?: frontEndEventos[], day: string}) {

    let processedDate = dateProcess(props.day)

    const ref = useRef(null)
    const isInView = useInView(ref)
    const inViewContext = useContext(viewPortContext)
    const thisMonth = new Date(props.day).toLocaleString('default', {month: 'long'})

    useEffect(() => {
        if (isInView && inViewContext?.state !== thisMonth) {
            inViewContext?.setState(thisMonth.toUpperCase())
        }
    }, [isInView])
    
    return (
        <div className={style.day} ref={ref}>
            <span className={style.title}>{processedDate.day}</span>
            <span className={style.subTitle}>{processedDate.weekDay}</span>
            <div style={{minHeight: '650px', minWidth: '170px'}}>
                {props.events?.map((event) => {
                    return <Event event={event} key={`asdasdasd${event.id}`}/>
                })}
            </div>
        </div>
    )
}

function dateProcess(date: string) {

    let thisDate = new Date(date)
    let weekDaysPTBR = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

    return {
        day: thisDate.getDate(), 
        weekDay: weekDaysPTBR[thisDate.getDay()]
    }
}