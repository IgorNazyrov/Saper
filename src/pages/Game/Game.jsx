import { useEffect, useState, useContext, useRef, useCallback } from "react"
import Header from "../../components/Header/Header"
import Cell from "../../components/Cell/Cell"
import { DifficultyContext } from "../../components/DifficultyContext"
import styles from './Game.module.css'

export default function Game () {  
  const { difficulty } = useContext(DifficultyContext)
  const [board, setBoard] = useState([])
  // const [cellsLeft, setCellsLeft] = useState(10)
  const [time, setTime] = useState(0)
  const [timeIsRunning, setTimeIsRunning] = useState(false)
  const [firstClickMade, setFirstClickMade] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [minesLeft, setMinesLeft] = useState(10)
  const intervalRef = useRef(null)
  const [error, setError] = useState(null)

  const handleError = (error, context) => {
    console.error(`Ошибка в ${context}:`,  error)
    setError(`Произошла ошибка: ${error.message}`)
    setTimeout(() => setError(null), 5000)
  }
  const initBoard = useCallback((difficulty) => {
    try {
      let rows, cols, mines
  
      switch(difficulty) {
        case 'easy':
          rows = 8;
          cols = 8;
          mines = 10;
          break;
        case 'medium':
          rows = 16;
          cols = 16;
          mines = 40;
          break;
        case 'hard':
          rows = 16;
          cols = 32;
          mines = 100;
          break
        default: 
          throw new Error('Неизвестный уровень сложности')
      }
      
      const newBoard = Array(rows).fill().map(() => 
        Array(cols).fill().map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          isNotExactly: false,
          neighborMines: 0
        }))
      )
      
      let minesPlaced = 0
      while (minesPlaced < mines) {
        const randomRow = Math.floor(Math.random() * rows)
        const randomCol = Math.floor(Math.random() * cols)
        
        if (!newBoard[randomRow][randomCol].isMine) {
          newBoard[randomRow][randomCol].isMine = true
          minesPlaced++
        }
      }
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (!newBoard[i][j].isMine) {
            let count = 0
            
            for (let x = -1; x <= 1; x++) {
              for (let y = -1; y <= 1; y++) {
                const newRow = i + x
                const newCol = j + y
                
                if (
                  newRow >= 0 && newRow < rows &&
                  newCol >= 0 && newCol < cols && 
                  newBoard[newRow][newCol].isMine
                ) {
                  count++
                }
              }
            }
            newBoard[i][j].neighborMines = count
          }
        }
      }
      setBoard(newBoard)
      // setCellsLeft(rows * cols - mines)
      setTime(0)
      setGameOver(false)
      setMinesLeft(mines)
    } catch (err) {
      handleError(err, 'инициализации доски')
      setBoard(Array(8).fill().map(() => 
        Array(8).fill().map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          isNotExactly: false,
          neighborMines: 0
        }))
      ));
      // setCellsLeft(64);
    }
  }, [])

  useEffect(() => {
    try {
      initBoard(difficulty)
    } catch (err) {
      handleError(err, 'эффекте инициализации')
    }
  }, [difficulty])
  
  useEffect(() => {
    try {
      if (!timeIsRunning) {
        clearInterval(intervalRef.current)
        return
      }
  
      const initialTime = {
        easy: 600,
        medium: 2400,
        hard: 6000,
      }[difficulty]
  
      setTime(0)
  
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime === initialTime) {
            clearInterval(intervalRef.current)
            setGameOver(true)
            return 0
          }
          return prevTime + 1
        })
      }, 1000)
    } catch (err) {
      handleError(err, 'таймере')
    }
  }, [timeIsRunning, difficulty])

  const formatTime = (seconds) => {
    try {
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } catch (err) {
      handleError(err, 'форматировании времени')
      return '00:00'
    }
  }

  const savedToLeaderBoards = (time, difficulty) => {
    try {
      const currentData = localStorage.getItem('leaderBoard')
      const leaderBoard = currentData ? JSON.parse(currentData) : []

      const newAttempt = {
        time: time,
        difficulty: difficulty,
        date: new Date().toISOString()
      }

      leaderBoard.push(newAttempt)
      localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard, newAttempt))
    } catch (err) {
      handleError(err, 'сохранении результатов')
    }
  }

  const deepCopyBoard = () => {
      return board.map(row => row.map(cell => ({...cell})))
  }

  const resetGame = () => {
    try {
      initBoard(difficulty)
      setTime(0)
      setTimeIsRunning(false)
      setFirstClickMade(false)
    } catch (err) {
      handleError(err, 'сбросе игры')
    }
  }

  const handleClick = (i, j) => {
    try {
      if (gameOver || !board[i] || !board[i][j] || board[i][j].isRevealed || board[i][j].isFlagged || board[i][j].isNotExactly) return
  
      if (!firstClickMade) {
        setFirstClickMade(true)
        setTimeIsRunning(true)
      }
  
      const newBoard = deepCopyBoard(board)
  
      if (newBoard[i][j].isMine) {
        newBoard.forEach((row) => {
          row.forEach((cell) => {
            if (cell.isMine) cell.isRevealed = true
          })
        })
        setBoard(newBoard)
        setGameOver(true)
        return
      }
  
      const queue = [[i, j]]
      const revealedCells = []

      while (queue.length > 0) {
        const [row, col] = queue.shift()
  
        if (
          row < 0 || row >= newBoard.length ||
          col < 0 || col >= newBoard[0].length ||
          newBoard[row][col].isRevealed ||
          newBoard[row][col].isFlagged || 
          newBoard[row][col].isNotExactly
        ) {
          continue
        }
    
        newBoard[row][col].isRevealed = true
        revealedCells.push([row, col])
    
        if (newBoard[row][col].neighborMines === 0) {
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x !== 0 || y !== 0) {
                queue.push([row + x, col + y])
              }
            }
          }
        }
      }
  
      setBoard(newBoard)
      // setCellsLeft(prev => prev - revealedCells.length)
  
      const isWon = newBoard.flat().every(cell => cell.isRevealed || cell.isMine)
      if (isWon) {
        setGameOver(true)
        setTimeIsRunning(false)
        savedToLeaderBoards(time, difficulty)
      }
    } catch (err) {
      handleError(err, 'обработке клика')
    }
  }

  const handleRightClick = (e, i, j) => {
    try {
      e.preventDefault()
  
      if (gameOver || board[i][j].isRevealed) return
  
      const newBoard = deepCopyBoard(board)
      
      const cell = newBoard[i][j]
  
      if(!cell.isFlagged && !cell.isNotExactly) {
        cell.isFlagged = true
        setMinesLeft((prev) =>prev - 1)
      } else if (cell.isFlagged) {
        cell.isFlagged = false
        cell.isNotExactly = true
        setMinesLeft((prev) => prev + 1)
      } else {
        cell.isNotExactly = false
      }
      
      setBoard(newBoard)
    } catch (err) {
      handleError(err, 'обработке правого клика')
    }
  }

  return (
    <div className={styles.containerGame}>
      <Header/>
      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      <div className={styles.gameInfo}>
        <div className={styles.timer}>Таймер: {formatTime(time)}</div>
        {/* <div className={styles.cellsInfo}>Ячеек осталось: {cellsLeft}</div> */}
        <div className={styles.cellsInfo}>Мин осталось: {minesLeft}</div>
        <button className={styles.reset} onClick={resetGame}>↻</button>
      </div>
      <div className={styles.board} 
      style={{
        gridTemplateRows: `repeat(${board.length}, 24px)`,
        gridTemplateColumns: `repeat(${board[0]?.length || 8}, 24px)`
      }}
      >
        {board.map((row, i) => (
          row.map((cel, j) => (
            <Cell 
            key={`${i}-${j}`} 
            value={board[i][j]} 
            onRightClick={(e) => handleRightClick(e, i, j)} 
            onClick={() => handleClick(i, j)}
            />
          ))
        ))}
      </div>
    </div>
  )
}