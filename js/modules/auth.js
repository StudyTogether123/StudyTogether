// auth.js
import { appState } from './data.js';
import { login, register } from '../api.js';

/* ===============================
   STORAGE SAFE
================================= */
function getStorage() {
    try {
        localStorage.setItem("__test", "1");
        localStorage.removeItem("__test");
        return localStorage;
    } catch {
        return sessionStorage;
    }
}

const storage = getStorage();

/* ===============================
   BASE PATH (GitHub Safe)
================================= */
function getBasePath() {
    const { pathname } = window.location;

    // Nếu đang ở /StudyTogether/... trên GitHub
    if (pathname.includes("/StudyTogether/")) {
        return "/StudyTogether/";
    }

    // Local
    return "/";
}

/* ===============================
   SAFE REDIRECT
================================= */
function redirect(path) {
    const base = getBasePath();
    window.location.href = base + path;
}

/* ===============================
   OPEN MODAL
================================= */
export function openAuthModal(isLogin = true) {
    appState.isLoginMode = isLogin;

    const modal = document.getElementById('authModal');
    const title = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchLink = document.getElementById('switchAuthMode');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    const emailGroup = document.getElementById('emailGroup');

    if (isLogin) {
        title.textContent = "Đăng nhập";
        submitBtn.textContent = "Đăng nhập";
        switchLink.textContent = "Chưa có tài khoản? Đăng ký ngay";
        confirmPasswordGroup.style.display = "none";
        emailGroup.style.display = "none";
    } else {
        title.textContent = "Đăng ký tài khoản";
        submitBtn.textContent = "Đăng ký";
        switchLink.textContent = "Đã có tài khoản? Đăng nhập ngay";
        confirmPasswordGroup.style.display = "block";
        emailGroup.style.display = "block";
    }

    modal.style.display = "flex";
}

/* ===============================
   CLOSE MODAL
================================= */
export function closeAuthModal() {
    const modal = document.getElementById('authModal');
    const form = document.getElementById('authForm');

    if (modal) modal.style.display = "none";
    if (form) form.reset();
}

/* ===============================
   HANDLE AUTH
================================= */
export async function handleAuth(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        return toastr.error("Vui lòng nhập đầy đủ thông tin!");
    }

    try {

        /* ================= LOGIN ================= */
        if (appState.isLoginMode) {

            let token = null;

            try {
                token = await login(username, password);
            } catch (e) {
                console.warn("API login failed → Demo mode");
            }

            if (!token) {
                token = "demo-token-" + Date.now();
            }

            const role = username.toLowerCase() === "admin" ? "admin" : "user";

            storage.setItem("token", token);
            storage.setItem("username", username);
            storage.setItem("role", role);

            appState.currentUser = { name: username, role };

            toastr.success("Đăng nhập thành công!");
            closeAuthModal();

            setTimeout(() => {
                if (role === "admin") {
                    redirect("app-v2/admin.html");
                } else {
                    redirect("index.html");
                }
            }, 500);
        }

        /* ================= REGISTER ================= */
        else {
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!email) return toastr.error("Vui lòng nhập email!");
            if (password !== confirmPassword)
                return toastr.error("Mật khẩu không khớp!");
            if (password.length < 6)
                return toastr.error("Mật khẩu tối thiểu 6 ký tự!");

            try {
                await register(username, email, password);
                toastr.success("Đăng ký thành công! Hãy đăng nhập.");
                closeAuthModal();
                setTimeout(() => openAuthModal(true), 300);
            } catch {
                toastr.error("Đăng ký thất bại!");
            }
        }

    } catch (error) {
        console.error(error);
        toastr.error("Có lỗi xảy ra!");
    }
}

/* ===============================
   AUTH CHECK
================================= */
export function isAuthenticated() {
    const token = storage.getItem("token");
    const username = storage.getItem("username");
    return !!(token && username);
}

export function getCurrentUser() {
    const token = storage.getItem("token");
    const username = storage.getItem("username");
    const role = storage.getItem("role");

    if (token && username) {
        return { name: username, role };
    }
    return null;
}

/* ===============================
   LOGOUT
================================= */
export function logout() {
    storage.removeItem("token");
    storage.removeItem("username");
    storage.removeItem("role");

    appState.currentUser = null;

    toastr.success("Đăng xuất thành công!");

    setTimeout(() => {
        redirect("index.html");
    }, 500);
}