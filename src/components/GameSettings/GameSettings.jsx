import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import styles from './GameSettings.module.css'
import { DifficultyContext } from "../DifficultyContext"

export default function GameSettings ({isOpen, onClose}) {
  const {difficulty, setDifficulty} = useContext(DifficultyContext)
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/')
    onClose()
  }

  return (
    <>
      {isOpen ? (
        <div className={styles.containerSettings}>
          <h2 className={styles.h2Title}>Выберите уровень сложности</h2>
          <div className={styles.containerSelectBtn}>
            <select value={difficulty} className={styles.selectSettings} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Простой (8x8, 10мин)</option>
              <option value="medium">Средний (16x16, 40мин)</option>
              <option value="hard">Сложный (32x16, 100мин)</option>
            </select>
            <button className={styles.buttonSettings} onClick={handleStart}>Начать игру</button>
          </div>
      </div>
      ) : ''}
    </>
  )
}