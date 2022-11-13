
import { calendarInterface, databaseEventInterface } from '../pages/api/calendar'
import style from './calendar.module.scss'
import Day from './Day'

export default  function Calendar( props: {data: calendarInterface }) {

    

    return  (
        <div className={style.calendar}>
            {props.data.map((item) => {
                return(
                    <>
                        <Day events={item.eventos} day={item.dia}/>
                        <div className={style.bar}></div>
                    </>
                )
            })}

        </div>
        )
    

}

