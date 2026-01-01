const pool = require('../config/db');
const axios = require('axios');
const PDFDocument = require("pdfkit");

const latest = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, title, summary, image_url, category, source, published_at 
             FROM news 
             ORDER BY published_at DESC 
             LIMIT 50`
        );

        return res.json(rows);

    } catch (err) {
        console.error("LATEST NEWS ERROR:", err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getById = async (req, res) => {
    try {
        const id = req.params.id;

        const { rows } = await pool.query(
            "SELECT * FROM news WHERE id = $1",
            [id]
        );

        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });

        return res.json(rows[0]);

    } catch (err) {
        console.error("GET NEWS ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

const translate = async (req, res) => {
    try {
        const { text, target } = req.body;

        if (!text || !target)
            return res.status(400).json({ error: "Missing text or target language" });

        const prompt = `
Translate the following NEWS SUMMARY into the language: ${target}.
Return a single readable paragraph.
Do not add explanations or extra text.
Only return the translated content.

"${text}"
`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            }
        );

        const translated =
            response.data.candidates?.[0]?.content?.parts?.[0]?.text || text;

        return res.json({ translatedText: translated });

    } catch (err) {
        console.error("TRANSLATE ERROR:", err.response?.data || err);
        return res.status(500).json({ error: "Translation failed" });
    }
};

const downloadPdf = async (req, res) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query(
            "SELECT title, summary, image_url FROM news WHERE id = $1",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Article not found" });
        }

        const article = rows[0];

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="news_${id}.pdf"`
        );

        doc.pipe(res);

        doc.fontSize(18).text(article.title, { align: "center" });
        doc.moveDown(1);

        if (article.image_url) {
            try {
                const imgRes = await axios.get(article.image_url, {
                    responseType: "arraybuffer"
                });
                doc.image(imgRes.data, {
                    fit: [450, 250],
                    align: "center"
                });
                doc.moveDown(1);
            } catch (imgErr) {
                console.warn("Image load failed, skipping image");
            }
        }

        doc.fontSize(12).text(article.summary, {
            align: "justify"
        });

        doc.end();

    } catch (err) {
        console.error("PDF ERROR:", err);
        res.status(500).json({ error: "PDF generation failed" });
    }
};


module.exports = { latest, getById, translate, downloadPdf};
