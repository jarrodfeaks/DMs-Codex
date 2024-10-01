import express from 'express';
import { deleteTurn, getTurnInformation, createTurn, resetTurnToDefault, updateTurn } from '../controllers/turnController';

const router = express.Router();

router.route('/')
    .post(createTurn);
router.route('/:id')
    .get(getTurnInformation)
    .post(updateTurn)
    .delete(deleteTurn);
router.route('/:id/reset')
    .put(resetTurnToDefault);
export default router;