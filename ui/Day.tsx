import { eventos } from '@prisma/client'
import { useInView } from 'framer-motion'
import style from './day.module.scss'
import Event from './Event'
import { frameContext, frontEndEventos } from './Frame'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { calendarRef as cf } from './Calendar';
import { showMonthRef as sf } from './ShowMonth'

export default function Day(props: { events: frontEndEventos[], day: string, thisRef: React.RefObject<HTMLDivElement> }) {

    let processedDate = dateProcess(props.day)

    const { thisRef } = props

    const calendarRef = useRef(cf)
    const showMonthRef = useRef(sf).current.current

    const isInView = useInView(thisRef, {
        root: calendarRef.current,
        margin: '-320px 0px -320px 0px'
    })


    const eventsContext = useContext(frameContext)?.eventsContext
    const zoomContext = useContext(frameContext)?.zoomContext

    const colors = ['#BFD7D9', '#d9bfbf', '#d7bfd9', '#c2d9bf', '#d9bfd3', '#bfc0d9', '#d8d9bf', '#BFD7D9', '#d9bfbf', '#d7bfd9', '#c2d9bf', '#d9bfd3', '#bfc0d9', '#d8d9bf']
    const thisMonth = new Date(props.day).toLocaleString('default', { month: 'long' }).toUpperCase()
    const thisDay = new Date(props.day).getDate()

    useEffect(() => {

        return startScroll()

    }, [])

    useEffect(()=> {
        checkIfRepeated()
    }, [eventsContext?.state, zoomContext?.state])

    useEffect(() => {

        if (isInView  && showMonthRef &&  showMonthRef.innerText != thisMonth) {
            showMonthRef.innerText = thisMonth
            //showMonthRef.style.webkitTextStroke = `1px ${colors[new Date(props.day).getMonth()]}`
        }

    }, [isInView])

    return (
        <div className={style.day} ref={thisRef}

            style={{

                color: isPastToday() ? 'rgb(160,160,160)' : 'black',
                borderRadius: '4px',

            }} onDrop={(e) => { onDropHandler(e) }} onDragOver={(e) => { onDragOver(e) }}>

            {thisDay < 5 &&
        
                <div style={{
                    height: 3,
                    minWidth: '197px',
                    backgroundColor: colors[new Date(props.day).getMonth()],
                    opacity: 1 - (0.25 * (thisDay - 1)),
                    position: 'absolute',
                    top: -25,
                    left: -12
                }}></div>

            }

            <span className={style.title}>{processedDate.day}</span>

            <span className={style.subTitle}>{processedDate.weekDay}</span>

            <div style={{ minHeight: zoomContext?.state? '' : '650px', minWidth: '170px' }}>
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
            while (i < props.events.length) {
                if (props.events[i].id == propsData.id) {
                    return
                }
                i++
            }
        }


        if (e.ctrlKey) {

            return fetch('/api/create_event', {
                method: 'POST',
                body: JSON.stringify({
                    ...Object.fromEntries(Object.entries(propsData).filter((e) => e[0] != 'id')),
                    dataEvento: [props.day]
                } as frontEndEventos)
            })

                .then(res => {
                    if (res.ok) {

                        return res.json()

                    }

                    throw new Error('Houve um erro ao editar, caso persista, contate o suporte.')
                })

                .then( data => {
                    console.log(data)
                    return eventsContext?.setState((eventosArray) => {
                        return eventosArray?.map(item => {
                            if (item.dia == props.day) {
                                return {
                                    ...item,
                                    eventos: [...item.eventos, {
                                        ...propsData,
                                        dataEvento: props.day,
                                        thisRef: React.createRef<HTMLDivElement>(),
                                        id: data.writedEvents[0].registeredEvent.id
                                    }]
                                }
                            }
                            return item
                        })
                    })
                })

                .catch(err => {
                    alert(err)
                })
        }


        return fetch('/api/create_event', {
            method: 'POST',
            body: JSON.stringify({
                ...propsData,
                dataEvento: [props.day]
            })
        })

            .then(res => {
                if (res.ok) {

                    return res.json()

                }

                throw new Error('Houve um erro ao editar, caso persista, contate o suporte.')
            })

            .then( data => {

                console.log(data)

                return eventsContext?.setState((eventosArray) => {
                    return eventosArray?.map(item => {
                        if (item.dia == props.day) {
                            return {
                                ...item,
                                eventos: [...item.eventos, {
                                    ...propsData,
                                    dataEvento: props.day,
                                    thisRef: React.createRef<HTMLDivElement>(),
                                    id: data.writedEvents[0].registeredEvent.id
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



            })

            .catch(err => {
                alert(err)
            })


    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {

        if (new Date(props.day).getTime() < new Date(new Date().setHours(-1, 0, 0, 0)).getTime()) {
            return
        }

        if (e.dataTransfer.types[0] != 'text/plain' || e.dataTransfer.types.length != 1) {
            return
        }
        e.preventDefault()
    }

    function startScroll() {

        if (props.day == new Date(new Date().setHours(0, 0, 0, 0)).toString().slice(0, 15)) {

            if (!calendarRef || !thisRef.current || sessionStorage.getItem('initialScroll') == 'true') {
                return
            }

            thisRef.current.scrollIntoView({
                behavior: 'smooth'
            })

            setTimeout(() => sessionStorage.setItem('initialScroll', 'true'), 200)

        }
    }

    function isPastToday() {
        return new Date(props.day + ' 00:00:00').getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    }

    function checkIfRepeated() {

        const events = props.events
        const propertyName = ['funcionarios', 'veiculo']

        propertyName.forEach( property => {
            checkInEvents(property as 'funcionarios' | 'veiculo')
        })


        function checkInEvents(propertyName: 'funcionarios' | 'veiculo') {

            events.map((event, i) => {

                if (!event[propertyName]) {
                    return
                }
    
                const property = String(event[propertyName]).split(',').filter(s => s != '')
    
                property.map( (item) => {
    
                    if (events.filter((evt) => {
    
                        if (evt.id == event.id) {
                            return false
                        }
    
                        if (!evt[propertyName]) {
                            return false
                        }
    
                        const evtProperty = String(evt[propertyName]).split(',').filter(s => s != '').filter( (f, i) => f == item)
                        console.log(`evtproperty is [${evtProperty}] and is ${evtProperty.length > 0}`)
                        return evtProperty.length > 0
    
                    }).length > 0) {
                        //if repeated then:

                        const eventUl = document.getElementById(`${event.id}_employees_div`)
                        const eventVehicles = document.getElementById(`${event.id}_vehicles_div`)

                        if (eventUl && eventVehicles) {
                            eventUl.style.color = 'red'
                            eventVehicles.style.color = 'red'
                        }


                    } else {

                        const eventUl = document.getElementById(`${event.id}_employees_div`)
                        const eventVehicles = document.getElementById(`${event.id}_vehicles_div`)

                        const isPast = new Date(event.dataEvento + ' 00:00:00').getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()
                        const color = isPast? 'rgb(160,160,160)' : 'black'


                        if (eventUl && eventVehicles) {
                            eventUl.style.color = color
                            eventVehicles.style.color = color
                        }
                    }
    
                })
    
            })
        }

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
