document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeToggle").innerText = "☀️";
    }
});

document.addEventListener("click", (e) => {
    if (e.target.id === "themeToggle") {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            e.target.innerText = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            e.target.innerText = "🌙";
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const adminLink = document.getElementById("adminLink");
    const isAdmin = localStorage.getItem("is_admin");

    if (isAdmin == "1") {
        adminLink.style.display = "inline-block";
    } else {
        adminLink.style.display = "none";
    }
});
