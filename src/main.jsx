import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'normalize.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/Saper'>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
)
