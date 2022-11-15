


import AddEvent from "../../ui/AddEvent";
import NavbarBot from "../../ui/NavbarBot";
import NavbarTop from "../../ui/NavbarTop";
import styles from '../page.module.scss'

export default function criar() {


    return (
        <div className={styles.bodyContainer}>
            <NavbarTop/>
            <AddEvent/>
        </div>
    )
}