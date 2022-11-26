
import { useContext } from 'react'
import { addEventContext } from '../AddEvent'
import { frameContext } from '../Frame'
import styles from './selecteddates.module.scss'


export default function SelectedDates() {

    const selectedDates = useContext(addEventContext)?.dateSelection

    console.log(selectedDates)

    return <div className={styles.datesContainer}>
        
        {
            selectedDates?.state.map((date, i) => (
                <div className={styles.date} style={{backgroundColor: `rgb(${228 + i }, ${228 + i }, ${228 + i })`}}>
                    {new Date(date + ' 00:00:00').toLocaleDateString()}
                </div>
            ))
        }


    </div>


}