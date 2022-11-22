'use client';

import iconPersonWorker from '../public/iconPersonWorker.svg'
import iconVehicle from '../public/iconVehicle.svg'
import Image from 'next/image';
import style from './event.module.scss'

import React, { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { frameContext, frontEndEventos } from './Frame';
import { eventos } from '@prisma/client';

export default function (props: { event: frontEndEventos }) {

    const selectionContext = useContext(frameContext)?.eventSelectionContext
    const [styles, setStyles] = useState({})

    let employeesArr = String(props.event?.funcionarios).split(',') 

    
    useEffect(() => {

        if (selectionContext?.state.eventData?.id != props.event.id) {
            return setStyles({}) 
        } 

        return setStyles({
            outline: '3px solid grey'
        })

    }, [selectionContext?.state])

    return (
        <div className={style.eventDiv} style={styles} onClick={() => {selectEvent()}}>
            <div className={style.eventID}>
                <span>{props.event?.diaOrdem}</span>
            </div>
            <span className={style.eventTitle}>{props.event?.titulo}</span>
            <span className={style.eventDesc}>{props.event?.desc}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={style.eventCoord}>
                    <Image style={{ marginRight: '6px' }} src={iconPersonWorker} alt='icone de pessoa'></Image>
                    {props.event?.responsavel}
                </span>
                <span className={style.eventCoord}>
                    <Image style={{ marginRight: '6px' }} src={iconVehicle} alt='icone de veículo'></Image>
                    {props.event?.veiculo}
                </span>
            </div>
            <div className={style.eventUL}>
                {employeesArr.map((item) => {
                    return <li>
                        <span className={style.eventDesc}>{item}</span>
                    </li>
                })}
            </div>
        </div>
    )

    function selectEvent() {


        selectionContext?.setState({
            selected: true,
            eventData: {
                ...props.event,
                funcionarios: props.event.funcionarios,
                dataEvento: new Date(props.event.dataEvento).toISOString().slice(0, 10)
            }
        })

    }
}