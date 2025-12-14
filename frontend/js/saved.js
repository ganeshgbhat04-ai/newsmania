async function loadSaved() {
    const token = localStorage.getItem("token");

    let res = await fetch("http://localhost:3000/saved/list", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    let data = await res.json();
    let box = document.getElementById("saved-list");

    box.innerHTML = "";

    if (data.length === 0) {
        box.innerHTML = "<p>No saved articles yet.</p>";
        return;
    }

    data.forEach(n => {
        let div = document.createElement("div");
        div.className = "news-card";

        div.innerHTML = `
            <img class="news-image" src="${n.image_url || 'assets/no-img.png'}" />
            <div class="news-content">
                <h3 class="news-title">${n.title}</h3>
                <p class="news-summary">${n.summary}</p>

                <a class="read-btn" href="article.html?id=${n.id}">Read</a>

                <button class="auth-btn" onclick="removeSaved(${n.id})">Remove</button>
            </div>
        `;
        box.appendChild(div);
    });
}

async function removeSaved(id) {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/saved/remove/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    loadSaved();
}

loadSaved();
