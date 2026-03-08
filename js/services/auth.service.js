// js/services/auth.service.js

const API_BASE = "https://studytogether-backend.onrender.com/api";

class AuthService {
    constructor() {
        this.storage = this._getStorage();
        this._user = null;
        this._subscribers = [];
        this._init();
    }

    // Chọn storage an toàn (localStorage fallback)
    _getStorage() {
        try {
            localStorage.setItem('test', '1');
            localStorage.removeItem('test');
            return localStorage;
        } catch {
            return sessionStorage;
        }
    }

    // Khởi tạo từ storage
    _init() {
        const token = this.storage.getItem('token');
        const username = this.storage.getItem('username');
        const email = this.storage.getItem('email');
        const points = this.storage.getItem('points');
        const role = this.storage.getItem('role');

        if (token && username) {
            this._user = {
                username,
                email: email || null,
                points: points ? parseInt(points) : 0,
                role: role || 'user',
                token
            };
        }
    }

    // Lấy user hiện tại
    getCurrentUser() {
        return this._user ? { ...this._user } : null;
    }

    // Kiểm tra đã đăng nhập chưa
    isAuthenticated() {
        return !!this._user;
    }

    // Đăng nhập
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            this._setUser({
                token: data.token,
                username: data.username,
                role: data.role,
                points: data.points,
                email: data.email
            });

            return { success: true, data };
        } catch (error) {
            console.warn('Login API failed, using demo mode', error);
            if (username === 'demo') {
                this._setUser({
                    token: 'demo-token',
                    username: 'demo',
                    role: 'user',
                    points: 100,
                    email: 'demo@example.com'
                });
                return { success: true, data: { username: 'demo' } };
            }
            throw error;
        }
    }

    // Đăng ký
    async register(username, email, password) {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');
        return data;
    }

    // Đăng xuất
    logout() {
        this.storage.removeItem('token');
        this.storage.removeItem('username');
        this.storage.removeItem('email');
        this.storage.removeItem('points');
        this.storage.removeItem('role');
        this._user = null;
        this._notify();
    }

    // Cập nhật điểm (gọi sau khi làm quiz)
    updatePoints(newPoints) {
        if (this._user) {
            this._user.points = newPoints;
            this.storage.setItem('points', newPoints);
            this._notify();
        }
    }

    // ===============================
    // QUÊN MẬT KHẨU – OTP
    // ===============================

    /**
     * Gửi yêu cầu quên mật khẩu (gửi OTP về email)
     */
    async forgotPassword(email) {
        console.log('🔐 AuthService.forgotPassword called with email:', email);
        const response = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        console.log('   Response:', data);
        if (!response.ok) throw new Error(data.message || 'Không thể gửi mã OTP');
        return data;
    }

    /**
     * Xác thực OTP
     */
    async verifyOtp(email, otp) {
        console.log('🔐 AuthService.verifyOtp called with email:', email, 'otp:', otp);
        const response = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        console.log('   Response:', data);
        if (!response.ok) throw new Error(data.message || 'Mã OTP không hợp lệ');
        return data; // trả về { success: true, token: "..." }
    }

    /**
     * Đặt lại mật khẩu mới
     */
    async resetPassword(email, newPassword, token) {
        console.log('🔐 AuthService.resetPassword called with email:', email, 'token:', token);
        const response = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword, token })
        });
        const data = await response.json();
        console.log('   Response:', data);
        if (!response.ok) throw new Error(data.message || 'Đặt lại mật khẩu thất bại');
        return data;
    }

    // --- Observer methods ---
    subscribe(callback) {
        this._subscribers.push(callback);
        callback(this.getCurrentUser());
        return () => {
            this._subscribers = this._subscribers.filter(cb => cb !== callback);
        };
    }

    _notify() {
        const user = this.getCurrentUser();
        this._subscribers.forEach(cb => cb(user));
    }

    // --- Private helpers ---
    _setUser(userData) {
        const { token, username, email, points, role } = userData;
        this.storage.setItem('token', token);
        this.storage.setItem('username', username);
        if (email) this.storage.setItem('email', email);
        if (points !== undefined) this.storage.setItem('points', points);
        if (role) this.storage.setItem('role', role);

        this._user = {
            token,
            username,
            email: email || null,
            points: points ? parseInt(points) : 0,
            role: role || 'user'
        };
        this._notify();
    }
}

export const authService = new AuthService();

// Đặt service lên window để app-loader có thể truy cập (nếu cần)
window.authService = authService;