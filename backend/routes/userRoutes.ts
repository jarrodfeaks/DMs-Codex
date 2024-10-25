import express from 'express';
import { createUser, getAllUserInfo, updateRulebookId, updateUserIds } from '../controllers/userController';

const router = express.Router();

router.route('/')
    .post(createUser);
router.route('/:dmId/rulebook')
    .put(updateRulebookId);
router.route('/:dmId')
    .get(getAllUserInfo)
    .put(updateUserIds);

export default router;