import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { IPlayer, Player } from '../models/playerModel';

// @desc Get all players
// @route GET /api/players
// @access Public
const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const players = await Player.find({}) as IPlayer[];
        res.status(200).send(players);
     } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific player
// @route GET /api/players/:id
// @access Public
const getPlayerById = async (req: Request, res: Response) => {
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

// @desc Create a new player
// @route POST /api/players
// @access Public
const createPlayer = async (req: Request, res: Response) => {
    try {
        const newPlayer = req.body as IPlayer;
        const savedPlayer = await Player.create(newPlayer);
        res.status(201).json(savedPlayer);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Update a player
// @route PUT /api/players/:id
// @access Public
const updatePlayer = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const updatedData = req.body as Partial<IPlayer>;
        const updatedPlayer = await Player.findByIdAndUpdate(playerId, updatedData, { new: true });
        if (updatedPlayer) {
            res.status(200).json(updatedPlayer);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Delete a player
// @route DELETE /api/players/:id
// @access Public
const deletePlayer = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const deletedPlayer = await Player.findByIdAndDelete(playerId);
        if (deletedPlayer) {
            res.status(200).json({ message: 'Player deleted successfully' });
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};


export { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer};