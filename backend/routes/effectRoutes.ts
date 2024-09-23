import express from 'express';
import { getAllEffects, getEffectInformation, createEffect, updateEffect, deleteEffect } from '../controllers/effectController';

const router = express.Router();

router.route('/')
    .get(getAllEffects)
    .post(createEffect);

router.route('/:id')
    .get(getEffectInformation)
    .put(updateEffect)
    .delete(deleteEffect);

export default router;