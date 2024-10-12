import { Request, Response } from 'express';
import { IEncounter, Encounter } from '../models/encounterModel';
import { Turn } from '../models/turnModel';

// @desc Get a specific encounter
// @route GET /encounters/:id
// @access Public
const getEncounterInformation = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const encounter = await Encounter.findById(encounterId);
        if (encounter) {
            res.status(200).json(encounter);
        } else {
            res.status(404).send({ message: 'Encounter not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Create a new encounter
// @route POST /encounters
// @access Public
const createEncounter = async (req: Request, res: Response) => {
    try {
        const encounter = new Encounter(req.body);
        await encounter.save();
        res.status(201).json(encounter);
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Update an encounter
// @route PUT /encounters/:id
// @access Public
const updateEncounter = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const updatedData = req.body as Partial<IEncounter>;
        const updatedEncounter = await Encounter.findByIdAndUpdate(encounterId, updatedData, { new: true, runValidators: true });
        if (updatedEncounter) {
            res.status(200).json(updatedEncounter);
        } else {
            res.status(404).send({ message: 'Encounter not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Reset all turns in an encounter to default values
// @route PUT /encounters/:id/reset-turns
// @access Public
const resetTurnsInEncounter = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const encounter = await Encounter.findById(encounterId).populate('turns');

        if (!encounter) {
            return res.status(404).send({ message: 'Encounter not found' });
        }

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

        const resetTurns = await Promise.all(
            encounter.turns.map(async (turnId) => {
                return await Turn.findByIdAndUpdate(turnId, defaultValues, { new: true, runValidators: true });
            })
        );

        res.status(200).json(resetTurns);
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Delete an encounter
// @route DELETE /encounters/:id
// @access Public
const deleteEncounter = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const deletedEncounter = await Encounter.findByIdAndDelete(encounterId);
        if (deletedEncounter) {
            res.status(200).send({ message: 'Encounter deleted successfully' });
        } else {
            res.status(404).send({ message: 'Encounter not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

export {getEncounterInformation, createEncounter, resetTurnsInEncounter, updateEncounter, deleteEncounter };