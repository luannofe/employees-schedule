
import { useContext } from 'react'
import { addEventContext } from '../AddEvent'
import styles from './selecteddates.module.scss'


export default function SelectedDates() {

    const selectedDates = useContext(addEventContext)?.dateSelection

    console.log(selectedDates)

    return <div className={styles.datesContainer}>
        
        {
            selectedDates?.state.map((date, i) => (
                <div className={styles.date} style={{backgroundColor: `rgb(${228 + i }, ${228 + i }, ${228 + i })`}} key={`${date} ${i}`}> 
                    {new Date(date + ' 00:00:00').toLocaleDateString()}
                    <button onClick={ () => deleteDate(date)} className={styles.buttonDate}>X</button>
                </div>
            ))
        }

    </div>


    function deleteDate(date: string) {
        selectedDates?.setState( (prevState) => prevState.filter( item => item != date))
    }

}