import { Request, Response } from 'express';
import { Turn } from '../models/turnModel';
import { Encounter } from '../models/encounterModel';

// @desc Get a specific turn
// @route GET /turns/:id
// @access Public
const getTurnInformation = async (req: Request, res: Response) => {
    try {
        const turnId = req.params.id;
        const turn = await Turn.findById(turnId);
        if (turn) {
            res.status(200).json(turn);
        } else {
            res.status(404).json({ message: 'Turn not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Create a new turn
// @route POST /turns
// @access Public
const createTurn = async (req: Request, res: Response) => {
    try {
        const { encounterId, ...turnData } = req.body;
        // Create a new turn
        const newTurn = new Turn(turnData);
        const savedTurn = await newTurn.save();
        // Add the created turn to the encounter's turns list
        const updatedEncounter = await Encounter.findByIdAndUpdate(
            encounterId,
            { $push: { turns: savedTurn._id } },
            { new: true, runValidators: true }
        );
        if (!updatedEncounter) {
            return res.status(404).json({ message: 'Encounter not found' });
        }
        res.status(201).json(savedTurn);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Update a turn
// @route PUT /turns/:id
// @access Public
const updateTurn = async (req: Request, res: Response) => {
    try {
        const turnId = req.params.id;
        const updatedTurn = await Turn.findByIdAndUpdate(turnId, req.body, { new: true });
        if (updatedTurn) {
            res.status(200).json(updatedTurn);
        } else {
            res.status(404).json({ message: 'Turn not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Update turn to default values
// @route PUT /turns/:id/reset
// @access Public
const resetTurnToDefault = async (req: Request, res: Response) => {
    try {
        const turnId = req.params.id;
        const defaultValues = {
            action: '',
            weapon: null,
            custom: '',
            targetUnits: [],
            hitDiceRoll: 0,
            damageRoll: 0,
            bonusAction: false,
            reaction: false
        };

        const updatedTurn = await Turn.findByIdAndUpdate(turnId, defaultValues, { new: true, runValidators: true });
        if (updatedTurn) {
            res.status(200).json(updatedTurn);
        } else {
            res.status(404).json({ message: 'Turn not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Delete a turn
// @route DELETE /turns/:id
// @access Public
const deleteTurn = async (req: Request, res: Response) => {
    try {
        const turnId = req.params.id;
        const deletedTurn = await Turn.findByIdAndDelete(turnId);
        if (deletedTurn) {
            res.status(200).json({ message: 'Turn deleted' });
        } else {
            res.status(404).json({ message: 'Turn not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export { getTurnInformation, createTurn, resetTurnToDefault, updateTurn, deleteTurn };