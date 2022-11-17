'use client';

import iconPersonWorker from '../public/iconPersonWorker.svg'
import iconVehicle from '../public/iconVehicle.svg'
import Image from 'next/image';
import style from './event.module.scss'
import { databaseEventInterface } from '../pages/api/calendar';

export default function(props: {event: databaseEventInterface}) {
    
    return (
        <div className={style.eventDiv}>
            <div className={style.eventID}>
                <span>{props.event?.diaOrdem}</span>
            </div>
            <span className={style.eventTitle}>{props.event?.titulo}</span>
            <span className={style.eventDesc}>{props.event?.desc}</span>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <span className={style.eventCoord}>
                    <Image style={{marginRight: '6px'}} src={iconPersonWorker} alt='icone de pessoa'></Image>
                    {props.event?.responsavel}
                </span>
                <span className={style.eventCoord}>
                    <Image style={{marginRight: '6px'}} src={iconVehicle} alt='icone de veículo'></Image>
                    {props.event?.veiculo}
                </span>
            </div>
            <div className={style.eventUL}>
                    <li>
                        <span className={style.eventDesc}>Pessoa da Silva 1</span>
                    </li>
                    <li>
                        <span className={style.eventDesc}>Pessoa da Silva 1</span>
                    </li>
                    <li>
                        <span className={style.eventDesc}>Pessoa da Silva 1</span>
                    </li>
                    <li>
                        <span className={style.eventDesc}>Pessoa da Silva 1</span>
                    </li>              
            </div>
        </div>
    )
}