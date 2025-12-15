async function loadNews() {
    try {
        let box = document.getElementById("news-list");
        box.innerHTML = "<p>Loading...</p>";

        let token = localStorage.getItem("token");

        let res = await fetch("https://ds9ck7p9-3000.inc1.devtunnels.ms/news/latest", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        let data = await res.json();

        box.innerHTML = "";

        data.forEach(n => {
            let div = document.createElement("div");
            div.className = "news-card";

            div.innerHTML = `
                <img class="news-image" src="${n.image_url || 'assets/no-img.png'}" />

                <div class="news-content">
                    <h3 class="news-title">${n.title}</h3>
                    <p class="news-summary">${n.summary || ""}</p>

                    <a class="read-btn" href="article.html?id=${n.id}">
                        Read More
                    </a>
                </div>
            `;

            box.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        document.getElementById("news-list").innerText = "Error loading news.";
    }
}

loadNews();


