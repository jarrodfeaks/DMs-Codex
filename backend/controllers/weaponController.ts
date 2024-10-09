import { Request, Response } from 'express';
import { Weapon } from '../models/weaponModel';

// @desc Get all weapons
// @route GET /weapons
// @access Public
const getAllWeaponsList = async (req: Request, res: Response) => {
    try {
        const weapons = await Weapon.find({}).select('_id name');
        const weaponNameList = weapons.map(weapon => weapon.name);
        res.status(200).send(weaponNameList);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific weapon
// @route GET /weapons/:id
// @access Public
const getWeaponInformation = async (req: Request, res: Response) => {
    try {
        const weaponId = req.params.id;
        const weapon = await Weapon.findById(weaponId);
        if (weapon) {
            res.status(200).json(weapon);
        } else {
            res.status(404).json({ message: 'Weapon not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Create a new weapon
// @route POST /weapons
// @access Public
const createWeapon = async (req: Request, res: Response) => {
    try {
        const newWeapon = new Weapon(req.body);
        const savedWeapon = await newWeapon.save();
        res.status(201).json(savedWeapon);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Update a weapon
// @route PUT /weapons/:id
// @access Public
const updateWeapon = async (req: Request, res: Response) => {
    try {
        const weaponId = req.params.id;
        const updatedWeapon = await Weapon.findByIdAndUpdate(weaponId, req.body, { new: true });
        if (updatedWeapon) {
            res.status(200).json(updatedWeapon);
        } else {
            res.status(404).send({ message: 'Weapon not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Delete a weapon
// @route DELETE /weapons/:id
// @access Public
const deleteWeapon = async (req: Request, res: Response) => {
    try {
        const weaponId = req.params.id;
        const deletedWeapon = await Weapon.findByIdAndDelete(weaponId);
        if (deletedWeapon) {
            res.status(200).send({ message: 'Weapon deleted' });
        } else {
            res.status(404).send({ message: 'Weapon not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export { getAllWeaponsList, getWeaponInformation, createWeapon, updateWeapon, deleteWeapon };