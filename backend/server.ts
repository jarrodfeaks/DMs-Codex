import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

db.connect();

app.get("/test", (req, res) => {
    res.json({ message: "Hello :)" });
});

app.get("/test/db", async (req, res) => {
    try {
        const data = await mongoose.connection.db?.listCollections().toArray();
        res.json(data);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message });
    }
})

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
