// js/api.js
import { authService } from './services/auth.service.js';

const API_BASE = "https://studytogether-backend.onrender.com/api";

/**
 * Authorized fetch – tự động thêm token từ authService
 */
export async function authorizedFetch(endpoint, options = {}) {
    const user = authService.getCurrentUser();
    const token = user?.token;

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            ...(token && { Authorization: "Bearer " + token })
        }
    });

    if (response.status === 401) {
        authService.logout();
        throw new Error("Session expired. Please login again.");
    }

    return response;
}

// ===============================
// CÁC HÀM DƯỚI ĐÂY ĐƯỢC GIỮ LẠI ĐỂ TƯƠNG THÍCH VỚI CODE CŨ,
// NHƯNG THỰC CHẤT CHỈ GỌI QUA authService.
// KHUYẾN KHÍCH DÙNG authService TRỰC TIẾP.
// ===============================

/**
 * Đăng nhập
 * @deprecated Dùng authService.login thay thế
 */
export async function login(username, password) {
    console.warn('api.js login is deprecated, use authService.login instead');
    return authService.login(username, password);
}

/**
 * Đăng ký
 * @deprecated Dùng authService.register thay thế
 */
export async function register(username, email, password) {
    console.warn('api.js register is deprecated, use authService.register instead');
    return authService.register(username, email, password);
}

/**
 * Đăng xuất
 * @deprecated Dùng authService.logout thay thế
 */
export function logout() {
    console.warn('api.js logout is deprecated, use authService.logout instead');
    authService.logout();
}

/**
 * Lấy thông tin user hiện tại
 * @deprecated Dùng authService.getCurrentUser thay thế
 */
export function getCurrentUser() {
    console.warn('api.js getCurrentUser is deprecated, use authService.getCurrentUser instead');
    const user = authService.getCurrentUser();
    return user ? {
        token: user.token,
        username: user.username,
        role: user.role
    } : null;
}