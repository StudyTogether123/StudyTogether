// ==========================================
// APP LOADER - SAFE VERSION (V1 + V2)
// ==========================================

(function () {
    console.log("App Loader initialized");

    const path = window.location.pathname;

    // ==========================================
    // 1️⃣ Nếu đang ở app-v2 → KHÔNG load app V1
    // ==========================================
    if (path.includes("app-v2")) {
        console.log("Inside app-v2 → Skip loading App V1");
        return;
    }

    // ==========================================
    // 2️⃣ Load App V1 (ES MODULE)
    // ==========================================
    loadMainApp();

    // ==========================================
    // 3️⃣ Setup UI (không phụ thuộc main.js)
    // ==========================================
    document.addEventListener("DOMContentLoaded", () => {
        setupUserUI();
    });

})();


// ==========================================
// LOAD MAIN APP (MODULE)
// ==========================================
function loadMainApp() {

    // Tránh load 2 lần
    if (document.getElementById("app-main-script")) return;

    const script = document.createElement("script");

    script.id = "app-main-script";
    script.type = "module";                  // ⭐ QUAN TRỌNG
    script.src = "./js/modules/main.js";     // ĐÚNG PATH
    script.defer = true;

    document.body.appendChild(script);
}


// ==========================================
// SETUP USER MENU + ROLE
// ==========================================
function setupUserUI() {

    const user = JSON.parse(localStorage.getItem("user"));

    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const displayUsername = document.getElementById("displayUsername");

    if (!authButtons || !userMenu) return;

    // ===== Nếu chưa login =====
    if (!user) {
        authButtons.style.display = "flex";
        userMenu.style.display = "none";
        return;
    }

    // ===== Nếu đã login =====
    authButtons.style.display = "none";
    userMenu.style.display = "block";

    if (displayUsername) {
        displayUsername.innerText = user.username || "User";
    }

    // ===== Nếu là admin =====
    if (user.role === "admin") {
        injectAdminButton();
    }
}


// ==========================================
// THÊM NÚT ADMIN
// ==========================================
function injectAdminButton() {

    const dropdown = document.getElementById("dropdownMenu");
    if (!dropdown) return;

    // Tránh duplicate
    if (document.getElementById("adminPanelBtn")) return;

    const adminLink = document.createElement("a");

    adminLink.href = "./admin.html";
    adminLink.id = "adminPanelBtn";
    adminLink.innerHTML = `
        <i class="fas fa-shield-alt"></i>
        Admin Panel
    `;

    dropdown.insertBefore(adminLink, dropdown.firstChild);
}