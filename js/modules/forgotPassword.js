// js/modules/forgotPassword.js
import { authService } from '../services/auth.service.js';
import { openAuthModal } from './auth.js';

let currentEmail = '';
let otpToken = '';
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
        startTimer(60); // Bắt đầu đếm ngược 60 giây
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
    const modals = ['forgotPasswordModal', 'otpModal', 'resetPasswordModal', 'authModal'];
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
   ĐÓNG MODAL CỤ THỂ (giữ lại để tương thích nếu cần)
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
   BẮT ĐẦU ĐẾM NGƯỢC
================================= */
function startTimer(seconds) {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;

    let timeLeft = seconds;
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerEl.textContent = '0';
            // Không tự động đóng modal, chỉ thông báo hết hạn (backend đã xử lý)
            toastr.warning('Mã xác nhận đã hết hạn. Vui lòng yêu cầu lại.');
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
        toastr.warning('Vui lòng nhập email!');
        return;
    }

    if (!isValidEmail(email)) {
        toastr.warning('Email không hợp lệ!');
        return;
    }

    try {
        await authService.forgotPassword(email);
        currentEmail = email;
        toastr.success('Mã xác nhận đã được gửi đến email của bạn!');
        closeAllModals();
        openOtpModal();
    } catch (error) {
        toastr.error(error.message || 'Gửi yêu cầu thất bại');
    }
}

/* ===============================
   XỬ LÝ XÁC NHẬN OTP
================================= */
async function handleVerifyOtp(e) {
    e.preventDefault();
    const otp = document.getElementById('otpCode')?.value.trim();

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
        toastr.warning('Vui lòng nhập mã OTP 6 chữ số!');
        return;
    }

    try {
        const result = await authService.verifyOtp(currentEmail, otp);
        otpToken = result.token || ''; // Lưu token để dùng cho reset password
        toastr.success('Xác thực thành công!');
        closeAllModals();
        openResetPasswordModal();
    } catch (error) {
        toastr.error(error.message || 'Mã OTP không hợp lệ');
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
        toastr.warning('Vui lòng nhập mật khẩu!');
        return;
    }

    if (newPassword.length < 6) {
        toastr.warning('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    if (newPassword !== confirmPassword) {
        toastr.warning('Mật khẩu xác nhận không khớp!');
        return;
    }

    if (!currentEmail || !otpToken) {
        toastr.error('Phiên làm việc không hợp lệ. Vui lòng thử lại.');
        closeAllModals();
        openForgotPasswordModal();
        return;
    }

    try {
        await authService.resetPassword(currentEmail, newPassword, otpToken);
        toastr.success('Đổi mật khẩu thành công! Hãy đăng nhập lại.');
        closeAllModals();
        openAuthModal(true); // Mở modal đăng nhập
        // Reset biến
        currentEmail = '';
        otpToken = '';
    } catch (error) {
        toastr.error(error.message || 'Đổi mật khẩu thất bại');
    }
}

/* ===============================
   GỬI LẠI OTP
================================= */
async function resendOtp() {
    if (!currentEmail) {
        toastr.error('Không tìm thấy email!');
        return;
    }

    try {
        await authService.forgotPassword(currentEmail);
        toastr.success('Đã gửi lại mã OTP!');
        // Reset timer
        if (timerInterval) clearInterval(timerInterval);
        startTimer(60);
    } catch (error) {
        toastr.error(error.message || 'Gửi lại thất bại');
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
   KHỞI TẠO SỰ KIỆN
================================= */
export function initForgotPassword() {
    console.log('🔑 Khởi tạo tính năng quên mật khẩu');

    // Thêm link "Quên mật khẩu" vào modal đăng nhập nếu chưa có
    const authModal = document.getElementById('authModal');
    if (authModal && !document.getElementById('forgotPasswordLink')) {
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

    // Gắn sự kiện cho link quên mật khẩu
    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
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
    const closeButtons = [
        'closeForgotModal',
        'closeOtpModal',
        'closeResetModal',
        'backToLoginFromForgot',
        'backToForgotFromOtp',
        'backToLoginFromReset'
    ];

    closeButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (id.includes('backToLogin')) {
                    closeAllModals();
                    openAuthModal(true);
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

    // Kiểm tra độ mạnh mật khẩu
    const newPassword = document.getElementById('newPassword');
    if (newPassword) {
        newPassword.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }
}

export default {
    initForgotPassword,
    openForgotPasswordModal,
    closeModal
};