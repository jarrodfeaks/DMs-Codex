import express from 'express';
import { addMonsterToCampaign, addPlayerToCampaign,deleteCampaign, getAllCampaigns, getCampaignInformation, getCampaignWithPlayersBrief, getDMCampaigns, createCampaign, updateCampaign } from '../controllers/campaignController';

const router = express.Router();

router.route('/')
    .get(getAllCampaigns)
    .post(createCampaign);
router.route('/:id/monsters')
    .post(addMonsterToCampaign);
router.route('/:id/players')
    .post(addPlayerToCampaign);
router.route('/:id/players/brief')
    .get(getCampaignWithPlayersBrief);
router.route('/dm/:dmId')
    .get(getDMCampaigns);
router.route('/:id')
    .get(getCampaignInformation)
    .put(updateCampaign)
    .delete(deleteCampaign);


export default router;