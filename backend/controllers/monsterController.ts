import { Request, Response } from 'express';
import { IMonster, Monster } from '../models/monsterModel';

// @desc Get all monsters
// @route GET /monsters
// @access Public
const getAllMonsters = async (req: Request, res: Response) => {
    try {
        const monsters = await Monster.find({}).populate('weapons') as IMonster[];
        res.status(200).send(monsters);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific monster
// @route GET /monsters/:id
// @access Public
const getMonsterInformation = async (req: Request, res: Response) => {
    try {
        const monsterId = req.params.id;
        const monster = await Monster.findById(monsterId).populate('weapons');
        if (monster) {
            res.status(200).json(monster);
        } else {
            res.status(404).send({ message: 'Monster not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific monster encounter brief
// @route GET /monsters/:id/encounter/brief
// @access Public
const getMonsterEncounterBrief = async (req: Request, res: Response) => {
    try {
        const monsterId = req.params.id;
        const monster = await Monster.findById(monsterId, 'name currentHealth tempHealth maxHealth armorClass deathSavingThrows');
        if (monster) {
            res.status(200).json(monster);
        } else {
            res.status(404).send({ message: 'Monster not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Create a new monster
// @route POST /monsters/
// @access Public
const createMonster = async (req: Request, res: Response) => {
    try {
        const newMonster = req.body as IMonster;
        const savedMonster = await Monster.create(newMonster);
        res.status(201).json(savedMonster._id);
    } catch (error: any) {
        res.status(400).send({ message: error.message });
    }
};

// @desc Update a monster
// @route PUT /monsters/:id
// @access Public
const updateMonster = async (req: Request, res: Response) => {
    try {
        const monsterId = req.params.id;
        const updatedData = req.body as Partial<IMonster>;
        const updatedMonster = await Monster.findByIdAndUpdate(monsterId, updatedData, { new: true });
        if (updatedMonster) {
            res.status(200).json(updatedMonster._id);
        } else {
            res.status(404).send({ message: 'Monster not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Delete a monster
// @route DELETE /monsters/:id
// @access Public
const deleteMonster = async (req: Request, res: Response) => {
    try {
        const monsterId = req.params.id;
        const deletedMonster = await Monster.findByIdAndDelete(monsterId);

        if (deletedMonster) {
            res.status(200).json({ message: 'Monster deleted successfully' });
        } else {
            res.status(404).send({ message: 'Monster not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export { createMonster, deleteMonster, getAllMonsters, getMonsterEncounterBrief, getMonsterInformation, updateMonster };