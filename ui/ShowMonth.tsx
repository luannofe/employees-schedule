'use client'

import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { frameContext} from './Frame'
import styles from './showmonth.module.scss'

export const showMonthRef = React.createRef<HTMLDivElement>()

export default function ShowMonth() {


    const currentView = useContext(frameContext)?.choosenViewContext.state

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (currentView !== 'Calendar') {
            return setIsVisible(false)
        } else {
            return setIsVisible(true)
        }
    }, [currentView])


    return <div className={ isVisible? styles.innerContainerV : styles.innerContainerNV} >
            <span ref={showMonthRef} >a</span>
        </div>
  


}