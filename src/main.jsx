import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSmoothScroll } from './smoothScroll.js'

// Init lightweight smooth-scroll polyfill (works on low-CPU devices too)
initSmoothScroll();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
