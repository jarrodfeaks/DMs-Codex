import express from 'express';
import { deleteWeapon, getAllWeaponsList, getWeaponInformation, createWeapon, updateWeapon } from '../controllers/weaponController';

const router = express.Router();

router.route('/')
    .get(getAllWeaponsList)
    .post(createWeapon);
router.route('/:id')
    .get(getWeaponInformation)
    .put(updateWeapon)
    .delete(deleteWeapon);

export default router;