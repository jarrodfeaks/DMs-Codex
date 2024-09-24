import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import Landing from './Landing.tsx'
import SkillsCalc from './skillsCalc.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkillsCalc />
    {/* <Landing /> */}
  </StrictMode>,
)
