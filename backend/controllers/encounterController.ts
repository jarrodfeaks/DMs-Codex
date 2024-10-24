import { Request, Response } from 'express';
import { IEncounter, Encounter } from '../models/encounterModel';
import { Turn } from '../models/turnModel';
import { Player } from '../models/playerModel';
import { Monster } from '../models/monsterModel';

// @desc Get a specific encounter
// @route GET /encounters/:id
// @access Public
const getEncounterInformation = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const encounter = await Encounter.findById(encounterId)
        .populate('turns')
        .populate('players')
        .populate('monsters');
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
        const { name, campaign_id } = req.body;
        const encounter = await Encounter.findOne({ name, campaign_id });
        if (encounter) {
            return res.status(200).json({ exists: true, message: 'Encounter already exists' });
        } else {
            const encounter = new Encounter(req.body);
            await encounter.save();
            res.status(201).json(encounter);
        }
    } catch (error: any) {
        console.error('Error checking encounter existence:', error);
        res.status(500).send({ message: 'Error checking encounter existence', error: error.message });
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

// @desc Get the combat log of an encounter
// @route GET /encounters/:id/combat-log
// @access Public
const getCombatLog = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;

        const encounter = await Encounter.findById(encounterId).select('combat_log');
        if (!encounter) {
            return res.status(404).json({ message: 'Encounter not found' });
        }

        res.status(200).json(encounter.combat_log);
    } catch (error: any) {
        console.error('Error retrieving combat log:', error);
        res.status(500).send({ message: 'Error retrieving combat log', error: error.message });
    }
};

// @desc Add a string to the combat log of an encounter
// @route PUT /encounters/:id/combat-log
// @access Public
const addToCombatLog = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const logEntry = req.body.logEntry;

        if (!logEntry || typeof logEntry !== 'string') {
            return res.status(400).send({ message: 'Invalid log entry' });
        }

        const encounter = await Encounter.findById(encounterId);
        if (encounter) {
            encounter.combat_log.push(logEntry);
            await encounter.save();
            res.status(200).json(encounter);
        } else {
            res.status(404).send({ message: 'Encounter not found' });
        }
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Add a character to the encounter
// @route PUT /encounters/:id/characters
// @access Public
const addCharacterToEncounter = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const { characterId } = req.body;

        if (!characterId) {
            return res.status(400).send({ message: 'Character ID is required' });
        }

        const encounter = await Encounter.findById(encounterId);
        if (!encounter) {
            return res.status(404).send({ message: 'Encounter not found' });
        }

        const player = await Player.findById(characterId);
        if (player) {
            encounter.players.push(characterId);
        } else {
            const monster = await Monster.findById(characterId);
            if (monster) {
                encounter.monsters.push(characterId);
            } else {
                return res.status(404).send({ message: 'Character not found in players or monsters' });
            }
        }

        await encounter.save();
        res.status(200).json(encounter);
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

// @desc Get the current turn info of an encounter
// @route GET /encounters/:id/current-turn
// @access Public
const getCurrentTurnInfo = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;

        const encounter = await Encounter.findById(encounterId).populate('current_turn');
        if (!encounter) {
            return res.status(404).json({ message: 'Encounter not found' });
        }

        const currentTurnId = encounter.current_turn;
        if (!currentTurnId) {
            return res.status(404).json({ message: 'Current turn not set' });
        }

        // Check if the current turn is a player
        let character = await Player.findById(currentTurnId);
        if (character) {
            return res.status(200).json({ character });
        }

        // Check if the current turn is a monster
        character = await Monster.findById(currentTurnId);
        if (character) {
            return res.status(200).json({ character });
        }

        return res.status(404).json({ message: 'Character not found in players or monsters' });
    } catch (error: any) {
        console.error('Error retrieving current turn info:', error);
        res.status(500).send({ message: 'Error retrieving current turn info', error: error.message });
    }
};

// @desc Update the current turn in an encounter
// @route PUT /encounters/:id/current-turn
// @access Public
const updateCurrentTurn = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const { currentTurnId } = req.body;

        const encounter = await Encounter.findById(encounterId);
        if (!encounter) {
            return res.status(404).send({ message: 'Encounter not found' });
        }

        // Validate that the currentTurnId is found in either the monsters or players list
        const isValidTurnId = encounter.monsters.includes(currentTurnId) || encounter.players.includes(currentTurnId);
        if (!isValidTurnId) {
            return res.status(400).send({ message: 'Invalid currentTurnId. It must be a valid monster or player ID in the encounter.' });
        }

        encounter.current_turn = currentTurnId;
        await encounter.save();

        res.status(200).json(encounter);
    } catch (error: any) {
        console.error(error.stack);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
    }
};

// @desc Update initiative order in an encounter
// @route PUT /encounters/:id/initiative-order
// @access Public
const updateInitiativeOrder = async (req: Request, res: Response) => {
    try {
        const encounterId = req.params.id;
        const { initiative_order } = req.body;
        if (!initiative_order) {
            return res.status(400).send({ message: 'initiative_order missing' });
        }
        const encounter = await Encounter.findById(encounterId);
        if (!encounter) {
            return res.status(404).send({ message: 'Encounter not found' });
        }
        encounter.initiative_order = initiative_order;
        await encounter.save();
        res.status(200).json(encounter);
    } catch (error: any) {
        res.status(500).send(error.message);
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

export {addToCombatLog, addCharacterToEncounter, getEncounterInformation, getCombatLog, getCurrentTurnInfo, createEncounter, resetTurnsInEncounter, updateEncounter, deleteEncounter, updateCurrentTurn, updateInitiativeOrder };