import { databaseEventInterface } from '../pages/api/calendar'
import style from './day.module.scss'
import Event from './Event'

export default function Day(props: {events?: databaseEventInterface[], day: string}) {

    let processedDate = dateProcess(props.day)
    

    return (
        <div className={style.day}>
            <span className={style.title}>{processedDate.day}</span>
            <span className={style.subTitle}>{processedDate.weekDay}</span>
            <div style={{minHeight: '650px', minWidth: '170px'}}>
                {props.events?.map((event) => {
                    return <Event event={event}/>
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