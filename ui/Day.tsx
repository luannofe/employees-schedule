import { eventos } from '@prisma/client'
import { useInView } from 'framer-motion'
import { useContext, useEffect, useRef } from 'react'
import style from './day.module.scss'
import Event from './Event'
import { frameContext, frontEndEventos, viewPortContext } from './Frame'

export default function Day(props: {events: frontEndEventos[], day: string}) {

    let processedDate = dateProcess(props.day)

    const ref = useRef(null)

    const isInView = useInView(ref)

    const inViewContext = useContext(viewPortContext)
    const eventsContext = useContext(frameContext)?.eventsContext

    const thisMonth = new Date(props.day).toLocaleString('default', {month: 'long'})
    

    useEffect(() => {
        if (isInView && inViewContext?.state !== thisMonth) {
            inViewContext?.setState(thisMonth.toUpperCase())
        }
    }, [isInView])
    
    return (
        <div className={style.day} ref={ref} onDrop={(e) => {onDropHandler(e)}}  onDragOver={(e) => {onDragOver(e)}}>
            <span className={style.title}>{processedDate.day}</span>
            <span className={style.subTitle}>{processedDate.weekDay}</span>
            <div style={{minHeight: '650px', minWidth: '170px'}}>
                {props.events?.map((event) => {
                    return <Event event={event} key={`asdasdasd${event.id}`}/>
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



}

function dateProcess(date: string) {

    let thisDate = new Date(date)
    let weekDaysPTBR = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

    return {
        day: thisDate.getDate(), 
        weekDay: weekDaysPTBR[thisDate.getDay()]
    }
}