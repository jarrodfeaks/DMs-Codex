import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db";
import mongoose from "mongoose";
import playerRoutes from './routes/playerRoutes';
import aiRoutes from "./routes/aiRoutes";
import monsterRoutes from './routes/monsterRoutes';
import campaignRoutes from './routes/campaignRoutes';
import encounterRoutes from './routes/encounterRoutes';
import turnRoutes from './routes/turnRoutes';
import weaponRoutes from './routes/weaponRoutes';
import { auth } from "express-openid-connect";
import { importCharacterSheet } from "./controllers/aiController";
const PORT = process.env.PORT || 5000;
const BACKEND_URL = `http://localhost:${PORT}`;
const FRONTEND_URL = `http://localhost:${process.env.FRONTEND_PORT || 5173}`;

const app = express();

app.use(cors({ credentials: true }));

// Auth0 config
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: BACKEND_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    routes: {
        login: false,
        postLogoutRedirect: '/redirect'
    }
} as const;

app.use(auth(config));

app.use(express.json());

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/login', (req, res) => {
    res.oidc.login({ returnTo: '/redirect' });
});

app.get('/redirect', (req, res) => {
    res.redirect(FRONTEND_URL);
});

app.get('/profile', (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        res.status(401).json({ message: "User not authenticated" });
    }
    res.json(req.oidc.user);
});

db.connect();

app.get("/test", (req, res) => {
    res.json({ message: "Hello :)" });
});

app.use("/players", playerRoutes);
app.use("/ai", aiRoutes);
app.use("/monsters", monsterRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/encounters", encounterRoutes);
app.use("/turns", turnRoutes);
app.use("/weapons", weaponRoutes);

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
    // pass in fake data for testing
    importCharacterSheet({} as any, {} as any);
});
