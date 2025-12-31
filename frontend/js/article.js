const BASE = "https://ds9ck7p9-3000.inc1.devtunnels.ms";

async function loadArticle() {
    try {
        let params = new URLSearchParams(location.search);
        let id = params.get("id");

        let token = localStorage.getItem("token");

        let res = await fetch(`${BASE}/news/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            alert("Failed to load article");
            return;
        }

        let a = await res.json();

        document.getElementById("title").innerText = a.title || "";

        const contentEl = document.getElementById("content");
        const originalLink = document.getElementById("originalLink");

        let content = a.content || "";

        const charsPattern = /\[\d+\s*chars\]/;

        if (charsPattern.test(content)) {
            content = content.replace(
                charsPattern,
                `<br><a href="${a.url}" target="_blank" class="read-original">Read More →</a>`
            );

            originalLink.style.display = "none";
        } else {
            originalLink.href = a.url;
            originalLink.style.display = "inline-block";
        }

        contentEl.innerHTML = content;

        document.getElementById("summary").innerText =
            a.summary || "No summary available";

        document.getElementById("image").src =
            a.image_url || "assets/no-img.png";

        logActivity(id, "view");

    } catch (err) {
        console.error("loadArticle error:", err);
    }
}

async function translateNow() {
    let summaryText = document.getElementById("summary").innerText;
    let lang = document.getElementById("lang").value;

    let token = localStorage.getItem("token");

    document.getElementById("translated").innerText = "⏳ Translating summary...";

    let res = await fetch(`${BASE}/news/translate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: summaryText, target: lang })
    });

    let data = await res.json();
    document.getElementById("translated").innerText = data.translatedText;
}

async function saveArticle() {
    let params = new URLSearchParams(location.search);
    let id = params.get("id");
    let token = localStorage.getItem("token");

    let res = await fetch(`${BASE}/saved/save/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });

    let data = await res.json();
    alert(data.message);

    logActivity(id, "save");
}

async function saveInterests(categories) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE}/personalize/interests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ categories })
    });
    return await res.json();
}

async function logActivity(article_id, action) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${BASE}/personalize/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ article_id, action })
        });
    } catch (e) {
        console.error('Could not log activity', e);
    }
}

async function loadRecommendations() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE}/personalize/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) return console.error('Failed to load recommendations');

    const articles = await res.json();
    const container = document.getElementById('recommendations');
    container.innerHTML = '';

    articles.forEach(n => {
        const el = document.createElement('div');
        el.className = 'rec';
        el.innerHTML = `
            <h4>${n.title}</h4>
            <p>${n.summary || ''}</p>
            <a href="/frontend/article.html?id=${n.id}" onclick="logActivity(${n.id}, 'click')">Read</a>
        `;
        container.appendChild(el);
    });
}

async function loadComments() {
    let params = new URLSearchParams(location.search);
    let id = params.get("id");

    let res = await fetch(`https://ds9ck7p9-3000.inc1.devtunnels.ms/comments/${id}`);
    let comments = await res.json();

    let box = document.getElementById("comment-list");
    box.innerHTML = "";

    if (comments.length === 0) {
        box.innerHTML = "<p>No comments yet.</p>";
        return;
    }

    comments.forEach(c => {
        box.innerHTML += `
            <div class="comment-item">
                <div class="comment-user">${c.username}</div>
                <div>${c.comment}</div>
                <div class="comment-time">${new Date(c.created_at).toLocaleString()}</div>
            </div>
        `;
    });
}

async function postComment() {
    let params = new URLSearchParams(location.search);
    let id = params.get("id");

    let token = localStorage.getItem("token");
    let text = document.getElementById("commentText").value;

    if (!text.trim()) {
        alert("Comment cannot be empty");
        return;
    }

    let res = await fetch(`https://ds9ck7p9-3000.inc1.devtunnels.ms/comments/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ comment: text })
    });

    let data = await res.json();

    if (res.ok) {
        document.getElementById("commentText").value = "";
        loadComments(); 
    } else {
        alert(data.error);
    }
}

function downloadPdf() {
    let params = new URLSearchParams(location.search);
    let id = params.get("id");

    window.open(`https://ds9ck7p9-3000.inc1.devtunnels.ms/news/${id}/pdf`, "_blank");
}

loadArticle();
loadComments();
