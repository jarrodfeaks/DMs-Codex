import express, { Router } from 'express';
import { createPlayer, deletePlayer, getAllPlayers, getPlayerEffects, getPlayerInformation, updatePlayer } from '../controllers/playerController';

const router: Router = express.Router();

router.route('/')
    .get(getAllPlayers)
    .post(createPlayer);
router.route('/:id')
    .get(getPlayerInformation)
    .put(updatePlayer)
    .delete(deletePlayer);
router.route('/:id/effects')
    .get(getPlayerEffects);

export default router;