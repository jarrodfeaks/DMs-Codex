import { Request, Response } from 'express';
import { IPlayer, Player } from '../models/playerModel';
import { Schema } from 'mongoose';
import { CreateEffect, DeleteEffect } from '../src/effectUtils';

// @desc Get all players
// @route GET /players
// @access Public
const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const players = await Player.find({}).populate([
            {
                path:'weapons', 
                select:'-_id' 
            },
            {
                path: 'effects',
                select: '-_id'
            }
        ]) as IPlayer[];
        res.status(200).send(players);
     } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific player
// @route GET /players/:id
// @access Public
const getPlayerInformation = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const player = await Player.findById(playerId);
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific player
// @route GET /players/:id/brief
// @access Public
const getPlayerInformationBrief = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const player = await Player.findById(playerId).select('_id name level class');
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get brief information for a list of players
// @route POST /players/brief
// @access Public
const getPlayersInformationBrief = async (req: Request, res: Response) => {
    try {
        const { playerIds } = req.body;

        if (!Array.isArray(playerIds) || playerIds.length === 0) {
            return res.status(400).json({ message: 'playerIds must be a non-empty array' });
        }

        const players = await Player.find({ _id: { $in: playerIds } }).select('_id name level class');
        res.status(200).json(players);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Create a new player
// @route POST /players/
// @access Public
const createPlayer = async (req: Request, res: Response) => {
    try {
        const newPlayer = req.body as IPlayer;
        // Assign player with new empty effect
        const effectId = await CreateEffect();
        newPlayer.effectId = effectId as unknown as Schema.Types.ObjectId;
        
        const savedPlayer = await Player.create(newPlayer);
        res.status(201).json(savedPlayer._id);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Update a player
// @route PUT /players/:id
// @access Public
const updatePlayer = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const updatedData = req.body as Partial<IPlayer>;
        const updatedPlayer = await Player.findByIdAndUpdate(playerId, updatedData, { new: true });
        if (updatedPlayer) {
            res.status(200).json(updatedPlayer._id);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Delete a player
// @route DELETE /players/:id
// @access Public
const deletePlayer = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const deletedPlayer = await Player.findByIdAndDelete(playerId);

        if (deletedPlayer) {
            await DeleteEffect(deletedPlayer.effectId);
            res.status(200).json({ message: 'Player deleted successfully' });
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get all effects of a player
// @route GET /players/:id/effects
// @access Public
const getPlayerEffects = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const player = await Player.findById(playerId).populate({path: 'effects', select: '-_id'});
        if (player) {
            res.status(200).json(player.effectId);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
}

export { createPlayer, deletePlayer, getAllPlayers, getPlayerEffects, getPlayerInformation, getPlayerInformationBrief, getPlayersInformationBrief, updatePlayer };