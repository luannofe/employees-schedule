'use client'

import styles from './navbar.module.scss'
import ShowMonth from './ShowMonth'
import Image from "next/image"


export default function NavbarTop() {


    return (

        <>
            <ShowMonth/>
            <div className={styles.navbarTop}>
                <div className={styles.userCircle}>
                    <Image className={styles.icons} alt='User' width={32} height={32} src='/iconUser.svg'></Image>
                </div>
                <span >power<span>diamond</span></span>
            </div>

        </>

    )
}