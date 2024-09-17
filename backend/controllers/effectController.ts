import { Request, Response } from 'express';
import { IEffect, Effect } from '../models/effectModel';
import { Player } from '../models/playerModel';
import { Enemy } from '../models/enemyModel';

// @desc Get all effects
// @route GET /effect/:characterId
// @access Public
const getAllEffectsFromCharacterId = async (req: Request, res: Response) => {
    try {
        const characterId = req.params.id;
        const enemy = await Enemy.findById(characterId);
        const player = await Player.findById(characterId);
        if (enemy) {
            const effects = await Effect.find({ _id: { $in: enemy.effects } });
            res.status(200).json(effects);
        } 
        else if (player) {
            const effects = await Effect.find({ _id: { $in: player.effects } });
            res.status(200).send(effects);
        }
        else {
            res.status(404).json({ message: 'Enemy not found' });
        }
     } catch (error: any) {
        res.status(500).send(error.message);
    }
};

const CreateEffect = async (req: Request, res: Response) => {
    try {
        const newEffect = req.body as IEffect;
        const savedEffect = await Effect.create(newEffect);
        res.status(201).json(savedEffect._id);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};


export { getAllEffectsFromCharacterId, CreateEffect };