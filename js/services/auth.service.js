// js/services/auth.service.js

const API_BASE = "https://studytogether-backend.onrender.com/api";

class AuthService {
    constructor() {
        console.log('🔧 AuthService constructor called');
        this.storage = this._getStorage();
        this._user = null;
        this._subscribers = [];
        this._init();
    }

    _getStorage() {
        try {
            localStorage.setItem('test', '1');
            localStorage.removeItem('test');
            console.log('📦 Using localStorage');
            return localStorage;
        } catch {
            console.log('📦 Using sessionStorage (fallback)');
            return sessionStorage;
        }
    }

    // Chuẩn hóa role: xóa "ROLE_" (nếu có) và chuyển thành chữ thường
    _normalizeRole(role) {
        if (!role) return 'user';
        if (role.startsWith('ROLE_')) {
            role = role.substring(5);
        }
        return role.toLowerCase(); // chuẩn hóa thành chữ thường
    }

    _init() {
        const token = this.storage.getItem('token');
        const username = this.storage.getItem('username');
        const email = this.storage.getItem('email');
        const points = this.storage.getItem('points');
        let role = this.storage.getItem('role');

        console.log('📚 _init: token=', token ? 'exists' : 'null', 'username=', username);

        if (token && username) {
            role = this._normalizeRole(role);
            this._user = {
                username,
                email: email || null,
                points: points ? parseInt(points) : 0,
                role: role || 'user',
                token
            };
            console.log('✅ User restored from storage:', this._user);
        } else {
            console.log('❌ No valid user in storage');
        }
    }

    getCurrentUser() {
        return this._user ? { ...this._user } : null;
    }

    isAuthenticated() {
        return !!this._user;
    }

    async login(username, password) {
        console.log('🔑 login called with username:', username);
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

            console.log('✅ Login success, data:', data);
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

    logout() {
        this.storage.removeItem('token');
        this.storage.removeItem('username');
        this.storage.removeItem('email');
        this.storage.removeItem('points');
        this.storage.removeItem('role');
        this._user = null;
        this._notify();
    }

    updatePoints(newPoints) {
        if (this._user) {
            this._user.points = newPoints;
            this.storage.setItem('points', newPoints);
            this._notify();
        }
    }

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
        return data;
    }

    async resetPassword(email, newPassword) {
        console.log('🔐 AuthService.resetPassword called with email:', email);
        const response = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        const data = await response.json();
        console.log('   Response:', data);
        if (!response.ok) throw new Error(data.message || 'Đặt lại mật khẩu thất bại');
        return data;
    }

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

    _setUser(userData) {
        const { token, username, email, points, role } = userData;
        const normalizedRole = this._normalizeRole(role);

        this.storage.setItem('token', token);
        this.storage.setItem('username', username);
        if (email) this.storage.setItem('email', email);
        if (points !== undefined) this.storage.setItem('points', points);
        this.storage.setItem('role', normalizedRole);

        this._user = {
            token,
            username,
            email: email || null,
            points: points ? parseInt(points) : 0,
            role: normalizedRole
        };
        console.log('📝 _setUser completed, user:', this._user);
        this._notify();
    }
}

export const authService = new AuthService();

window.authService = authService;