import express from 'express';
import { importCharacterSheet, importRulebook, deleteRulebook, createChat, getChat } from "../controllers/aiController";
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

router.route("/chat/:threadId").get(getChat).post(sendMessage);
router.post("/chat/new", createChat);

export default router;
