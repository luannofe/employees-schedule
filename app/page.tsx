import styles from './page.module.scss'

import Calendar from "../ui/Calendar";

import { calendarInterface, databaseEventInterface } from '../pages/api/calendar';

import Image from 'next/image';





export default async function App() {

  //TODO: user selected months UX

  let events = await populateMonthsArray()


  return (
    <div className={styles.bodyContainer}>
      <div className={styles.navbarTop}>
        <span >power<span>diamond</span></span>
      </div>
      <Calendar data={events}/>
      <div className={styles.navbarBot}>
        <div className={styles.buttonsContainer}>
          <button className={styles.button} >
            <Image className={styles.icons} width={50} height={50} src='/iconPlus.svg' alt='Cadastrar'></Image>
          </button>
          <button className={styles.button} >
            <Image className={styles.icons} width={50} height={50} src='/iconEdit.svg' alt='Editar'></Image>
          </button>
          <button className={styles.buttonDelete}>
            <Image className={styles.icons}  width={50} height={50} src='/iconX.svg' alt='Apagar'></Image>
          </button>
        </div>
      </div>
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
  let unpopulatedMonthsArray = await mountMonthsPeriod(new Date(), 1)
  let eventsArray = await getData()


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