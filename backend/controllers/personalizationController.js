const pool = require('../config/db'); 

function toPgArray(arr) {
  return arr && arr.length ? arr : null;
}

exports.updateInterests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categories } = req.body;

    if (!Array.isArray(categories))
      return res.status(400).json({ error: "categories must be an array" });

    await pool.query('DELETE FROM user_interests WHERE user_id = $1', [userId]);

    if (categories.length > 0) {
      await pool.query(
        `INSERT INTO user_interests (user_id, category)
         SELECT $1, unnest($2::text[])`,
        [userId, categories]
      );
    }

    return res.json({ message: "Interests updated" });
  } catch (err) {
    console.error("updateInterests ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { article_id, action } = req.body;

    if (!article_id || !action)
      return res.status(400).json({ error: "Missing fields" });

    await pool.query(
      'INSERT INTO user_activity (user_id, article_id, action) VALUES ($1, $2, $3)',
      [userId, article_id, action]
    );

    if (action === 'save') {
      await pool.query(
        `INSERT INTO saved_articles (user_id, article_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM saved_articles 
           WHERE user_id = $1 AND article_id = $2
         )`,
        [userId, article_id]
      );
    }

    return res.json({ message: "Activity logged" });
  } catch (err) {
    console.error("logActivity ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const interestRes = await pool.query(
      'SELECT category FROM user_interests WHERE user_id = $1',
      [userId]
    );
    const categories = interestRes.rows.map(r => r.category);

    const query = `
      SELECT n.*,
        (COALESCE(ai.score, 0) + 
         CASE WHEN n.category = ANY($1::text[]) THEN 2 ELSE 0 END
        ) AS total_score
      FROM news n
      LEFT JOIN (
        SELECT article_id, 
               SUM(CASE
                     WHEN action = 'save' THEN 3
                     WHEN action = 'click' THEN 2
                     WHEN action = 'view' THEN 1
                     ELSE 0
                   END) AS score
        FROM user_activity
        WHERE user_id = $2
        GROUP BY article_id
      ) ai ON ai.article_id = n.id
      ORDER BY total_score DESC NULLS LAST, n.published_at DESC
      LIMIT 50;
    `;

    const { rows } = await pool.query(
      query, 
      [categories.length ? categories : null, userId]
    );

    return res.json(rows);

  } catch (err) {
    console.error("getRecommendations ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
