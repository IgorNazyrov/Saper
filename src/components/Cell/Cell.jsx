import styles from './Cell.module.css'

export default function Cell ({value, onClick, onRightClick}) {
  const { isRevealed, isMine, isFlagged, isNotExactly, neighborMines} = value

  let content = ''

  if (isRevealed) {
    content = isMine ? '💣' : neighborMines > 0 ? neighborMines : '' 
  } else if (isFlagged) {
    content = '🚩'
  } else if (isNotExactly) {
    content = '?'
  }

  const cellClasses = [
    styles.cell, 
    isRevealed ? styles.revealed : '',
    isMine && isRevealed ? styles.mine : '',
    isFlagged ? styles.flagged : '',
    isNotExactly ? styles.notExactly : '',
  ].join(' ').trim()

  return (
    <div 
    className={cellClasses}
    onClick={onClick}
    onContextMenu={onRightClick}
    data-neighbor={neighborMines}
    >
      {content}
    </div>
  )
}