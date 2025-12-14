const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/random", async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM news
             WHERE LOWER(category) = 'advertisements'
             ORDER BY RANDOM()
             LIMIT 1`
        );
        res.json(rows[0] || {});
    } catch (err) {
        console.error("ADS ERROR:", err);
        res.status(500).json({ error: "Failed to load ad" });
    }
});

module.exports = router;
