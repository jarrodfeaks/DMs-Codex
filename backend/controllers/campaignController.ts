import { Request, Response } from 'express';
import { Campaign } from '../models/campaignModel';
import { Player } from '../models/playerModel';
import { Monster } from '../models/monsterModel';
import { Encounter } from '../models/encounterModel';

// @desc Get all campaigns
// @route GET /campaigns/
// @access Public
const getAllCampaigns = async (req: Request, res: Response) => {
    try {
        const campaigns = await Campaign.find({})
        .populate('encounters')
        .populate({
            path: 'players',
            select: '_id name level class currentHitpoints maxHitpoints tempHitpoints armorClass deathSavingThrows'
        })
        .populate({
            path: 'monsters',
            select: '_id name level class currentHitpoints maxHitpoints tempHitpoints armorClass deathSavingThrows'
        });
        res.status(200).json(campaigns);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get all campaigns for a specific DM
// @route GET /campaigns/dm/:dmId
// @access Public
const getDMCampaigns = async (req: Request, res: Response) => {
    try {
        const dmId = req.params.dmId;

        // Check if the DM id exists in the database
        const dmExists = await Campaign.find({ dmId: dmId });
        if (!dmExists) {
            return res.status(200).json([]);
        }

        const campaigns = await Campaign.find({ dmId: dmId })
            .populate('encounters')
            .populate('players')
            .populate('monsters')

        if (campaigns.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(campaigns);
    } catch (error: any) {
        console.error('Error retrieving campaigns:', error);
        res.status(500).send({ message: 'Error retrieving campaigns', error: error.message });
    }
};

// @desc Get a specific campaign with players brief information
// @route GET /campaigns/dm/:dmId/brief
// @access Public
const getCampaignWithPlayersBrief = async (req: Request, res: Response) => {
    try {
        const campaignId = req.params.id;
        const campaign = await Campaign.findById(campaignId).populate('players', '_id name level class');
        if (campaign) {
            res.status(200).json(campaign);
        } else {
            res.status(404).send({ message: 'Campaign not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Get a specific campaign
// @route GET /campaigns/:id
// @access Public
const getCampaignInformation = async (req: Request, res: Response) => {
    try {
        const campaignId = req.params.id;
        const campaign = await Campaign.findById(campaignId)
        .populate('encounters')
        .populate('players')
        .populate('monsters');
        if (campaign) {
            res.status(200).json(campaign);
        } else {
            res.status(404).send({ message: 'Campaign not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Create a new campaign
// @route POST /campaigns
// @access Public
const createCampaign = async (req: Request, res: Response) => {
    try {
        const newCampaign = new Campaign(req.body);
        if (!newCampaign.dmId) {
            return res.status(400).send({ message: 'DM ID is required' });
        }
        const savedCampaign = await newCampaign.save();
        res.status(201).json(savedCampaign);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Update a campaign
// @route PUT /campaigns/:id
// @access Public
const updateCampaign = async (req: Request, res: Response) => {
    try {
        const campaignId = req.params.id;
        const updatedCampaign = await Campaign.findByIdAndUpdate(campaignId, req.body, { new: true });
        if (updatedCampaign) {
            res.status(200).json(updatedCampaign);
        } else {
            res.status(404).send({ message: 'Campaign not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Add a player to a campaign
// @route POST /campaigns/:id/players
// @access Public
const addPlayerToCampaign = async (req: Request, res: Response) => {
    try {
        const campaignId = req.params.id;
        const { playerId } = req.body;
        if (!playerId) {
            return res.status(404).send({ message: 'playerId missing' });
        }
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).send({ message: 'Player not found' });
        }
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).send({ message: 'Campaign not found' });
        }
        campaign.players.push(playerId);
        await campaign.save();
        res.status(200).json(campaign);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Add a monster to a campaign
// @route POST /campaigns/:id/monsters
// @access Public
const addMonsterToCampaign = async (req: Request, res: Response) => {
    try {
        const campaignId = req.params.id;
        const { monsterId } = req.body;
        if (!monsterId) {
            return res.status(404).send({ message: 'monsterId missing' });
        }
        const monster = await Monster.findById(monsterId);
        if (!monster) {
            return res.status(404).send({ message: 'Monster not found' });
        }
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).send({ message: 'Campaign not found' });
        }
        campaign.monsters.push(monsterId);
        await campaign.save();
        res.status(200).json(campaign);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

// @desc Add an encounter to a campaign
// @route POST /campaigns/:id/encounters
// @access Public
const addEncounterToCampaign = async (req: Request, res: Response) => {
    try {
        const campaignId = req.params.id;
        const { encounterId } = req.body;
        if (!encounterId) {
            return res.status(404).send({ message: 'encounterId missing' });
        }
        const encounter = await Encounter.findById(encounterId);
        if (!encounter) {
            return res.status(404).send({ message: 'Encounter not found' });
        }
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).send({ message: 'Campaign not found' });
        }
        if (campaign.encounters.includes(encounterId)) {
            return res.status(400).send({ message: 'Encounter already in campaign' });
        }
        campaign.encounters.push(encounterId);
        await campaign.save();
        res.status(200).json(campaign);
    } catch (error: any) {
        res.status(500).send(error.message); 
    }
};

// @desc Delete a campaign
// @route DELETE /campaigns/:id
// @access Public
const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const campaignId = req.params.id;
        const deletedCampaign = await Campaign.findByIdAndDelete(campaignId);
        if (deletedCampaign) {
            res.status(200).send({ message: 'Campaign deleted' });
        } else {
            res.status(404).send({ message: 'Campaign not found' });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};

export { getAllCampaigns, getCampaignInformation, getCampaignWithPlayersBrief, getDMCampaigns, createCampaign, updateCampaign, deleteCampaign, addMonsterToCampaign, addPlayerToCampaign, addEncounterToCampaign };