'use client'

import Image from "next/image"
import styles from './navbar.module.scss'
import { useRouter } from 'next/navigation'
import { METHODS } from "http"
import { databaseEventInterface } from "../pages/api/calendar"
import React, { ChangeEvent, FormEvent, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { frameContext, frontEndCalendarEventos, frontEndEventos } from "./Frame"
import { eventos } from "@prisma/client"
import { apiCreateEventResponse } from "../pages/api/create_event"

export default function NavbarBot(props: {
  setChoosenView: React.SetStateAction<any>,
  choosenView: string
}) {

  const addEventFormData = useContext(frameContext)?.formContext
  const selectionContext = useContext(frameContext)?.eventSelectionContext
  const eventsContext = useContext(frameContext)?.eventsContext
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
      body: JSON.stringify(formdata.processedForm)
    })

    .then( res => {
      if (res.ok) {
        return res.json() 
      }

      throw new Error('Houve um erro ao criar os dados, caso persista, contate o suporte.')
    })

    .then( (data: any) => {

      console.log(data.writedEvents)

      if (props.choosenView == 'EditEvent') {
        
        let writedEvent = data.writedEvents[0].registeredEvent

        eventsContext?.setState( (previousState) => {
          return previousState?.map( (item) => {
            if (item.dia == writedEvent?.dataEvento) {
              return {
                ...item,
                eventos: item.eventos.map( (evento) => {
                  if (evento.id == writedEvent?.id) {
                    return writedEvent as frontEndEventos
                  }
                  return evento as frontEndEventos
                } )
              }
            }
            return item
          }) as frontEndCalendarEventos[]
        })
        
      } 

      if (props.choosenView == 'AddEvent') {

        console.log(data)

        for (let writedEvent of data.writedEvents) {

          eventsContext?.setState((prev) => {

            return prev?.map(item => {

              if (item.dia == writedEvent.registeredEvent?.dataEvento) {

                console.log(writedEvent.registeredEvent)
                console.log(`WILL DE ADD TO`)
                console.log(item)

                return {
                  ...item,
                  eventos: [...item.eventos, writedEvent.registeredEvent]
                }
              }
              return item
            })

          })
          console.log(`ADDED`)
        }

      }

    
      
      addEventFormData?.insertFormInputs({
        titulo: '',
        dataEvento: '',
        veiculo: '',
        responsavel: '',
        desc: '',
        funcionarios: [],
        propColor: '#BFD7D9',
        proposta: ''
      })
      
      addEventFormData?.formRef.current?.reset()
  
      setTimeout(() => {
      setConfirmButtonState({
        activated: true,
        styles: styles.button
      })}, 800)
      
    })

    .catch( (error) => alert(error) )



  }

  async function validateForm() {


    let formdata = addEventFormData?.formInputs


    let  processedForm = {
      dataEvento: formdata!.dataEvento,
      titulo: formdata!.titulo,
      desc: formdata!.desc,
      responsavel: formdata!.responsavel,
      funcionarios: formdata!.funcionarios,
      veiculo: formdata!.veiculo,
      propColor: formdata?.propColor,
      proposta: formdata!.proposta
    }
    
    return new Promise<{passed: boolean, processedForm?: frontEndEventos}>((resolve, reject) => {

      let processedFormArr = Object.entries(processedForm)

      let i = 1

      for (let item of processedFormArr) {

        if (item[1] == undefined || item[1].length < 1) {

          if (item[0] != 'desc' && item[0] != 'funcionarios') {
            console.log(`missing item ${item[0]}, received ${item[1]}`)
            resolve({passed: false})
          } else if (item[0] == 'desc') {
              processedForm.desc = 'Sem descrição.'
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
        id: selectionContext.state.eventData.id,
        propColor: selectionContext.state.eventData.propColor,
        proposta: selectionContext.state.eventData.proposta
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
      funcionarios: [],
      propColor: '#BFD7D9',
      proposta: ''
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

        .then(res => {
          if (res.ok) {
            return res.json()
          }

          throw new Error('Houve um erro ao executar a solicitação. Reinicie a página e caso continue, contate o suporte.')
        })

        .then( (data: {id: Number, dataEvento: String}) => {
          eventsContext?.setState( (prev) => {

            return prev?.map( item => {

              if (item.dia == data.dataEvento) {
                return {
                  ...item,
                  eventos: item.eventos.filter((item) => item.id != data.id)
                }
              }

              return item
            })
          })
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
    console.log(eventsContext?.state)    
    props.setChoosenView('Calendar')

  }
}


export function MotionButton({children}: {children: React.ReactNode}) {
  return <motion.div animate={{ scale: [0, 1.05, 1]} }>
    {children}
  </motion.div>
}