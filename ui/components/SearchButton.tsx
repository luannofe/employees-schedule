import { motion } from "framer-motion"
import Image from "next/image"
import React, { useContext } from "react"
import { useEffect, useState } from "react"
import styles from './searchbutton.module.scss'
import { frameContext, frontEndEventos } from "../Frame"

export default function Searchbutton() {

    const [isHovering, setHovering] = useState(false)
    const [isClicked, setClicked] = useState(false)

    const [searchedEvents, setSearchedEvents] = useState<frontEndEventos[]>([])
    const [searchInput, setSearchInput] = useState<string>()

    const eventsCtx = useContext(frameContext)?.eventsContext
    const selectionCtx = useContext(frameContext)?.eventSelectionContext
    
    const thisRef = React.createRef<HTMLDivElement>()


    useEffect(() => {

        document.addEventListener('click', checkClickedOut)

        return () => {
            document.removeEventListener('click', checkClickedOut)
        }

    }, [])

    useEffect(() => {
        
        const searchDelayTO = delayInput(searchInput)

        return () => { clearTimeout(searchDelayTO) }

    }, [searchInput])

    useEffect(()=> {
        
        if (searchedEvents.length > 0) {

            selectionCtx?.setState({
                selected: true,
                eventData: searchedEvents[0]
            })

            setTimeout(() => {

                searchedEvents[0].thisRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })

            }, 200)

            return () => {
                selectionCtx?.setState({selected: false})
            }
        }

    }, [searchedEvents])

    return (

        <motion.div className={styles.divSearch} ref={thisRef} 
        
            onHoverStart={() => {setHovering(true)}}
            
            onHoverEnd={() => {isClicked? '' : setHovering(false)}}
        
            onClick={() => {setClicked(true)}}

            animate={{ scale: [0, 1.05, 1] }} 

            style={{

                width: isHovering? 400 : 60
                
            }}


        >
            <Image className={styles.icons} width={40} height={40} src='/iconSearch.svg' alt='Recarregar' style={{
                
                left: isHovering? 4: 10,
                transform: isHovering? 'scale(0.5)' : 'scale(1)'
            }} />


            {
            isHovering && <input  className={ styles.input }

                onChange ={(e) => {setSearchInput(e.currentTarget.value)}}

                placeholder='Pesquisar TITULO ou PROPOSTA...'
            >

            </input>
            }

        </motion.div>
    )


    function checkClickedOut(e: any) {

        if (!thisRef.current) {
            return
        }

        if (!thisRef.current.contains(e.target)) {
            console.log('CLICOU FORA')
            setClicked(false)
            setHovering(false)
            setSearchedEvents([])

            return eventsCtx?.setState((prevState) => {
                return prevState?.map((item) => {
                    return {
                        ...item,
                        isSearched: false
                    }
                })
            })
        } 
    }

    function delayInput(e?: string) {
        
        setSearchedEvents([])

        return setTimeout(() => {

            if (e) {
    
                eventsCtx?.state!.map(item => {
    
                    return item.eventos.filter( (evento) => {
    
                        if (evento.proposta.toLowerCase().includes(e.toLowerCase()) || evento.titulo.toLowerCase().includes(e.toLowerCase())) {
    
                            setSearchedEvents( prev => [...prev, evento])
                            return true
                            
                        }
    
                        return false

                    }).length > 0   
    
                })
    
            }

        }, 300)
        


  
    }

}