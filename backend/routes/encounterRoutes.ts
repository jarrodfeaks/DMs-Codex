import express from 'express';
import { addToCombatLog, addCharacterToEncounter, createEncounter, getEncounterInformation, resetTurnsInEncounter, updateEncounter, deleteEncounter, updateCurrentTurn, getCombatLog, getCurrentTurnInfo, updateInitiativeOrder } from '../controllers/encounterController';
const router = express.Router();

router.route('/')
    .post(createEncounter);
router.route('/:id/reset/turns')
    .put(resetTurnsInEncounter);
router.route('/:id/combat-log')
    .get(getCombatLog)
    .put(addToCombatLog);
router.route('/:id/character')
    .put(addCharacterToEncounter);
router.route('/:id/current-turn')
    .get(getCurrentTurnInfo)
    .put(updateCurrentTurn);
router.route('/:id/initiative-order')
    .put(updateInitiativeOrder);
router.route('/:id')
    .get(getEncounterInformation)
    .put(updateEncounter)
    .delete(deleteEncounter);
    
export default router;