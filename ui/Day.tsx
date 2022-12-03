import { eventos } from '@prisma/client'
import { useInView } from 'framer-motion'
import style from './day.module.scss'
import Event from './Event'
import { frameContext, frontEndEventos } from './Frame'
import React, {  useContext, useEffect, useRef, useState } from 'react';
import { calendarRef as cf } from './Calendar';
import { showMonthRef as sf } from './ShowMonth'

export default function Day(props: {events: frontEndEventos[], day: string, thisRef: React.RefObject<HTMLDivElement>}) {

    let processedDate = dateProcess(props.day)

    const {thisRef} = props

    const calendarRef = useRef(cf)
    const showMonthRef = useRef(sf).current.current

    const isInView = useInView(thisRef)

    const eventsContext = useContext(frameContext)?.eventsContext
    
    const thisMonth = new Date(props.day).toLocaleString('default', {month: 'long'}).toUpperCase()
    
    useEffect(() => {

        return startScroll()

    }, [])

    useEffect(() => {

        if ( isInView && showMonthRef && showMonthRef.innerText != thisMonth) {
            showMonthRef.innerText = thisMonth
        }

    }, [isInView])
    
    return (
        <div className={style.day} ref={thisRef}

            style={{

                color: isPastToday() ? 'rgb(160,160,160)' : 'black',
                borderRadius: '4px',

            }}  onDrop={(e) => { onDropHandler(e) }} onDragOver={(e) => { onDragOver(e) }}>

                <span className={style.title}>{processedDate.day}</span>

                <span className={style.subTitle}>{processedDate.weekDay}</span>

                <div style={{ minHeight: '650px', minWidth: '170px' }}>
                    {props.events?.map((event) => {
                        return <Event event={event} key={`asdasdasd${event.id}`} />
                    })}
                </div>
        </div>
    )


    async function onDropHandler(e: React.DragEvent<HTMLDivElement>) {

        let propsData = JSON.parse(e.dataTransfer.getData('text/plain')) as frontEndEventos
        
        if (propsData.dataEvento == props.day) {
            let i = 0
            while(i < props.events.length) {
                if (props.events[i].id == propsData.id) {
                    return
                }
                i++
            }
        }

        fetch('/api/create_event', {
            method: 'POST',
            body: JSON.stringify({
                ...propsData,
                dataEvento: [props.day]
            }) 
        })

            .then(res => {
                if (res.ok) {

                    return eventsContext?.setState( (eventosArray) => {
                        return eventosArray?.map( item => {
                            if (item.dia == props.day) {
                                return {
                                    ...item,
                                    eventos : [...item.eventos, {
                                        ...propsData,
                                        dataEvento: props.day
                                    }]
                                }
                            }
                            if (item.dia == propsData.dataEvento) {
                                return {
                                    ...item,
                                    eventos: item.eventos.filter((item) => item.id != propsData.id)
                                }
                            }
                            return item
                        })
                    })

                }

                throw new Error('Houve um erro ao editar, caso persista, contate o suporte.')
            })

            .catch(err => {
                alert(err)
            }) 


    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {

        if (new Date(props.day).getTime() < new Date(new Date().setHours(-1,0,0,0)).getTime()) {
            return
        }

        if (e.dataTransfer.types[0] != 'text/plain' || e.dataTransfer.types.length != 1 )
        {
            return
        }
        e.preventDefault()
    }

    function startScroll() {

        if (props.day == new Date(new Date().setHours(0,0,0,0)).toString().slice(0,15)) {

            if (!calendarRef || !thisRef.current || sessionStorage.getItem('initialScroll') == 'true'){
                return
            }
            
            thisRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })

            setTimeout(() => sessionStorage.setItem('initialScroll', 'true'), 200)
            
        }
    }

    function isPastToday() {
        return new Date(props.day + ' 00:00:00').getTime() < new Date(new Date().setHours(0,0,0,0)).getTime()
    }

}

function dateProcess(date: string) {

    let thisDate = new Date(date)
    let weekDaysPTBR = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

    return {
        day: thisDate.getDate(), 
        weekDay: weekDaysPTBR[thisDate.getDay()]
    }
}