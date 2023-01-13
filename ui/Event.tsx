'use client';

import iconPersonWorker from '../public/iconPersonWorker.svg'
import iconVehicle from '../public/iconVehicle.svg'
import iconHoliday from '../public/iconHoliday.svg'
import iconHealth from '../public/iconHealth.svg'
import Image from 'next/image';
import style from './event.module.scss'

import React, { useContext, useEffect, useRef, useState } from 'react';
import { frameContext, frontEndEventos } from './Frame';
import { calendarRef as cref } from './Calendar';



export default function (props: { event: frontEndEventos, repeated?: string[] }) {

    const selectionContext = useContext(frameContext)?.eventSelectionContext
    const choosenView = useContext(frameContext)?.choosenViewContext
    const addEventFormData = useContext(frameContext)?.formContext
    const zoomContext = useContext(frameContext)?.zoomContext
    const isAdmin = useContext(frameContext)?.adminContext.state
    const calendarRef = useRef(cref)

    const [styles, setStyles] = useState({})

    let typeStyles: React.CSSProperties = {}

    const typeIcons = [iconHoliday, iconHealth]

    switch (props.event.type) {
        case 0:
            typeStyles = {
                backgroundColor: props.event.propColor,
                height: 'fit-content'
            }
            break;
        case 1:
            typeStyles = {
                backgroundColor: props.event.propColor,
                color: 'white',
                borderRadius: 6,
                minHeight: zoomContext?.state? '0px' : '120px'

            }
            break;
        case 2:
            typeStyles = {
                backgroundColor: props.event.propColor,
                color: 'white',
                borderRadius: 6,
                minHeight: zoomContext?.state? '0px' : '120px'
            }
    }


    const employeesArr = String(props.event?.funcionarios).split(',').filter(i => i != '')
    const vehiclesArr = String(props.event?.veiculo).split(',')


    useEffect(() => {


    }, [])


    useEffect(() => {

        const imSelected = selectionContext?.state.eventData?.id == props.event.id


        if (imSelected && choosenView?.state == 'Calendar') {

            return setStyles({
                outline: '3px solid rgb(213, 213, 213)',
            })

        } else {

            return setStyles({})

        }


    }, [selectionContext?.state])

    return (
        <div className={style.eventDiv} draggable={isAdmin} ref={props.event.thisRef} onDragStart={(e) => { dragStart(e) }} style={{
            ...styles,
            ...typeStyles
        }} onClick={() => { selectEvent() }} onDoubleClick={() => { handleDoubleClick() }}>
            <div className={style.eventID} style={{
                width: !props.event.type? 80 : 40
            }}>
                {!props.event.type? 
                    <span>{props.event?.proposta}</span>
                    :
                    <Image src={typeIcons[props.event.type - 1]} width={20} height={20} alt=''/>
                }
            </div>
            <span className={style.eventTitle}>{props.event?.titulo}</span>

            {!zoomContext?.state || choosenView?.state != 'Calendar' ?

                (<>
                    {!props.event.type ? 

                    (<>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className={style.eventCoord}>
                                <Image style={{ marginRight: '6px' }} src={iconPersonWorker} alt='icone de pessoa'></Image>
                                {props.event?.responsavel}
                            </span>
                            {vehiclesArr.map((item) => {
                                return <span className={style.eventCoord} key={`${props.event.id} ${item}`} id={`${props.event.id}_vehicles_div`}>
                                    <Image style={{ marginRight: '6px' }} src={iconVehicle} alt='icone de veículo'></Image>
                                    {item}
                                </span>
                            })}
                        </div>
                        <span className={style.eventDesc}>{props.event?.desc}</span>
                    </>) : <></>}

                    {employeesArr.length > 0 &&
                        <div className={style.eventUL} id={`${props.event.id}_employees_div`}>
                            {employeesArr.map((item) => {
                                return <li key={`${props.event.id} ${item}`} id={`${props.event.id}_employees_div_${item}`}>
                                    <span className={style.eventDesc} id={`${props.event.id}${item}`}>{item}</span>
                                </li>
                            })}
                        </div>
                    }

                </>)

                :

                    !props.event.type?  

                        (<span className={style.eventCoord}>
                            <Image style={{ marginRight: '6px' }} src={iconPersonWorker} alt='icone de pessoa'></Image>
                            {props.event?.responsavel}
                        </span>)

                    : ''

            }
        </div>
    )

    function selectEvent() {


        if (choosenView?.state != 'Calendar') {
            return
        }

        console.log('SELECTED EVENT:')
        console.log(props)
        console.log(`SENDED DATE ${new Date(props.event.dataEvento as string).toISOString().slice(0, 10)}`)

        selectionContext?.setState({
            selected: true,
            eventData: {
                ...props.event,
                funcionarios: props.event.funcionarios,
                dataEvento: new Date(props.event.dataEvento as string).toISOString().slice(0, 10)
            }
        })

    }

    function handleDoubleClick() {

        if (!isAdmin) {
            return
        }

        console.log(props)

        if (selectionContext?.state.eventData) {

            addEventFormData?.insertFormInputs({
                ...selectionContext.state.eventData
            })
        }

        choosenView?.setState('EditEvent')

    }

    function dragStart(e: React.DragEvent<HTMLDivElement>) {
        e.dataTransfer.clearData()
        e.dataTransfer.setData("text/plain", JSON.stringify(Object.assign({}, { ...props.event, thisRef: undefined })))
    }




}