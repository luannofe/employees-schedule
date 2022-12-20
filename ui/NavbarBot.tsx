'use client'

import Image from "next/image"
import styles from './navbar.module.scss'
import React, {  FormEvent, useContext, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { frameContext, frontEndEventos } from "./Frame"
import Searchbutton from "./components/SearchButton"
import { write } from "fs"


export default function NavbarBot(props: {
  setChoosenView: React.SetStateAction<any>,
  choosenView: string
}) {

  const addEventFormData = useContext(frameContext)?.formContext
  const selectionContext = useContext(frameContext)?.eventSelectionContext
  const eventsContext = useContext(frameContext)?.eventsContext

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


      {props.choosenView == 'Calendar' && <Searchbutton/>}

      <div className={styles.buttonsContainer}>
        {props.choosenView == 'Calendar' && (<>
          <motion.button className={styles.button} onClick={() => { addButton() }} animate={{ scale: [0, 1.05, 1] }}>
            <Image className={styles.icons} width={50} height={50} src='/iconPlus.svg' alt='Cadastrar'></Image>
          </motion.button>
          <motion.button className={editButtonState.styles} onClick={() => { editButton() }}animate={{ scale: [0, 1.05, 1] }} >
            <Image className={styles.icons} width={50} height={50} src='/iconEdit.svg' alt='Editar'></Image>
          </motion.button>
          <motion.button animate={{ scale: [0, 1.05, 1] }} className={deleteButtonState.styles} onClick={() => { deleteButton() }} >
            <Image className={styles.icons} width={50} height={50} src='/iconX.svg' alt='Apagar'></Image>
          </motion.button>

        </>)}
        {(props.choosenView == 'AddEvent' || props.choosenView == 'EditEvent') && (<>
          <motion.button className={styles.buttonDelete} onClick={() => { undoButton() }} animate={{ scale: [0, 1.05, 1] }}>
            <Image className={styles.icons} width={50} height={50} src='/iconUndo.svg' alt='Voltar'></Image>
          </motion.button>
          <motion.button className={confirmButtonState.styles}  animate={{ scale: [0, 1.05, 1] }}>
            <Image className={styles.icons} onClick={(e) => { sendData(e) }} width={50} height={50} src='/iconConfirm.svg' alt='Confirmar'></Image>
          </motion.button>
        </>)}
      </div>


      {props.choosenView == 'Calendar' && (<>
        <motion.button className={styles.buttonRefresh} onClick={() => { refreshButton() }} animate={{ scale: [0, 1.05, 1] }} >
          <Image className={styles.icons} width={40} height={40} src='/iconRefresh.svg' alt='Recarregar'></Image>
        </motion.button>
      </>)}

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
        let previousDate = new Date(selectionContext?.state.eventData?.dataEvento + ' 00:00:00').toString().slice(0,15)
        let writedEvent = data.writedEvents[0].registeredEvent
        const isPastPreviousDate = (new Date(writedEvent.dataEvento).getTime() > new Date(previousDate).getTime())

        const arrWithNewEvent = eventsContext!.state!.map( item => {

          if (isPastPreviousDate) {

            if (item.dia == writedEvent.dataEvento) {
              return {
                ...item,
                eventos: [...item.eventos, {...writedEvent}]
              }
            }

            if (item.dia == previousDate) {
              return {
                ...item,
                eventos: item.eventos.filter( (ev) => ev.id != writedEvent.id)
              }
            }

          } else {

            if (previousDate == writedEvent.dataEvento && item.dia == writedEvent.dataEvento) {

              return {

                ...item,
                eventos: item.eventos.map((ev) => {

                  if (ev.id == writedEvent.id) {

                    return {...writedEvent}

                  } 

                  return ev
                })
              }

            } 

            if (previousDate != writedEvent.dataEvento) {

              if (item.dia == previousDate) {
                return {
                  ...item,
                  eventos: item.eventos.filter( (ev) => ev.id != writedEvent.id)
                }
              }

              if (item.dia == writedEvent.dataEvento) {
                return {
                  ...item,
                  eventos: [...item.eventos, {...writedEvent}]
                }
              }

            }

            

          }


          return item
        })

        eventsContext?.setState(arrWithNewEvent)

        



        
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
                  eventos: [...item.eventos, {
                    ...writedEvent.registeredEvent,
                    thisRef: React.createRef()
                  }]
                }
              }
              return item
            })

          })
        }

      }

    
      props.setChoosenView('Calendar')
      selectionContext?.setState({selected: false})
      
      addEventFormData?.insertFormInputs((prev) => { 

        return {

          ...prev,
          titulo: '',
          dataEvento: '',
          veiculo: [],
          responsavel: '',
          desc: '',
          funcionarios: [],
          propColor: '#BFD7D9',
          proposta: '',

        }
      })
      
      addEventFormData?.formRef.current?.reset()
  
      return setTimeout(() => {
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
    
    return new Promise<{passed: boolean, processedForm?: {}}>((resolve, reject) => {

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
        ...selectionContext.state.eventData,
        veiculo: String(selectionContext.state.eventData.veiculo).split(',').filter( i => i != ''),
        funcionarios: String(selectionContext.state.eventData.funcionarios).split(',').filter( i => i != '')
      })
    }
  

    return props.setChoosenView('EditEvent')
  }

  async function addButton() {

    addEventFormData?.insertFormInputs({
      titulo: '',
      dataEvento: '',
      veiculo: [],
      responsavel: '',
      desc: '',
      funcionarios: [],
      propColor: '#BFD7D9',
      proposta: '',
      thisRef: React.createRef<HTMLDivElement>()
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

  async function refreshButton() {
    props.setChoosenView('Update')
  }
}
