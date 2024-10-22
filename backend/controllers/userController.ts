import { Request, Response } from 'express';
import User from '../models/userModel';

// @desc Create a new user
// @route POST /users
// @access Public
const createUser = async (req: Request, res: Response) => {
    try {
        const { rulebookId, dmId } = req.body;

        const existingUser = await User.findOne({ $or: [{ rulebookId }, { dmId }] });
        if (existingUser) {
            return res.status(400).json({ message: 'rulebookId or dmId already exists' });
        }

        const newUser = new User({
            rulebookId,
            dmId
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error: any) {
        console.error('Error creating user:', error);
        res.status(500).send({ message: 'Error creating user', error: error.message });
    }
};

// @desc Get user rulebookId by dmId
// @route GET /users/:dmId/rulebook
// @access Public
const getRuleBookIdByDmId = async (req: Request, res: Response) => {
    try {
        const dmId = req.params.dmId;

        const user = await User.findOne({ dmId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error: any) {
        console.error('Error retrieving user by dmId:', error);
        res.status(500).send({ message: 'Error retrieving user by dmId', error: error.message });
    }
};

// @desc Update the rulebookId for a user
// @route PUT /users/:dmId/rulebook
// @access Public
const updateRulebookId = async (req: Request, res: Response) => {
    try {
        const dmId = req.params.dmId;
        const { rulebookId } = req.body;

        const user = await User.findOne({ dmId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.rulebookId = rulebookId;
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error('Error updating rulebookId:', error);
        res.status(500).send({ message: 'Error updating rulebookId', error: error.message });
    }
};

export { createUser, updateRulebookId, getRuleBookIdByDmId };