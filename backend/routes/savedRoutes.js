const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

router.post("/save/:articleId", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;

        await pool.query(
            `INSERT INTO saved_articles (user_id, article_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, article_id) DO NOTHING`,
            [userId, articleId]
        );

        await pool.query(
            `INSERT INTO user_activity (user_id, article_id, action)
             VALUES ($1, $2, 'save')`,
            [userId, articleId]
        );

        res.json({ message: "Article saved!" });
    } catch (err) {
        console.error("SAVE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/remove/:articleId", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;

        await pool.query(
            "DELETE FROM saved_articles WHERE user_id = $1 AND article_id = $2",
            [userId, articleId]
        );

        res.json({ message: "Removed from saved." });
    } catch (err) {
        console.error("REMOVE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/list", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT n.*
             FROM saved_articles s
             JOIN news n ON s.article_id = n.id
             WHERE s.user_id = $1
             ORDER BY s.saved_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("LIST ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
