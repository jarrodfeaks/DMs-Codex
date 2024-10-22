import express from 'express';
import { createUser, getRuleBookIdByDmId, updateRulebookId } from '../controllers/userController';

const router = express.Router();

router.route('/')
    .post(createUser);
router.route('/:dmId/rulebook')
    .get(getRuleBookIdByDmId)
    .put(updateRulebookId);

export default router;