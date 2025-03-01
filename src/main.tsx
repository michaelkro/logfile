import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Logfile } from './components/Logfile'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Logfile />
  </StrictMode>
)
