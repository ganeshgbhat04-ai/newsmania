async function loadTrending() {
    let box = document.getElementById("trending-container");
    box.innerHTML = "Loading...";

    let token = localStorage.getItem("token");
    let res = await fetch("http://localhost:3000/news/latest", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    let data = await res.json();

    let trending = data.slice(0, 8);

    box.innerHTML = "";
    trending.forEach(n => {
        let div = document.createElement("div");
        div.className = "trending-card";    

        div.innerHTML = `
            <img class="trending-img" src="${n.image_url || 'assets/no-img.png'}">
            <div class="trending-title">${n.title}</div>
            <div class="trending-source">${n.source || "Unknown Source"}</div>
        `;

        div.onclick = () => {
            window.location.href = `article.html?id=${n.id}`;
        };

        box.appendChild(div);
    });
}

async function loadCategory(cat) {
    document.getElementById("category-news").innerHTML = "Loading...";

    let token = localStorage.getItem("token");

    let res = await fetch(`http://localhost:3000/news/category/${cat}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    let data = await res.json();

    let box = document.getElementById("category-news");
    box.innerHTML = "";

    if (data.length === 0) {
        box.innerHTML = "<p>No news available for this category.</p>";
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
}

loadTrending();
