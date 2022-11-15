'use client'

import Image from "next/image"
import styles from './navbar.module.scss'
import { useRouter } from 'next/navigation'
import { METHODS } from "http"
import { databaseEventInterface } from "../pages/api/calendar"
import { ChangeEvent, FormEvent, useState } from "react"


export default function NavbarBot(props: {
  setChoosenView: React.SetStateAction<any>,
  choosenView: string
}) {

  const [formInputs, setFormInputs] = useState({})

  //update formdata, validate and send to api endpoint to post


  return (
    <div className={styles.navbarBot}>
      <div className={styles.buttonsContainer}>
        {props.choosenView == 'Calendar' && (<>
          <button className={styles.button} onClick={() => {
            props.setChoosenView('AddEvent')
          }}>
            <Image className={styles.icons} width={50} height={50} src='/iconPlus.svg' alt='Cadastrar'></Image>
          </button>
          <button className={styles.button} >
            <Image className={styles.icons} width={50} height={50} src='/iconEdit.svg' alt='Editar'></Image>
          </button>
          <button className={styles.buttonDelete}>
            <Image className={styles.icons} width={50} height={50} src='/iconX.svg' alt='Apagar'></Image>
          </button>
        </>)}
        {props.choosenView == 'AddEvent' && (<>
          <button className={styles.buttonDelete} onClick={() => {props.setChoosenView('Calendar')}}>
            <Image className={styles.icons} width={50} height={50} src='/iconUndo.svg' alt='Voltar'></Image>
          </button>
          <button className={styles.button} >
            <Image className={styles.icons} width={50} height={50} src='/iconConfirm.svg' alt='Confirmar'></Image>
          </button>
        </>)}
      </div>
    </div>
  )


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;
    setFormInputs(values => ({...values, [name]: value}))
  }

  async function sendData(e: FormEvent) {




    fetch('localhost:3000/api/create_event', {
      method: 'POST',
      body: JSON.stringify({
        
      })
    })
  }
}