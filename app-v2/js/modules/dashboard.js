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

function renderDashboard(adminSection, data) {
    const { posts = 0, quizzes = 0, users = 0 } = data;

    // Dữ liệu giả cho biểu đồ và hoạt động gần đây (có thể thay bằng API thật sau)
    const chartData = [
        { label: 'Bài viết', value: posts, color: 'primary' },
        { label: 'Quiz', value: quizzes, color: 'secondary' },
        { label: 'Người dùng', value: users, color: 'success' }
    ];

    const recentActivities = [
        { icon: 'fa-file-alt', title: 'Bài viết mới: "Kỹ năng mềm"', time: '5 phút trước', user: 'admin' },
        { icon: 'fa-question-circle', title: 'Quiz mới: "Đàm phán"', time: '2 giờ trước', user: 'admin' },
        { icon: 'fa-user-plus', title: 'Người dùng mới: Nguyễn Văn A', time: '1 ngày trước', user: 'system' },
    ];

    const recentPosts = [
        { title: 'Kỹ năng mềm', author: 'Admin', views: 120, status: 'active' },
        { title: 'Quản lý thời gian', author: 'Admin', views: 85, status: 'active' },
        { title: 'BATNA là gì?', author: 'Admin', views: 210, status: 'locked' },
    ];

    adminSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Admin Dashboard</h2>

            <!-- Stats Cards -->
            <div class="admin-dashboard">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
                    <div class="stat-content">
                        <div class="stat-label">Tổng bài viết</div>
                        <div class="stat-value">${posts}</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i> 12% so với tháng trước
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-question-circle"></i></div>
                    <div class="stat-content">
                        <div class="stat-label">Tổng Quiz</div>
                        <div class="stat-value">${quizzes}</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i> 8% so với tháng trước
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <div class="stat-label">Tổng người dùng</div>
                        <div class="stat-value">${users}</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i> 5% so với tháng trước
                        </div>
                    </div>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-icon"><i class="fas fa-eye"></i></div>
                    <div class="stat-content">
                        <div class="stat-label">Lượt xem</div>
                        <div class="stat-value">1,234</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i> 15% so với tháng trước
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts and Recent Activities -->
            <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Chart Section -->
                <div class="chart-section">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-bar"></i> Thống kê nội dung</h3>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-color primary"></span> Bài viết
                            </div>
                            <div class="legend-item">
                                <span class="legend-color secondary"></span> Quiz
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #10b981;"></span> Người dùng
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <div class="chart-bar-group">
                            ${chartData.map(item => `
                                <div class="chart-bar-item">
                                    <span class="chart-bar-label">${item.label}</span>
                                    <div class="chart-bar-wrapper">
                                        <div class="chart-bar" style="width: ${Math.min(100, (item.value / 100) * 100)}%;">
                                            ${item.value}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Recent Activities Timeline -->
                <div class="recent-section">
                    <div class="recent-header">
                        <h3><i class="fas fa-history"></i> Hoạt động gần đây</h3>
                        <a href="#" class="view-all-link">Xem tất cả <i class="fas fa-arrow-right"></i></a>
                    </div>
                    <div class="timeline">
                        ${recentActivities.map(activity => `
                            <div class="timeline-item">
                                <div class="timeline-icon">
                                    <i class="fas ${activity.icon}"></i>
                                </div>
                                <div class="timeline-content">
                                    <div class="timeline-title">${activity.title}</div>
                                    <div class="timeline-meta">
                                        <span><i class="fas fa-clock"></i> ${activity.time}</span>
                                        <span><i class="fas fa-user"></i> ${activity.user}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Recent Posts -->
            <div class="recent-section" style="margin-top: 24px;">
                <div class="recent-header">
                    <h3><i class="fas fa-file-alt"></i> Bài viết gần đây</h3>
                    <a href="#" class="view-all-link">Quản lý bài viết <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="post-list">
                    ${recentPosts.map(post => `
                        <div class="post-item">
                            <div class="post-info">
                                <div class="post-avatar">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="post-details">
                                    <h4>${post.title}</h4>
                                    <p>
                                        <i class="fas fa-user"></i> ${post.author}
                                        <i class="fas fa-eye"></i> ${post.views} lượt xem
                                    </p>
                                </div>
                            </div>
                            <div class="post-status">
                                <span class="badge ${post.status === 'active' ? 'badge-active' : 'badge-locked'}">
                                    <i class="fas ${post.status === 'active' ? 'fa-check-circle' : 'fa-lock'}"></i>
                                    ${post.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
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
        document.getElementById("main-content").appendChild(adminSection);
    }

    adminSection.classList.remove("hidden-section");

    // Hiển thị loading skeleton
    adminSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Admin Dashboard</h2>
            <div class="admin-dashboard">
                ${Array(4).fill(0).map(() => `
                    <div class="stat-card skeleton">
                        <div class="stat-icon skeleton"></div>
                        <div class="stat-content">
                            <div class="skeleton-text" style="width: 60%;"></div>
                            <div class="skeleton-text" style="width: 40%;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
                <div class="chart-section skeleton" style="height: 200px;"></div>
                <div class="recent-section skeleton" style="height: 200px;"></div>
            </div>
        </div>
    `;

    try {
        const token = getToken();
        if (!token) throw new Error("NO_TOKEN");

        const response = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (response.status === 401) throw new Error("UNAUTHORIZED");
        if (!response.ok) throw new Error("SERVER_ERROR");

        const data = await response.json();
        renderDashboard(adminSection, data);
    } catch (error) {
        if (error.message === "NO_TOKEN") {
            renderStatus(adminSection, "warning", "Bạn chưa đăng nhập.");
        } else if (error.message === "UNAUTHORIZED") {
            renderStatus(adminSection, "warning", "Bạn không có quyền truy cập trang Admin.");
        } else if (error.message === "SERVER_ERROR") {
            renderStatus(adminSection, "info", "Máy chủ đang khởi động lại. Vui lòng thử lại sau vài giây.");
        } else {
            renderStatus(adminSection, "error", "Chưa có dữ liệu để hiển thị.");
        }
    }
}