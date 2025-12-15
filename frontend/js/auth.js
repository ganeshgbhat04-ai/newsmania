async function registerUser() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    let res = await fetch("https://ds9ck7p9-3000.inc1.devtunnels.ms/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword })
    });

    let data = await res.json();

    if (data.error) {
        alert("⚠️ " + data.error);
    } else {
        alert("🎉 " + data.message);
        window.location.href = "login.html";
    }
}

async function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let res = await fetch("https://ds9ck7p9-3000.inc1.devtunnels.ms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    let data = await res.json();

    if (data.error) {
        alert("⚠️ " + data.error);
        return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.user.name);
    localStorage.setItem("email", data.user.email);     
    localStorage.setItem("is_admin", data.user.is_admin);

    alert("🎉 Login successful!");

    if (data.user.is_admin == 1) {
        window.location.href = "admin.html";
    } else {
        window.location.href = "index.html";
    }
}

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("is_admin");

    alert("Logged out successfully!");
    window.location.href = "login.html";
}

