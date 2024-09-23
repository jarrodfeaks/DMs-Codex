import express from 'express';
import { createEncounter, getEncounterInformation, updateEncounter, deleteEncounter } from '../controllers/encounterController';
const router = express.Router();

router.route('/')
    .post(createEncounter);

router.route('/:id')
    .get(getEncounterInformation)
    .put(updateEncounter)
    .delete(deleteEncounter);

export default router;