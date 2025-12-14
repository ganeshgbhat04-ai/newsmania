document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const isAdmin = localStorage.getItem("is_admin");

    const loginBtn = document.getElementById("loginBtn");
    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const profileInitial = document.getElementById("profileInitial");
    const profileName = document.getElementById("profileName");
    const adminMenuLink = document.getElementById("adminMenuLink");

    if (token) {
        loginBtn?.classList.add("hidden");
        profileBtn?.classList.remove("hidden");

        profileInitial.innerText = userName.charAt(0).toUpperCase();

        profileName.innerText = userName;

        if (isAdmin == "1") {
            adminMenuLink?.classList.remove("hidden");
        } else {
            adminMenuLink?.classList.add("hidden");
        }

    }
    else {
        loginBtn?.classList.remove("hidden");
        profileBtn?.classList.add("hidden");
    }
});

function toggleProfileMenu() {
    document.getElementById("profileMenu").classList.toggle("hidden");
}

function logoutUser() {
    localStorage.clear();
    window.location.href = "login.html";
}

document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-box")) {
        document.getElementById("profileMenu").classList.add("hidden");
    }
});
