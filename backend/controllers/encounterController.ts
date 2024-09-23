import { Request, Response } from 'express';
import { IEncounter, Encounter } from '../models/encounterModel';

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
            res.status(404).json({ message: 'Encounter not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
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
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
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
            res.status(404).json({ message: 'Encounter not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
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
            res.status(200).json({ message: 'Encounter deleted successfully' });
        } else {
            res.status(404).json({ message: 'Encounter not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

export {getEncounterInformation, createEncounter, updateEncounter, deleteEncounter };