import express from 'express';
import { importCharacterSheet, importRulebook, deleteRulebook, createChat, getChat, getRulebook, sendMessage, sendCompletion } from "../controllers/aiController";
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

router.post("/character/import", upload.single('file'), importCharacterSheet);

router.post("/rulebook/import", diskUpload.single('file'), importRulebook);
router.route("/rulebook/:dmId").get(getRulebook).delete(deleteRulebook);

// chat completions endpoints
// used for assistant encounter and general modes
router.post("/chat/completion", sendCompletion);

// assistant endpoints
// used for assistant rule inquiry mode
router.post("/chat/new", createChat);
router.route("/chat/:threadId").get(getChat).post(sendMessage);

export default router;
