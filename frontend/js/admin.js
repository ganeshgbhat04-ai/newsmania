let token = localStorage.getItem("token");
let currentPage = 1; 

if (!token || localStorage.getItem("is_admin") !== "1") {
    alert("Access denied — Admins only!");
    window.location.href = "login.html";
}

function showSection(id, ev) {
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");

    document.querySelectorAll(".sidebar nav a").forEach(a => a.classList.remove("active"));
    ev.target.classList.add("active");
}

async function loadDashboard() {
    try {
        let articles = await fetch(
            `http://localhost:3000/admin/articles?page=${currentPage}`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        let users = await fetch(
            "http://localhost:3000/admin/users",
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        let artData = await articles.json();
        let userData = await users.json();

        document.getElementById("totalArticles").innerText = artData.total;
        document.getElementById("totalUsers").innerText = userData.length;

        loadArticlesTable(artData.articles);
        loadUsersTable(userData);

        document.getElementById("pageNumber").innerText = currentPage;

    } catch (err) {
        console.error("Dashboard Load Error:", err);
    }
}

function loadArticlesTable(data) {
    let tbody = document.getElementById("articlesTable");
    tbody.innerHTML = "";

    data.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.title}</td>
                <td>${a.category}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editArticle(${a.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteArticle(${a.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function loadUsersTable(data) {
    let tbody = document.getElementById("usersTable");
    tbody.innerHTML = "";

    data.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.is_admin}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteUser(${u.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function deleteArticle(id) {
    if (!confirm("Delete this article?")) return;

    await fetch(`http://localhost:3000/admin/article/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    loadDashboard();
}

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    await fetch(`http://localhost:3000/admin/user/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    loadDashboard();
}

let editingId = null;

function showAddArticlePopup() {
    editingId = null;

    document.getElementById("popupTitle").innerText = "Add New Article";
    document.getElementById("popupTitleInput").value = "";
    document.getElementById("popupCategoryInput").value = "";
    document.getElementById("popupContentInput").value = "";
    document.getElementById("popupImageInput").value = "";

    document.getElementById("articlePopup").classList.remove("hidden");
}

async function editArticle(id) {
    editingId = id;

    let res = await fetch(`http://localhost:3000/admin/article/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    let a = await res.json();

    document.getElementById("popupTitle").innerText = "Edit Article";
    document.getElementById("popupTitleInput").value = a.title;
    document.getElementById("popupCategoryInput").value = a.category;
    document.getElementById("popupContentInput").value = a.content;
    document.getElementById("popupImageInput").value = a.image_url;

    document.getElementById("articlePopup").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("articlePopup").classList.add("hidden");
}

async function saveArticle() {
    let payload = {
        title: document.getElementById("popupTitleInput").value,
        category: document.getElementById("popupCategoryInput").value,
        content: document.getElementById("popupContentInput").value,
        image_url: document.getElementById("popupImageInput").value
    };

    let url = editingId
        ? `http://localhost:3000/admin/article/${editingId}`
        : "http://localhost:3000/admin/article";

    let method = editingId ? "PUT" : "POST";

    await fetch(url, {
        method,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    closePopup();
    loadDashboard();
}

function nextPage() {
    currentPage++;
    loadDashboard();
}

function prevPage() {
    if (currentPage > 1) currentPage--;
    loadDashboard();
}

loadDashboard();
