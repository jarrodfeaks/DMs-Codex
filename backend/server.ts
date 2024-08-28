import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({ message: "Hello :)" });
})

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
