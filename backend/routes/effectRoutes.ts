import express, { Router } from 'express';
import { getAllEffectsFromCharacterId } from '../controllers/effectController';

const router: Router = express.Router();

router.route('/:id').get(getAllEffectsFromCharacterId);

export default router;