import express from 'express';
import { deleteTurn, getTurnInformation, createTurn, updateTurn } from '../controllers/turnController';

const router = express.Router();

router.route('/')
    .post(createTurn);
router.route('/:id')
    .get(getTurnInformation)
    .post(updateTurn)
    .delete(deleteTurn);

export default router;