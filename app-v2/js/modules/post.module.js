import {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLock
} from "../services/post.service.js";

function renderStatus(container, message) {
    container.innerHTML = `
        <div class="status-card info">
            <div class="status-icon">📄</div>
            <p>${message}</p>
        </div>
    `;
}

export async function loadPosts() {

    document.querySelectorAll(".content-section")
        .forEach(sec => sec.classList.add("hidden-section"));

    let section = document.getElementById("admin-section");

    if (!section) {
        section = document.createElement("section");
        section.id = "admin-section";
        section.classList.add("content-section");
        document.getElementById("main-content")
            .appendChild(section);
    }

    section.classList.remove("hidden-section");

    section.innerHTML = `
        <div class="container">
            <h2 class="section-title">Quản lý Posts</h2>
            <button id="createBtn" class="primary-btn">+ Tạo bài</button>
            <div id="postTable"></div>
        </div>
    `;

    const tableContainer = document.getElementById("postTable");

    renderStatus(tableContainer, "Đang tải dữ liệu...");

    try {

        const posts = await getAllPosts();

        if (!posts || posts.length === 0) {
            renderStatus(tableContainer, "Chưa có bài viết nào.");
            return;
        }

        tableContainer.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${posts.map(p => `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.title}</td>
                            <td>${p.category ?? "-"}</td>
                            <td>
                                <span class="${p.locked ? "badge-locked" : "badge-active"}">
                                    ${p.locked ? "🔒 Locked" : "✅ Active"}
                                </span>
                            </td>
                            <td>
                                <button class="edit-btn" data-id="${p.id}">Sửa</button>
                                <button class="delete-btn" data-id="${p.id}">Xóa</button>
                                <button class="lock-btn" data-id="${p.id}">
                                    ${p.locked ? "Mở khóa" : "Khóa"}
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        // ================= EVENTS =================

        document.getElementById("createBtn")
            .addEventListener("click", showCreateForm);

        document.querySelectorAll(".delete-btn")
            .forEach(btn =>
                btn.addEventListener("click", () =>
                    handleDelete(btn.dataset.id)
                )
            );

        document.querySelectorAll(".lock-btn")
            .forEach(btn =>
                btn.addEventListener("click", () =>
                    handleLock(btn.dataset.id)
                )
            );

        document.querySelectorAll(".edit-btn")
            .forEach(btn =>
                btn.addEventListener("click", () =>
                    handleEdit(btn.dataset.id)
                )
            );

    } catch (err) {
        renderStatus(tableContainer, "Không thể tải dữ liệu. Vui lòng thử lại.");
    }
}

// ================= CREATE =================
async function showCreateForm() {

    const title = prompt("Tiêu đề:");
    const content = prompt("Nội dung:");
    const category = prompt("Danh mục:");

    if (!title || !content) return;

    try {
        await createPost({ title, content, category });
        loadPosts();
    } catch {
        alert("Không thể tạo bài.");
    }
}

// ================= DELETE =================
async function handleDelete(id) {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;

    await deletePost(id);
    loadPosts();
}

// ================= LOCK =================
async function handleLock(id) {
    await toggleLock(id);
    loadPosts();
}

// ================= EDIT =================
async function handleEdit(id) {

    const title = prompt("Tiêu đề mới:");
    const content = prompt("Nội dung mới:");
    const category = prompt("Danh mục mới:");

    if (!title || !content) return;

    await updatePost(id, { title, content, category });
    loadPosts();
}