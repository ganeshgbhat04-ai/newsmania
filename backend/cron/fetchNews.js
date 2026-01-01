const axios = require("axios");
const pool = require("../config/db");

function safe(text) {
  if (!text) return "";
  return String(text);
}
function trimText(text, max) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).split(" ").slice(0, -1).join(" ");
}
module.exports = async function fetchNewsJob() {
  try {
    const API_KEY = process.env.GNEWS_API_KEY;
    if (!API_KEY) {
      console.log("GNEWS_API_KEY missing — skipping fetch");
      return;
    }

    const normalTopics = [
      "india", "technology", "business", "sports", "world", "cultural"
    ];

    const adKeywords = [
      "advertisement", "advertisement campaign", "commercial", "promotion", "marketing", "brand campaign", "product launch", "ad release"
    ];

    const allTopics = [...normalTopics, ...adKeywords];

    for (const topic of allTopics) {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        topic
      )}&lang=en&max=10&apikey=${API_KEY}`;

      let resp;
      try {
        resp = await axios.get(url);
      } catch (err) {
        console.warn(`Fetch failed for topic "${topic}":`, err.message || err);
        continue;
      }

      const articles = resp.data?.articles || [];
      console.log(`Topic "${topic}" → fetched ${articles.length} articles`);

      for (const a of articles) {
        const title = safe(a.title);
        const content = safe(a.content);
        const summary = safe(a.description ? trimText(a.description, 300) : trimText(content || "", 300));
        const image = a.image || "";
        const urlArticle = a.url || "";
        const source = safe(a.source?.name || "unknown");
        const publishedAt = a.publishedAt ? new Date(a.publishedAt) : new Date();

        if (!urlArticle) continue;

        const isAdKeyword = adKeywords.some(k =>
          topic.toLowerCase().includes(k.toLowerCase())
        );

        const category = isAdKeyword ? "Advertisements" : topic;
        const language = "en";

        try {
          const exists = await pool.query(
            "SELECT id FROM news WHERE url = $1 LIMIT 1",
            [urlArticle]
          );
          if (exists.rows.length > 0) {
            continue;
          }
        } catch (dbErr) {
          console.error("DB check error:", dbErr);
          continue;
        }

        try {
          await pool.query(
            `INSERT INTO news
              (title, content, summary, image_url, category, source, url, published_at, language, created_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())`,
            [
              title,
              content,
              summary,
              image,
              category,
              source,
              urlArticle,
              publishedAt,
              language
            ]
          );
          console.log(`Inserted: [${category}] ${title}`);
        } catch (insertErr) {
          console.error("Insert error:", insertErr.message || insertErr);
        }
      }
    }

    console.log("fetchNewsJob finished");
  } catch (err) {
    console.error("Unexpected fetchNewsJob error:", err);
  }
};
