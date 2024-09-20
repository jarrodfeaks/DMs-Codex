import express, { Router } from 'express';
import { getAllMonsters, getMonsterInformation, getMonsterEncounterBrief, getMonsterEffects, createMonster, updateMonster, deleteMonster } from '../controllers/monsterController';

const router: Router = express.Router();

router.route('/').get(getAllMonsters).post(createMonster);
router.route('/:id').get(getMonsterInformation).put(updateMonster).delete(deleteMonster);
router.route('/:id/encounter/brief').get(getMonsterEncounterBrief);
router.route('/:id/effects').get(getMonsterEffects);

export default router;