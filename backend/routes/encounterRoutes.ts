import express from 'express';
import { addToCombatLog, addCharacterToEncounter, createEncounter, getEncounterInformation, resetTurnsInEncounter, updateEncounter, deleteEncounter } from '../controllers/encounterController';
const router = express.Router();

router.route('/')
    .post(createEncounter);
router.route('/:id/reset/turns')
    .put(resetTurnsInEncounter);
router.route('/:id/combat/log')
    .put(addToCombatLog);
router.route('/:id/character')
    .get(addCharacterToEncounter);
router.route('/:id')
    .get(getEncounterInformation)
    .put(updateEncounter)
    .delete(deleteEncounter);
    
export default router;