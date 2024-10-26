import { Request, Response } from 'express';
import { IPlayer, Player } from '../models/playerModel';

// @desc Get all players
// @route GET /players
// @access Public
const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const players = await Player.find({}).populate('weapons') as IPlayer[];
        res.status(200).send(players);
     } catch (error: any) {
        res.status(500).json(error.message);
    }
};

// @desc Get a specific player
// @route GET /players/:id
// @access Public
const getPlayerInformation = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const player = await Player.findById(playerId)
            .populate('weapons');
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).send({ message: 'Player not found' });
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
        const player = await Player.findById(playerId, '_id name level class');
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).send({ message: 'Player not found' });
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
            return res.status(400).send({ message: 'playerIds must be a non-empty array' });
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
        console.log(error);
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
            res.status(200).send({ message: 'Player deleted successfully' });
        } else {
            res.status(404).send({ message: 'Player not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export { createPlayer, deletePlayer, getAllPlayers, getPlayerInformation, getPlayerInformationBrief, getPlayersInformationBrief, updatePlayer };