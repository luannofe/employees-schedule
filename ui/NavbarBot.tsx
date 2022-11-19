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
  const [confirmButtonState, setConfirmButtonState] = useState(
    {
      activated: true,
      styles: styles.button
    }
  )

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
          <button className={confirmButtonState.styles}  >
            <Image className={styles.icons} onClick={(e)=> {sendData(e)}} width={50} height={50} src='/iconConfirm.svg' alt='Confirmar'></Image>
          </button>
          </MotionButton>
        </>)}
      </div>
    </div>
  )



  async function sendData(e: FormEvent) {

    if (!confirmButtonState.activated) {
      return
    }

    let formdata = await validateForm()

    if (!formdata.passed) {
      return alert('Preencha todos os campos necessários.')
    }

    setConfirmButtonState({
      activated: false,
      styles: styles.deactivatedButton
    })

    fetch('http://localhost:3000/api/create_event', {
      method: 'POST',
      body: JSON.stringify({
        dataEvento: formdata.processedForm!.dataEvento,
        titulo: formdata.processedForm!.titulo,
        desc: formdata.processedForm!.desc,
        responsavel: formdata.processedForm!.responsavel,
        veiculo: formdata.processedForm!.veiculo,
        colaboradores: formdata.processedForm!.funcionarios
      })
    })
    .then( res => res.json())
    .then(data => {
  

      setTimeout(() => {
      setConfirmButtonState({
        activated: true,
        styles: styles.button
      })}, 800)

    })
  }

  async function validateForm() {


    let formdata = addEventFormData?.formInputs

    console.log(formdata)

    let  processedForm = {
      dataEvento: formdata!.dataEvento,
      titulo: formdata!.titulo,
      desc: formdata!.desc,
      responsavel: formdata!.responsavel,
      funcionarios: formdata!.funcionarios,
      veiculo: formdata!.veiculo
    }
    
    return new Promise<{passed: boolean, processedForm?: databaseEventInterface}>((resolve, reject) => {

      let processedFormArr = Object.entries(processedForm)

      let i = 1

      for (let item of processedFormArr) {

        if (item[1] == undefined) {

          if (item[0] != 'desc') {
            console.log(`missing item ${item[0]}, received ${item[1]}`)
            resolve({passed: false})
          } else {
            processedForm.desc = 'Sem descrição.'
            resolve({passed: true, processedForm})
          }
        }

        if (i == processedFormArr.length) {
          resolve({passed: true, processedForm})
        }
        i ++
      }
    })

  }
}


export function MotionButton({children}: {children: React.ReactNode}) {
  return <motion.div animate={{ scale: [0, 1.05, 1]} }>
    {children}
  </motion.div>
}