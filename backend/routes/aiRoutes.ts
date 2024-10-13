import express from 'express';
import { importCharacterSheet } from "../controllers/aiController";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/import-character", upload.single('file'), importCharacterSheet);

export default router;
