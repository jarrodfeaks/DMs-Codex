import express, { Router } from 'express';
import { getAllMonsters, getMonsterInformation, getMonsterEncounterBrief, createMonster, updateMonster, deleteMonster } from '../controllers/monsterController';

const router: Router = express.Router();

router.route('/')
    .get(getAllMonsters)
    .post(createMonster);
router.route('/:id')
    .get(getMonsterInformation)
    .put(updateMonster)
    .delete(deleteMonster);
router.route('/:id/encounter/brief')
    .get(getMonsterEncounterBrief);

export default router;