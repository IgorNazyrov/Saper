import { useState, createContext, useEffect } from "react";

export const DifficultyContext = createContext()

export const DifficultyProvider = ({children}) => {
  const [difficulty, setDifficulty] = useState('easy')

  useEffect(() => {
    localStorage.setItem('difficulty', difficulty)
  }, [difficulty])

  return (
    <DifficultyContext.Provider value={{difficulty, setDifficulty}}>
      {children}
    </DifficultyContext.Provider>
  )
}