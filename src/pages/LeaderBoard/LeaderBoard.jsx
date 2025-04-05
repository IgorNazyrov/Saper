import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import styles from './LeaderBoard.module.css'

export default function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const initialTime = {
    easy: 600,
    medium: 2400,
    hard: 6000,
  }

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("leaderBoard");
      const parsedData = savedData ? JSON.parse(savedData) : [];
      
      const transformedData = parsedData.map((score) => ({
        ...score,
        spentTime: initialTime[score.difficulty] - score.time
      }))

      const sortedData = [...transformedData]
        .sort((a, b) => a.spentTime - b.spentTime)
        .slice(0, 10);
      setLeaderBoard(sortedData);
    } catch (error) {
      console.error("Ошибка загрузки таблицы лидеров:", error);
      setLeaderBoard([]);
    }
  }, []);

  return (
    <div className={styles.containerLeaderBoard}>
      <Header />
      <div className={styles.tableContainer}>
        <table className={styles.leaderBoardTable}>
          <thead>
            <tr>
              <th>Место</th>
              <th>Время</th>
              <th>Сложность</th>
              <th>Дата</th>
            </tr>
            
          </thead>
          <tbody> 
            {leaderBoard.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.spentTime} сек</td>
                <td>
                  {score.difficulty === 'easy' ? 'Легкая' :
                  score.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                </td>
                <td>{new Date(score.date).toLocaleString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leaderBoard.length === 0 && (
          <p className={styles.emptyMessage}>Таблица рекордов пуста</p>
        )}
    </div>
  );
}