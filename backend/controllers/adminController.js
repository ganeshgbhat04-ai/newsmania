const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const userRes = await pool.query("SELECT COUNT(*) AS userCount FROM users");
    const articleRes = await pool.query("SELECT COUNT(*) AS articleCount FROM news");

    return res.json({
      userCount: userRes.rows[0].usercount,
      articleCount: articleRes.rows[0].articlecount
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, is_admin, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );

    return res.json(result.rows);

  } catch (err) {
    console.error("Users Load Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getOneArticle = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM news WHERE id = $1",
      [req.params.id]
    );

    return res.json(result.rows[0] || null);

  } catch (err) {
    console.error("Get One Article Error:", err);
    return res.status(500).json({ error: "Failed to fetch article" });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, category, content, image_url } = req.body;

    await pool.query(
      `INSERT INTO news (title, category, content, image_url) 
       VALUES ($1, $2, $3, $4)`,
      [title, category, content, image_url]
    );

    return res.json({ message: "Article created successfully" });

  } catch (err) {
    console.error("Create Article Error:", err);
    return res.status(500).json({ error: "Failed to create article" });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { title, category, content, image_url } = req.body;

    await pool.query(
      `UPDATE news 
       SET title = $1, category = $2, content = $3, image_url = $4 
       WHERE id = $5`,
      [title, category, content, image_url, req.params.id]
    );

    return res.json({ message: "Article updated successfully" });

  } catch (err) {
    console.error("Update Article Error:", err);
    return res.status(500).json({ error: "Failed to update article" });
  }
};
