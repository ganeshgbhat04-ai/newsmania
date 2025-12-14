const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const pool = require("../config/db");

const {
    getOneArticle,
    createArticle,
    updateArticle
} = require("../controllers/adminController");

router.get("/articles", auth, admin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            "SELECT * FROM news ORDER BY id DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        const totalRes = await pool.query("SELECT COUNT(*) FROM news");

        res.json({
            articles: result.rows,
            total: parseInt(totalRes.rows[0].count),
            page
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load articles" });
    }
});

router.delete("/article/:id", auth, admin, async (req, res) => {
    try {
        await pool.query("DELETE FROM news WHERE id = $1", [req.params.id]);
        res.json({ message: "Article deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});

router.post("/article", auth, admin, createArticle);

router.put("/article/:id", auth, admin, updateArticle);

router.get("/article/:id", auth, admin, getOneArticle);

router.get("/users", auth, admin, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, is_admin FROM users"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load users" });
    }
});

router.delete("/user/:id", auth, admin, async (req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
        res.json({ message: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});


module.exports = router;
