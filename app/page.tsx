import styles from './page.module.scss'

import Calendar from "../ui/Calendar";

import { calendarInterface, databaseEventInterface } from '../pages/api/calendar';
import NavbarBot from '../ui/NavbarBot';
import NavbarTop from '../ui/NavbarTop';
import Frame from '../ui/Frame';






export default async function App() {

  //TODO: user selected months UX

  let events = await populateMonthsArray()

  return (
    <div className={styles.bodyContainer}>
      <Frame events={events}/>
    </div>
  )

}

async function getData() {

  return await fetch('http://localhost:3000/api/calendar', {
    method: 'POST',
  }).then(res => res.json())
    .then(data => data) as calendarInterface
}

async function mountMonthsPeriod(initialDate: Date, span: number) {

  let date = new Date(
    initialDate.getFullYear(),
    initialDate.getMonth(),
    1
  )
  let dates = []

  let MonthsAhead = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + span,
    new Date().getDate()
  );


  while (date.getMonth() != MonthsAhead.getMonth()) {
    dates.push(date.toDateString())
    date.setDate(date.getDate() + 1)
  }

  return dates as string[]
}

async function populateMonthsArray() {
  console.log('here')
  let unpopulatedMonthsArray = await mountMonthsPeriod(new Date(), 1)
  console.log('here')
  let eventsArray = await getData()

  console.log(eventsArray)
  console.log(unpopulatedMonthsArray)

  return unpopulatedMonthsArray.map((item, i, arr) => {
    console.log()
    let j = 0
    while (j < eventsArray.length) {
      if (eventsArray[j].dia == item) {
        return eventsArray[j]
      }
      j++
    }
    return { dia: item }
  })

}