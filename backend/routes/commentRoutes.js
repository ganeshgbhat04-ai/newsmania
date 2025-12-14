const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

// 1️⃣ Add Comment
router.post("/:articleId", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;
        const { comment } = req.body;

        if (!comment || comment.trim() === "") {
            return res.status(400).json({ error: "Comment cannot be empty" });
        }

        await pool.query(
            "INSERT INTO comments (user_id, article_id, comment) VALUES ($1, $2, $3)",
            [userId, articleId, comment]
        );

        res.json({ message: "Comment added" });
    } catch (err) {
        console.error("ADD COMMENT ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 2️⃣ Get Comments for Article
router.get("/:articleId", async (req, res) => {
    try {
        const articleId = req.params.articleId;

        const { rows } = await pool.query(
            `SELECT c.id, c.comment, c.created_at, u.name AS username
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.article_id = $1
             ORDER BY c.created_at DESC`,
            [articleId]
        );

        res.json(rows);
    } catch (err) {
        console.error("GET COMMENTS ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
