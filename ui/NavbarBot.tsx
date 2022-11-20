'use client'

import Image from "next/image"
import styles from './navbar.module.scss'
import { useRouter } from 'next/navigation'
import { METHODS } from "http"
import { databaseEventInterface } from "../pages/api/calendar"
import React, { ChangeEvent, FormEvent, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { frameContext } from "./Frame"

export default function NavbarBot(props: {
  setChoosenView: React.SetStateAction<any>,
  choosenView: string
}) {

  const addEventFormData = useContext(frameContext)?.formContext
  const selectionContext = useContext(frameContext)?.eventSelectionContext
  const router = useRouter()

  const [confirmButtonState, setConfirmButtonState] = useState(
    {
      activated: true,
      styles: styles.button
    }
  )

  const [editButtonState, setEditButtonState] = useState(
    {
      activated: false,
      styles: styles.deactivatedButton
    }
  )

  const [deleteButtonState, setDeleteButtonState] = useState(
    {
      activated: false,
      clickedOnce: false,
      styles: styles.deactivatedButton,

    }
  )

  useEffect(() => {

    if (selectionContext?.state.selected) {
      setEditButtonState({
        activated: true,
        styles: styles.button
      })

      return setDeleteButtonState({
        activated: true,
        clickedOnce: false,
        styles: styles.buttonDelete
      })
    }

    setDeleteButtonState({
      activated: false,
      clickedOnce: false,
      styles: styles.deactivatedButton
    }) 


    return setEditButtonState({
      activated: false,
      styles: styles.deactivatedButton
    })

  }, [selectionContext?.state])



  return (
    
    <div className={styles.navbarBot} >
      <div className={styles.buttonsContainer}>
        {props.choosenView == 'Calendar' && (<>
          <MotionButton>
            <button className={styles.button}  onClick={() => { addButton() }}>
              
              <Image className={styles.icons} width={50} height={50} src='/iconPlus.svg' alt='Cadastrar'></Image>
            </button>
          </MotionButton>
          <MotionButton>
          <button className={editButtonState.styles} onClick={() => {editButton()}} >
            <Image className={styles.icons} width={50} height={50} src='/iconEdit.svg' alt='Editar'></Image>
          </button>
          </MotionButton>
          <MotionButton>
          <button className={deleteButtonState.styles} onClick={() => {deleteButton()}}>
            <Image className={styles.icons} width={50} height={50} src='/iconX.svg' alt='Apagar'></Image>
          </button>
          </MotionButton>
        </>)}
        {(props.choosenView == 'AddEvent' || props.choosenView == 'EditEvent') && (<>
          <MotionButton>
          <button className={styles.buttonDelete} onClick={() => {undoButton()}}>
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

    fetch('/api/create_event', {
      method: 'POST',
      body: JSON.stringify({
        dataEvento: formdata.processedForm!.dataEvento,
        titulo: formdata.processedForm!.titulo,
        desc: formdata.processedForm!.desc,
        responsavel: formdata.processedForm!.responsavel,
        veiculo: formdata.processedForm!.veiculo,
        funcionarios: formdata.processedForm!.funcionarios,
        id: formdata.processedForm?.id
      })
    })
    .then( res => res.json())
    .then(data => {

      if (props.choosenView == 'EditEvent') {
        router.refresh()
        props.setChoosenView('Calendar')
      }
  
      addEventFormData?.insertFormInputs({
        titulo: '',
        dataEvento: '',
        veiculo: '',
        responsavel: '',
        desc: '',
        funcionarios: []
      })

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
      veiculo: formdata!.veiculo,
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
            resolve({passed: true, processedForm: {
              ...processedForm,
              id: formdata?.id
            }})
          }
        }

        if (i == processedFormArr.length) {
          resolve({passed: true, processedForm: {
            ...processedForm,
            id: formdata?.id
          }})
        }
        i ++
      }
    })

  }

  async function editButton() {

    if (!editButtonState.activated) {
      return
    }

    if (selectionContext?.state.eventData) {
      addEventFormData?.insertFormInputs({
        titulo: selectionContext.state.eventData.titulo,
        responsavel: selectionContext.state.eventData.responsavel,
        dataEvento: selectionContext.state.eventData.dataEvento,
        veiculo: selectionContext.state.eventData.veiculo,
        funcionarios: selectionContext.state.eventData?.funcionarios,
        desc: selectionContext.state.eventData?.desc,
        id: selectionContext.state.eventData.id
      })
    }
  

    return props.setChoosenView('EditEvent')
  }

  async function addButton() {

    addEventFormData?.insertFormInputs({
      titulo: '',
      dataEvento: '',
      veiculo: '',
      responsavel: '',
      desc: '',
      funcionarios: []
    })
    props.setChoosenView('AddEvent')
  }

  async function deleteButton() {

    if (deleteButtonState.clickedOnce) {
      fetch('/api/delete_event', {
        method: 'POST',
        body: JSON.stringify({
          id: selectionContext?.state.eventData?.id
        })
      })
      .then(res => res.json())
      .then(data => {
        selectionContext?.setState({selected: false})
        router.refresh()
      })
    } else {
      setDeleteButtonState({
        activated: true,
        clickedOnce: true,
        styles: styles.buttonDelete,
      })
    }

  }

  async function undoButton() {
    selectionContext?.setState({selected: false})
    router.refresh()
    props.setChoosenView('Calendar')
  }
}


export function MotionButton({children}: {children: React.ReactNode}) {
  return <motion.div animate={{ scale: [0, 1.05, 1]} }>
    {children}
  </motion.div>
}