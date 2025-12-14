const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { latest, getById, translate, downloadPdf } = require("../controllers/newsController");

router.get("/latest", latest);

router.get("/category/:cat", async (req, res) => {
    try {
        const category = req.params.cat.toLowerCase();

        const result = await pool.query(
            "SELECT * FROM news WHERE LOWER(category) = $1 ORDER BY id DESC",
            [category]
        );

        return res.json(result.rows);

    } catch (err) {
        console.error("CATEGORY ERROR:", err);
        return res.status(500).json({ error: "Failed to fetch category news" });
    }
});

router.get("/:id", getById);

router.post("/translate", translate);

router.get("/search/:query", async (req, res) => {
    try {
        const keyword = `%${req.params.query.toLowerCase()}%`;

        const result = await pool.query(
            `SELECT * FROM news 
             WHERE LOWER(title) LIKE $1 
             OR LOWER(summary) LIKE $1
             OR LOWER(content) LIKE $1
             ORDER BY published_at DESC 
             LIMIT 30`,
            [keyword]
        );

        return res.json(result.rows);

    } catch (err) {
        console.error("SEARCH ERROR:", err);
        return res.status(500).json({ error: "Search failed" });
    }
});

router.get("/:id/pdf", downloadPdf);

module.exports = router;
