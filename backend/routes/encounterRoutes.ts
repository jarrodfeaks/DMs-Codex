import express from 'express';
import { createEncounter, getEncounterInformation, resetTurnsInEncounter, updateEncounter, deleteEncounter } from '../controllers/encounterController';
const router = express.Router();

router.route('/')
    .post(createEncounter);
router.route('/:id')
    .get(getEncounterInformation)
    .put(updateEncounter)
    .delete(deleteEncounter);
router.route('/:id/reset/turns')
    .put(resetTurnsInEncounter);

export default router;