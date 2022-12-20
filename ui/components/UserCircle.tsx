
import Image from 'next/image'
import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { frameContext } from '../Frame';
import styles from './usercircle.module.scss'

export default function UserCircle({}) {

    const adminPassword = '123456'
        
    const [isClicked, setClicked] = useState(false)
    const [isOpen, setOpen] = useState(false)

    const inputRef = React.createRef<HTMLInputElement>()

    const adminContext = useContext(frameContext)?.adminContext

    useEffect(()=> {

        let openTimeout : NodeJS.Timeout

        if (isClicked) {
            openTimeout = setTimeout(()=>{
                setOpen(true)
            }, 200)
        } else {
            setOpen(false)
        }

        return () => {
            clearTimeout(openTimeout)
        }

    }, [isClicked])

    useEffect(() => {
    }, [isOpen])

    return (<>

        <div className={styles.userCircle} onClick={(e) => {setClicked(!isClicked)}}>
            <Image className={styles.icons} style={{
                filter: adminContext?.state? 'invert(24%) sepia(70%) saturate(5538%) hue-rotate(120deg) brightness(91%) contrast(103%)' : 'invert(50%)'
            }} alt='User' width={32} height={32} src='/iconUser.svg'></Image>
        </div>

        <form onSubmit={e => formHandler(e)}
        
        style={{
            width: isClicked? adminContext?.state? 110 : 240 : 32,
            height: 32,
            backgroundColor: 'white',
            borderRadius: 12,
            position: 'absolute',
            left: 16,
            zIndex: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: '0.3s',

        }}>
            
            { isOpen? <>

                {!adminContext?.state? <>
                    <Image className={styles.icons} style={{
                        marginLeft: 48,

                    }} alt='key' width ={16} height={16} src='/iconKey.svg'></Image>

                    <input className={styles.input} name={'password'} autoFocus={true} ref={inputRef} maxLength={12} type="password"  />

                    <button className={styles.button} type='submit' style={{
                        fontWeight: 700
                    }}>
                        OK
                    </button>
                </>
                :
                <>
                    <button className={styles.button} onClick={()=>{adminContext?.setState(false)}} style={{
                        marginLeft: 48,
                        color: 'rgb(114, 0, 0)',
                        fontWeight: 800
                    }}>
                        SAIR
                    </button>
                </> 
            }
            </> : null}
        </form>

        </>
    );


    function formHandler(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault()

        if (!inputRef.current) {
            return
        }

        if (inputRef.current.value == adminPassword) {
            adminContext?.setState(true)
            setClicked(false)
        }
    }
  }