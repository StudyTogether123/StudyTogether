import { API_BASE } from "../config.js";

function getToken() {
    return localStorage.getItem("token");
}

const headers = () => ({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getToken()
});

// Lấy danh sách báo cáo (có phân trang)
export async function getReports(page = 1, limit = 10) {
    const res = await fetch(`${API_BASE}/admin/reports?page=${page}&limit=${limit}`, {
        headers: headers()
    });
    if (!res.ok) throw new Error("Không thể tải báo cáo");
    return res.json();
}

// Lấy chi tiết một báo cáo
export async function getReport(id) {
    const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
        headers: headers()
    });
    if (!res.ok) throw new Error("Không thể tải chi tiết báo cáo");
    return res.json();
}

// Phê duyệt báo cáo (có thể kèm nội dung chỉnh sửa bài viết)
export async function approveReport(id, updatedPost) {
    const res = await fetch(`${API_BASE}/admin/reports/${id}/approve`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ updatedPost })
    });
    if (!res.ok) throw new Error("Không thể phê duyệt báo cáo");
    return res.json();
}

// Từ chối báo cáo (kèm lý do)
export async function rejectReport(id, reason) {
    const res = await fetch(`${API_BASE}/admin/reports/${id}/reject`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error("Không thể từ chối báo cáo");
    return res.json();
}

// Lấy chi tiết bài viết để chỉnh sửa
export async function getPost(id) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
        headers: headers()
    });
    if (!res.ok) throw new Error("Không thể tải bài viết");
    return res.json();
}

// Cập nhật bài viết
export async function updatePost(id, postData) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error("Không thể cập nhật bài viết");
    return res.json();
}