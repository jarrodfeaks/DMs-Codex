import express from 'express';
import { importCharacterSheet, importRulebook } from "../controllers/aiController";
import multer from "multer";

const diskStorage = multer.diskStorage({
    destination: "/uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.pdf');
    }
})

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const diskUpload = multer({ storage: diskStorage });

router.post("/import/character", upload.single('file'), importCharacterSheet);

router.post("/import/rulebook", diskUpload.single('file'), importRulebook);

// router.post("/message", sendMessage);

export default router;
