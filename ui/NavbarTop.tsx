'use client'

import styles from './navbartop.module.scss'
import ShowMonth from './ShowMonth'
import Image from "next/image"
import Toggle from 'react-toggle'
import "./toggle.scss"
import { useContext, useEffect } from 'react'
import { frameContext as fc } from './Frame'
import iconZoom from '../public/iconFullscreen.svg'


export default function NavbarTop() {

    const frameContext = useContext(fc)
    const isZoomed = frameContext?.zoomContext.state
    

    useEffect(()=> {
        if (frameContext?.eventSelectionContext.state.selected) {
            frameContext.eventSelectionContext.state.eventData?.thisRef.current?.scrollIntoView({
                block: 'center'
            })
        }
    }, [isZoomed])

    return (

        <>  
            <div className={styles.middleContainer}>

                <div style={{width: '200px', height: '100%'}}></div>

                <div style={{width: '200px', display: 'flex', justifyContent: 'center'}}>
                    <ShowMonth/>
                </div>
                
                <span style={{width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',  justifySelf: 'flex-end'}}>
                    <Toggle 

                        icons={false}

                        onChange={(e) => {frameContext?.zoomContext.setState(e.currentTarget.checked)}}

                    ></Toggle>
                    <Image alt='' style={{filter: 'invert(30%)'}} className={styles.icons} src={iconZoom} width={24} height={24}></Image>
                </span>

            </div>

            <div className={styles.navbarTop}>
                <div className={styles.userCircle}>
                    <Image className={styles.icons} alt='User' width={32} height={32} src='/iconUser.svg'></Image>
                </div>
                <span className={styles.logoPWD}>power<span>diamond</span></span>
            </div>

        </>

    )
}

