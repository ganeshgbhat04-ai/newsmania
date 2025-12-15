async function loadAd() {
    try {
        let res = await fetch("https://ds9ck7p9-3000.inc1.devtunnels.ms/ads/random");
        let ad = await res.json();

        let box = document.getElementById("global-ad");
        if (!box) return;

        if (!ad || !ad.title) {
            box.innerHTML = "No advertisements available.";
            return;
        }

        box.innerHTML = `
            <div class="ad-card">
                <img src="${ad.image_url || 'assets/no-img.png'}" class="ad-img">
                <h4 class="ad-title">${ad.title}</h4>
                <p>${ad.summary || ""}</p>
                <a href="article.html?id=${ad.id}" class="ad-btn">View Ad</a>
            </div>
        `;
    } catch (error) {
        console.error("Ad Load Error:", error);
    }
}

loadAd();             
setInterval(loadAd, 10000);  
