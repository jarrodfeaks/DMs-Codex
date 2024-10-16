import { Request, Response } from 'express';
import { Campaign } from '../models/campaignModel';

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
        const campaigns = await Campaign.find({ dmId: dmId })
        .populate('encounters')
        .populate('players')
        .populate('monsters');
        if (campaigns.length > 0) {
            res.status(200).json(campaigns);
        } else {
            res.status(404).send({ message: `No campaigns found for this ${dmId}` });
        }
    } catch (error: any) {
        res.status(500).send(error.message);
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

export { getAllCampaigns, getCampaignInformation, getCampaignWithPlayersBrief, getDMCampaigns, createCampaign, updateCampaign, deleteCampaign };