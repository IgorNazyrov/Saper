import { useState } from "react"
import GameSettings from "../GameSettings/GameSettings"
import { Link } from "react-router-dom"
import styles from './Header.module.css'

export default function Header () {
  const [isSettingOpen, setIsSettingOpen] = useState(false)

  return (
    <div className={styles.containerHeader}>
      <div className={styles.containerBtnLink}>
        <button className={styles.button} onClick={() => setIsSettingOpen(true)}>Настройки</button>
        <Link className={styles.link} to='/leaderboard'>Таблица лидеров</Link>
      </div>
      {isSettingOpen && (
        <div className="modal">
          <GameSettings isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)}/>
        </div>
      )}
  </div>
  )
}