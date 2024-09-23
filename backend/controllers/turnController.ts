import { Request, Response } from 'express';
import { Turn } from '../models/turnModel';

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
        const newTurn = new Turn(req.body);
        const savedTurn = await newTurn.save();
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

export { getTurnInformation, createTurn, updateTurn, deleteTurn };