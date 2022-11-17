'use client'

import Image from "next/image"
import styles from './navbar.module.scss'
import { useRouter } from 'next/navigation'
import { METHODS } from "http"
import { databaseEventInterface } from "../pages/api/calendar"
import React, { ChangeEvent, FormEvent, PropsWithChildren, ReactNode, useContext, useState } from "react"
import { motion } from "framer-motion"
import { formContext } from "./Frame"

export default function NavbarBot(props: {
  setChoosenView: React.SetStateAction<any>,
  choosenView: string
}) {

  const addEventFormData = useContext(formContext)

  //update formdata, validate and send to api endpoint to post


  return (
    
    <div className={styles.navbarBot} >
      <div className={styles.buttonsContainer}>
        {props.choosenView == 'Calendar' && (<>
          <MotionButton>
            <button className={styles.button}  onClick={() => {
              props.setChoosenView('AddEvent')
            }}>
              
              <Image className={styles.icons} width={50} height={50} src='/iconPlus.svg' alt='Cadastrar'></Image>
            </button>
          </MotionButton>
          <MotionButton>
          <button className={styles.button} >
            <Image className={styles.icons} width={50} height={50} src='/iconEdit.svg' alt='Editar'></Image>
          </button>
          </MotionButton>
          <MotionButton>
          <button className={styles.buttonDelete}>
            <Image className={styles.icons} width={50} height={50} src='/iconX.svg' alt='Apagar'></Image>
          </button>
          </MotionButton>
        </>)}
        {props.choosenView == 'AddEvent' && (<>
          <MotionButton>
          <button className={styles.buttonDelete} onClick={() => {props.setChoosenView('Calendar')}}>
            <Image className={styles.icons} width={50} height={50} src='/iconUndo.svg' alt='Voltar'></Image>
          </button>
          </MotionButton>
          <MotionButton>
          <button className={styles.button} >
            <Image className={styles.icons} onClick={(e)=> {sendData(e)}} width={50} height={50} src='/iconConfirm.svg' alt='Confirmar'></Image>
          </button>
          </MotionButton>
        </>)}
      </div>
    </div>
  )



  async function sendData(e: FormEvent) {

    e.preventDefault()
    let formdata = addEventFormData?.formInputs
    console.log(formdata)

    fetch('http://localhost:3000/api/create_event', {
      method: 'POST',
      body: JSON.stringify({
        dataEvento: formdata?.dataEvento,
        titulo: formdata?.titulo,
        desc: formdata?.desc,
        responsavel: formdata?.responsavel,
        veiculo: formdata?.veiculo,
        colaboradores: formdata?.funcionarios
      })
    })
    .then( res => res.json())
    .then(data => console.log(data))
  }
}


export function MotionButton({children}: {children: React.ReactNode}) {
  return <motion.div animate={{ scale: [0, 1.05, 1]} }>
    {children}
  </motion.div>
}