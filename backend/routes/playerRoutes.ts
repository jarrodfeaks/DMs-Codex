import express, { Router } from 'express';
import { getAllPlayers, createPlayer, updatePlayer } from '../controllers/playerController';

const router: Router = express.Router();

router.route('/').get(getAllPlayers).post(createPlayer);;
//router.route('/player/:id').get(getPlayer);

router.route('/:id').put(updatePlayer);


export default router;