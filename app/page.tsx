import styles from './page.module.scss'
import Calendar from "../ui/Calendar";
import { databaseEventInterface } from '../pages/api/data';





export default async function App() {

  let data : databaseEventInterface[] = await getData()

  return  (
    <div className={styles.bodyContainer}>
      <div className={styles.navbarTop}></div>
      <Calendar data={data}/>
      <div className={styles.navbarBot}>
        <button>Cadastrar</button>
        <button>Apagar</button>
        <button>Editar</button>
        <button>Abrir</button>
      </div>
    </div>
  )
  
}

async function getData() {
  
  return await fetch('http://localhost:3000/api/data', {
    method: 'POST',
    body: JSON.stringify({
      table: 'eventos'
    })
  }).then(res => res.json())
  .then(data => data)
}