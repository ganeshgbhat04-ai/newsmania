const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      WITH interest AS (
        SELECT category FROM user_interests WHERE user_id = $1
      ),
      activity_score AS (
        SELECT article_id,
          SUM(
            CASE 
              WHEN action='save' THEN 3
              WHEN action='click' THEN 2
              WHEN action='view' THEN 1
              ELSE 0
            END
          ) AS score
        FROM user_activity
        WHERE user_id = $1
        GROUP BY article_id
      ),
      trending AS (
        SELECT id,
               3 AS trend_score
        FROM news
        WHERE published_at > NOW() - INTERVAL '3 hours'
      )
      SELECT n.*,
        ( COALESCE(a.score,0)
          + CASE WHEN n.category IN (SELECT category FROM interest) THEN 2 ELSE 0 END
          + COALESCE(t.trend_score,0)
          + CASE WHEN n.published_at > NOW() - INTERVAL '6 hours' THEN 2 ELSE 0 END
        ) AS total_score
      FROM news n
      LEFT JOIN activity_score a ON a.article_id = n.id
      LEFT JOIN trending t ON t.id = n.id
      ORDER BY total_score DESC, n.published_at DESC
      LIMIT 100;
    `;

    const { rows } = await pool.query(query, [userId]);
    return res.json(rows);

  } catch (err) {
    console.error("FEED ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
