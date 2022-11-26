'use client'
import { useContext, useEffect, useRef, useState } from 'react'
import { frameContext, viewPortContext } from './Frame'
import styles from './showmonth.module.scss'

export default function ShowMonth() {

    //TODO: make div disappear after a while

    const currentMonth = useContext(viewPortContext)?.state
    const currentView = useContext(frameContext)?.choosenViewContext.state

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (currentView !== 'Calendar') {
            return setIsVisible(false)
        } else {
            return setIsVisible(true)
        }
    }, [currentView])


    return <div className={styles.container} >
        <div className={ isVisible? styles.innerContainerV : styles.innerContainerNV} >
            <span>{currentMonth}</span>
        </div>
    </div>


}