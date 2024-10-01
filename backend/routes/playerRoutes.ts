import express, { Router } from 'express';
import { createPlayer, deletePlayer, getAllPlayers, getPlayerEffects, getPlayerInformation, getPlayerInformationBrief, getPlayersInformationBrief, updatePlayer } from '../controllers/playerController';

const router: Router = express.Router();

router.route('/')
    .get(getAllPlayers)
    .post(createPlayer);
router.route('/brief')
    .get(getPlayersInformationBrief);
router.route('/:id')
    .get(getPlayerInformation)
    .put(updatePlayer)
    .delete(deletePlayer);
router.route('/:id/effects')
    .get(getPlayerEffects);
router.route('/:id/brief')
    .get(getPlayerInformationBrief);

export default router;