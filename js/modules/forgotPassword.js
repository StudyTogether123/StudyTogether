// js/modules/forgotPassword.js
import { authService } from '../services/auth.service.js';
import { appState } from './data.js';

let currentEmail = '';      // Email đang xử lý
let otpToken = '';          // Token trả về sau khi xác thực OTP
let timerInterval = null;

/* ===============================
   MỞ MODAL QUÊN MẬT KHẨU
================================= */
export function openForgotPasswordModal() {
    closeAllModals();
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

/* ===============================
   MỞ MODAL OTP
================================= */
function openOtpModal() {
    closeAllModals();
    const modal = document.getElementById('otpModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        // Bắt đầu đếm ngược 60 giây (chỉ UI)
        startTimer(60);
    }
}

/* ===============================
   MỞ MODAL ĐẶT LẠI MẬT KHẨU
================================= */
function openResetPasswordModal() {
    closeAllModals();
    const modal = document.getElementById('resetPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

/* ===============================
   ĐÓNG TẤT CẢ MODAL
================================= */
function closeAllModals() {
    const modals = ['authModal', 'forgotPasswordModal', 'otpModal', 'resetPasswordModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    });
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/* ===============================
   ĐÓNG MODAL CỤ THỂ
================================= */
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
    if (modalId === 'otpModal' && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/* ===============================
   BẮT ĐẦU ĐẾM NGƯỢC UI
================================= */
function startTimer(seconds) {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;

    let timeLeft = seconds;
    timerEl.textContent = timeLeft;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerEl.textContent = '0';
            // Không xóa gì cả, chỉ thông báo UI
            showNotification('Mã xác nhận đã hết hạn! Vui lòng yêu cầu lại.', 'warning');
        }
    }, 1000);
}

/* ===============================
   XỬ LÝ FORM QUÊN MẬT KHẨU
================================= */
async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail')?.value.trim();

    if (!email) {
        showNotification('Vui lòng nhập email!', 'warning');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ!', 'warning');
        return;
    }

    try {
        await authService.forgotPassword(email);
        currentEmail = email;
        showNotification('Mã xác nhận đã được gửi đến email của bạn!', 'success');
        closeAllModals();
        openOtpModal();
    } catch (error) {
        showNotification(error.message || 'Gửi yêu cầu thất bại', 'error');
    }
}

/* ===============================
   KIỂM TRA EMAIL HỢP LỆ
================================= */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ===============================
   XỬ LÝ XÁC NHẬN OTP
================================= */
async function handleVerifyOtp(e) {
    e.preventDefault();
    const otp = document.getElementById('otpCode')?.value.trim();

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
        showNotification('Vui lòng nhập mã OTP 6 chữ số!', 'warning');
        return;
    }

    try {
        const result = await authService.verifyOtp(currentEmail, otp);
        otpToken = result.token || ''; // lưu token nếu cần
        showNotification('Xác thực thành công!', 'success');
        closeAllModals();
        openResetPasswordModal();
    } catch (error) {
        showNotification(error.message || 'Mã OTP không hợp lệ', 'error');
    }
}

/* ===============================
   XỬ LÝ ĐẶT LẠI MẬT KHẨU
================================= */
async function handleResetPassword(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmNewPassword')?.value;

    if (!newPassword || !confirmPassword) {
        showNotification('Vui lòng nhập mật khẩu!', 'warning');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    if (!currentEmail) {
        showNotification('Không tìm thấy email! Vui lòng thử lại.', 'error');
        return;
    }

    try {
        await authService.resetPassword(currentEmail, newPassword, otpToken);
        showNotification('Đổi mật khẩu thành công! Hãy đăng nhập lại.', 'success');
        closeAllModals();
        // Mở modal đăng nhập
        if (window.openAuthModal) {
            window.openAuthModal(true);
        }
        // Reset biến
        currentEmail = '';
        otpToken = '';
    } catch (error) {
        showNotification(error.message || 'Đổi mật khẩu thất bại', 'error');
    }
}

/* ===============================
   GỬI LẠI OTP
================================= */
async function resendOtp() {
    if (!currentEmail) {
        showNotification('Không tìm thấy email!', 'error');
        return;
    }

    try {
        await authService.forgotPassword(currentEmail);
        showNotification('Đã gửi lại mã OTP!', 'success');
        // Reset timer
        if (timerInterval) clearInterval(timerInterval);
        startTimer(60);
    } catch (error) {
        showNotification(error.message || 'Gửi lại thất bại', 'error');
    }
}

/* ===============================
   KIỂM TRA ĐỘ MẠNH MẬT KHẨU
================================= */
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    if (!strengthBar || !strengthText) return;

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthBar.className = 'strength-bar';

    if (password.length === 0) {
        strengthBar.style.width = '0';
        strengthText.textContent = 'Nhập mật khẩu';
    } else if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Mật khẩu yếu';
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Mật khẩu trung bình';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Mật khẩu mạnh';
    }
}

/* ===============================
   HIỂN THỊ THÔNG BÁO
================================= */
function showNotification(message, type = 'info') {
    if (window.toastr) {
        toastr[type](message);
    } else {
        alert(message);
    }
}

/* ===============================
   KHỞI TẠO SỰ KIỆN
================================= */
export function initForgotPassword() {
    console.log('🔑 Khởi tạo tính năng quên mật khẩu');

    // Thêm link "Quên mật khẩu" vào modal đăng nhập nếu chưa có
    const authModal = document.getElementById('authModal');
    if (authModal) {
        if (!document.getElementById('forgotPasswordLink')) {
            const form = authModal.querySelector('form');
            const linkDiv = document.createElement('p');
            linkDiv.className = 'text-center form-links';
            linkDiv.innerHTML = `
                <a href="#" id="forgotPasswordLink">
                    <i class="fas fa-key"></i> Quên mật khẩu?
                </a>
            `;
            form.appendChild(linkDiv);
        }
    }

    // Gắn sự kiện cho link quên mật khẩu
    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('authModal');
        openForgotPasswordModal();
    });

    // Form quên mật khẩu
    document.getElementById('forgotPasswordForm')?.addEventListener('submit', handleForgotPassword);

    // Form OTP
    document.getElementById('otpForm')?.addEventListener('submit', handleVerifyOtp);

    // Form đặt lại mật khẩu
    document.getElementById('resetPasswordForm')?.addEventListener('submit', handleResetPassword);

    // Nút gửi lại OTP
    document.getElementById('resendOtpBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        resendOtp();
    });

    // Các nút đóng / quay lại
    const closeBtns = [
        'closeForgotModal',
        'closeOtpModal',
        'closeResetModal',
        'backToLoginFromForgot',
        'backToForgotFromOtp',
        'backToLoginFromReset'
    ];

    closeBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (id.includes('backToLogin')) {
                    closeAllModals();
                    if (window.openAuthModal) window.openAuthModal(true);
                } else if (id.includes('backToForgot')) {
                    closeAllModals();
                    openForgotPasswordModal();
                } else {
                    closeAllModals();
                }
            });
        }
    });

    // Toggle hiển thị mật khẩu
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            }
        });
    });

    // Gắn sự kiện kiểm tra độ mạnh mật khẩu
    const newPassword = document.getElementById('newPassword');
    if (newPassword) {
        newPassword.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }
}