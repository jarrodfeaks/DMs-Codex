import express, { Router } from 'express';
import { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } from '../controllers/playerController';

const router: Router = express.Router();

router.route('/').get(getAllPlayers).post(createPlayer);;
router.route('/:id').put(updatePlayer).get(getPlayerById).delete(deletePlayer);

export default router;