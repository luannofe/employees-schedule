'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import style from '../navbar.module.scss'

export default function Loading(props: {size?: {}}) {

    const [isVisible, setIsVisible] = useState(false)

    useEffect(()=> {
        setIsVisible(true)
    },[])

    return <div style={{
        display: 'flex',
        flex: 1,
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <motion.div animate={{
            rotate: [0, 0, 360],
            scale: [0, 0.7, 0.65]
        }} style={{visibility: isVisible? 'visible': 'hidden'}}>
            <Image alt='loading icon' className={style.icons} height={128} width={128} src='/iconLoading.svg'></Image>
        </motion.div>
    </div>
}