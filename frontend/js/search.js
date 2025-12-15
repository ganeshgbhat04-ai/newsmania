let typingTimer;

async function searchNews(event) {
    const keyword = event.target.value.trim();
    const section = document.getElementById("search-section");
    const box = document.getElementById("search-results");

    if (keyword.length < 3) {
        section.style.display = "none";
        box.innerHTML = "";
        return;
    }

    clearTimeout(typingTimer);

    typingTimer = setTimeout(async () => {

        let token = localStorage.getItem("token");

        let res = await fetch(`https://ds9ck7p9-3000.inc1.devtunnels.ms/news/search/${keyword}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        let data = await res.json();

        section.style.display = "block";
        box.innerHTML = "";

        if (data.length === 0) {
            box.innerHTML = "<p>No results found.</p>";
            return;
        }

        data.forEach(n => {
            let div = document.createElement("div");
            div.className = "news-card";

            div.innerHTML = `
                <img class="news-image" src="${n.image_url || 'assets/no-img.png'}" />
                <div class="news-content">
                    <h3 class="news-title">${n.title}</h3>
                    <p class="news-summary">${n.summary || ""}</p>
                    <a class="read-btn" href="article.html?id=${n.id}">Read More</a>
                </div>
            `;

            box.appendChild(div);
        });

    }, 400);
}

document.addEventListener("click", (e) => {
    const section = document.getElementById("search-section");
    const searchInput = document.getElementById("searchInput");

    if (!section.contains(e.target) && !searchInput.contains(e.target)) {
        section.style.display = "none";
    }
});
