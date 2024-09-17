import express from 'express';
import { importCharacterSheet } from "../controllers/aiController";

const router = express.Router();

router.post("/import-character", importCharacterSheet);

export default router;
