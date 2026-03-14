// js/services/report.service.js
import { authService } from './auth.service.js';

const API_BASE = "https://studytogether-backend.onrender.com/api";

/**
 * Gửi báo cáo lỗi bài viết
 * @param {number} postId - ID bài viết
 * @param {string} reason - Lý do báo cáo
 * @param {string} description - Mô tả chi tiết (tùy chọn)
 * @returns {Promise<Object>}
 */
export async function reportPost(postId, reason, description = '') {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Bạn cần đăng nhập để báo cáo');

    const response = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
            postId,
            reason,
            description
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Gửi báo cáo thất bại');
    }
    return data;
}