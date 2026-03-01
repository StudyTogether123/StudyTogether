import { API_BASE } from "../config.js";

function getToken() {
    return localStorage.getItem("token");
}

function renderStatus(adminSection, type, message) {

    const iconMap = {
        info: "📊",
        warning: "⚠️",
        error: "❌"
    };

    adminSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Admin Dashboard</h2>

            <div class="status-card ${type}">
                <div class="status-icon">${iconMap[type]}</div>
                <p>${message}</p>
            </div>
        </div>
    `;
}

export async function loadDashboard() {

    document.querySelectorAll(".content-section")
        .forEach(sec => sec.classList.add("hidden-section"));

    let adminSection = document.getElementById("admin-section");

    if (!adminSection) {
        adminSection = document.createElement("section");
        adminSection.id = "admin-section";
        adminSection.classList.add("content-section");
        document.getElementById("main-content")
            .appendChild(adminSection);
    }

    adminSection.classList.remove("hidden-section");

    // Loading đẹp hơn
    renderStatus(adminSection, "info", "Đang tải dữ liệu...");

    try {

        const token = getToken();

        if (!token) throw new Error("NO_TOKEN");

        const response = await fetch(
            `${API_BASE}/admin/dashboard`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (response.status === 401) throw new Error("UNAUTHORIZED");
        if (!response.ok) throw new Error("SERVER_ERROR");

        const data = await response.json();

        const totalPosts = data.posts ?? 0;
        const totalQuiz = data.quizzes ?? 0;
        const totalUsers = data.users ?? 0;

        adminSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">Admin Dashboard</h2>

                <div class="admin-cards">

                    <div class="admin-card">
                        <h3>${totalPosts}</h3>
                        <p>Tổng Posts</p>
                    </div>

                    <div class="admin-card">
                        <h3>${totalQuiz}</h3>
                        <p>Tổng Quiz</p>
                    </div>

                    <div class="admin-card">
                        <h3>${totalUsers}</h3>
                        <p>Tổng Users</p>
                    </div>

                </div>
            </div>
        `;

    } catch (error) {

        if (error.message === "NO_TOKEN") {
            renderStatus(adminSection, "warning", "Bạn chưa đăng nhập.");
        }
        else if (error.message === "UNAUTHORIZED") {
            renderStatus(adminSection, "warning", "Bạn không có quyền truy cập trang Admin.");
        }
        else if (error.message === "SERVER_ERROR") {
            renderStatus(adminSection, "info", "Máy chủ đang khởi động lại. Vui lòng thử lại sau vài giây.");
        }
        else {
            renderStatus(adminSection, "error", "Chưa có dữ liệu để hiển thị.");
        }
    }
}