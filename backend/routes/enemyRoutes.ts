import express, { Router } from 'express';
import { getAllEnemies, getEnemyById } from '../controllers/enemyController';

const router: Router = express.Router();

router.route('/').get(getAllEnemies);
router.route('/:id').get(getEnemyById);

export default router;