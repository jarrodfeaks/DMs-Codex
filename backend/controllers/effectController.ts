import { Request, Response } from 'express';
import { IEffect, Effect } from '../models/effectModel';

// @desc Get all effects
// @route GET /effects
// @access Public
const getAllEffects = async (req: Request, res: Response) => {
    try {
        const effects = await Effect.find({}) as IEffect[];
        res.status(200).send(effects);
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Get a specific effect
// @route GET /effects/:id
// @access Public
const getEffectInformation = async (req: Request, res: Response) => {
    try {
        const effectId = req.params.id;
        const effect = await Effect.findById(effectId);
        if (effect) {
            res.status(200).json(effect);
        } else {
            res.status(404).json({ message: 'Effect not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Create a new effect
// @route POST /effects
// @access Public
const createEffect = async (req: Request, res: Response) => {
    try {
        const effect = new Effect(req.body);
        await effect.save();
        res.status(201).json(effect);
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Update an effect
// @route PUT /effects/:id
// @access Public
const updateEffect = async (req: Request, res: Response) => {
    try {
        const effectId = req.params.id;
        const updatedData = req.body as Partial<IEffect>;
        const updatedEffect = await Effect.findByIdAndUpdate(effectId, updatedData, { new: true, runValidators: true });
        if (updatedEffect) {
            res.status(200).json(updatedEffect);
        } else {
            res.status(404).json({ message: 'Effect not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Delete an effect
// @route DELETE /effects/:id
// @access Public
const deleteEffect = async (req: Request, res: Response) => {
    try {
        const effectId = req.params.id;
        const deletedEffect = await Effect.findByIdAndDelete(effectId);
        if (deletedEffect) {
            res.status(200).json({ message: 'Effect deleted successfully' });
        } else {
            res.status(404).json({ message: 'Effect not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

export { getAllEffects, getEffectInformation, createEffect, updateEffect, deleteEffect };