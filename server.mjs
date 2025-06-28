import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { search } from "./search.mjs";
import { inferResults } from "./infer.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.post("/api/search", async (req, res) => {
    const query = req.body.query;
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }
    try {
        const searchResults = await search(query);
        res.json(searchResults);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to perform search" });
    }
});

app.post("/api/infer", async (req, res) => {
    const { songs, query } = req.body;
    if (!songs || !query) {
        return res.status(400).json({ error: "Songs and query are required" });
    }
    try {
        const inferenceResults = await inferResults(songs, query);
        res.json({suggestions: inferenceResults});
    } catch (error) {
        console.error("Inference error:", error);
        res.status(500).json({ error: "Failed to perform inference" });
    }
});

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Export the app for testing or further use
export default app;