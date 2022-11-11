import { databaseEventInterface } from '../pages/api/data'
import style from './calendar.module.scss'
import Event from './Event'

export default function Calendar( props: {data: databaseEventInterface[] }) {


    return  (
        <div className={style.calendar}>
            {props.data.map((event) => {
                return <Event event={event}/>
            })}
            
        </div>
        )
    

}

