import express from 'express';
import { deleteCampaign, getAllCampaigns, getCampaignInformation, createCampaign, updateCampaign } from '../controllers/campaignController';

const router = express.Router();

router.route('/')
    .post(createCampaign);
router.route('/:id')
    .get(getCampaignInformation)
    .post(updateCampaign)
    .delete(deleteCampaign);
router.route('/dm/:id')
    .get(getAllCampaigns);

export default router;