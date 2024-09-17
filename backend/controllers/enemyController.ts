import { Request, Response } from 'express';
import { IEnemy, Enemy } from '../models/enemyModel';

// @desc Get all enemies
// @route GET /api/enemies
// @access Public
const getAllEnemies = async (req: Request, res: Response) => {
    try {
        const enemies = await Enemy.find({}) as IEnemy[];
        res.status(200).send(enemies);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific enemy
// @route GET /api/enemies/:id
// @access Public
const getEnemyById = async (req: Request, res: Response) => {
    try {
        const enemyId = req.params.id;
        const enemy = await Enemy.findById(enemyId);
        if (enemy) {
            res.status(200).json(enemy);
        } else {
            res.status(404).json({ message: 'Enemy not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Create a new enemy
// @route POST /api/enemies
// @access Public
const createEnemy = async (req: Request, res: Response) => {
    try {
        const newEnemy = new Enemy(req.body);
        const savedEnemy = await newEnemy.save();
        res.status(201).json({ _id: savedEnemy._id, ...savedEnemy.toObject() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update an enemy's experience
// @route PUT /api/enemies/:id/
// @access Public
const updateEnemy = async (req: Request, res: Response) => {
    try {
        const enemyId = req.params.id;
        const updatedData = req.body as Partial<IEnemy>;
        const updatedEnemy = await Enemy.findByIdAndUpdate(enemyId, updatedData, { new: true });
        if (updatedEnemy) {
            res.status(200).json(updatedEnemy._id);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export { getAllEnemies, getEnemyById, createEnemy, updateEnemy };