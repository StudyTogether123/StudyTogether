import { renderAdminMenu } from "./components/adminMenu.js";
import { loadDashboard } from "./modules/dashboard.js";

document.addEventListener("DOMContentLoaded", initAdmin);


/* ========================
   INIT ADMIN
======================== */
function initAdmin() {

    const role = localStorage.getItem("role");

    if (role !== "admin") return;

    enableAdminMode();
    addAdminBadge();
    renderAdminMenu();
    setupRouter();
    setupLogoutWatcher();

    // Load mặc định dashboard
    loadDashboard();
}


/* ========================
   BẬT ADMIN MODE
======================== */
function enableAdminMode() {
    document.body.classList.add("admin-mode");
}


/* ========================
   BADGE ADMIN
======================== */
function addAdminBadge() {

    const logo = document.querySelector(".logo");
    if (!logo) return;

    if (logo.querySelector(".admin-badge")) return;

    const badge = document.createElement("span");
    badge.className = "admin-badge";
    badge.textContent = "ADMIN";

    logo.appendChild(badge);
}


/* ========================
   ROUTER ADMIN
======================== */
function setupRouter() {

    document.body.addEventListener("click", handleRoute);
}

function handleRoute(e) {

    const link = e.target.closest("[data-page]");
    if (!link) return;

    e.preventDefault();

    const page = link.dataset.page;

    switch (page) {
        case "dashboard":
            loadDashboard();
            break;

        case "post":
            console.log("Load post page");
            break;

        case "quiz":
            console.log("Load quiz page");
            break;

        case "user":
            console.log("Load user page");
            break;

        case "report":
            import('./modules/report.module.js').then(module => {
                module.loadReports();
            });
            break;

        default:
            loadDashboard();
    }
}


/* ========================
   WATCH LOGOUT
======================== */
function setupLogoutWatcher() {

    document.body.addEventListener("click", (e) => {

        if (!e.target.closest("#logoutBtn")) return;

        cleanAdminUI();
        window.location.href = "../index.html";
    });
}


/* ========================
   CLEAN ADMIN UI
======================== */
function cleanAdminUI() {

    const badge = document.querySelector(".admin-badge");
    if (badge) badge.remove();

    document.body.classList.remove("admin-mode");
}