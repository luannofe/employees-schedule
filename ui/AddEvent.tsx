'use client'

import styles from './addevent.module.scss'
import iconPersonWorker from '../public/iconPersonWorker.svg'
import iconVehicle from '../public/iconVehicle.svg'
import Image from 'next/image'
import SelectInput from './components/SelectInput'
import { useState } from 'react'

export default function AddEvent() {

    const [inputInsertedValues, setInputInsertedValues] = useState<string[]>([])

    return  (
            <div className={styles.addEventContainer}>
                    
                    <div className={styles.addEventDiv}>
                        <form action="post">
                            <span className={styles.addEventTitle}>Inserir evento...</span>
                            <div style={{display: 'flex', width: '95%', justifyContent: 'space-around'}}> 
                                <label htmlFor="" style={{flex: 1}}>
                                    <input className={styles.inputBase}  name="title" type="text" placeholder='Titulo'/>
                                </label>
                                <label htmlFor="" style={{width: '150px', height: '100%', justifyContent: 'flex-end'}}>
                                    <input className={styles.inputBase} style={{width:'110px', paddingLeft: '8px'}} name="eventDate" type="date" placeholder='Data do evento'/>
                                </label>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', gap:'64px', width: '95%'}}>
                                <label htmlFor="">
                                    <Image className={styles.inputIcon} src={iconPersonWorker} alt=''/>
                                    <input className={styles.inputBase} name="resp" type="text" placeholder='Supervisor' />
                                </label>
                                <label htmlFor="">
                                    <Image className={styles.inputIcon} src={iconVehicle} alt=''/>
                                    <input className={styles.inputBase} name="car" type="text" placeholder='Carro' />
                                </label>
                            </div>
                            <label htmlFor="">
                                <textarea className={styles.inputBase} style={{width: '100%', resize:'none'}} name="desc" maxLength={260} rows={4} placeholder='Descrição do evento (max: 280 carácteres.)' />
                            </label>
                            <span className={styles.addEventTitle} style={{fontSize: '22px'}}>Colaboradores:</span>
                            <label htmlFor="">                           
                                <SelectInput insertedValues={inputInsertedValues} setInsertedValues={setInputInsertedValues}/>
                            </label>
                        </form>
                    </div>

            </div>
        )
}
  