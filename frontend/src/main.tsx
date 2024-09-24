import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import Encounter_Screen from './Encounter_Screen.tsx'
import './index.css'
import InitiativeGreenPlusAIGenerated from './InitiativeGreenPlusAIGenerated.tsx'
import InitiativeGreenPlusBestiary from './InitiativeGreenPlusBestiary.tsx'
import InitiativeGreenPlusPlayerList from './InitiativeGreenPlusPlayerList.tsx'
import InitiativeRedMinus from './InitiativeRedMinus.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Encounter_Screen /> */}
    {/* <InitiativeGreenPlusAIGenerated/> */}
    {/* <InitiativeGreenPlusBestiary /> */}
    {/* {<InitiativeGreenPlusPlayerList/>} */}
    {/* <InitiativeRedMinus /> */}
  </StrictMode>,
)
