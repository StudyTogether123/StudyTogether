// js/modules/forgotPassword.js
import { authService } from '../services/auth.service.js';
import { openAuthModal } from './auth.js';

let currentEmail = '';
let timerInterval = null;

/* ===============================
   MỞ MODAL QUÊN MẬT KHẨU
================================= */
export function openForgotPasswordModal() {
    console.log('🔹 openForgotPasswordModal called');
    closeAllModals();
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('✅ Forgot password modal opened');
    } else {
        console.error('❌ forgotPasswordModal not found');
    }
}

/* ===============================
   MỞ MODAL OTP
================================= */
function openOtpModal() {
    console.log('🔹 openOtpModal called');
    closeAllModals();
    const modal = document.getElementById('otpModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('✅ OTP modal opened');
        startTimer(60);
    } else {
        console.error('❌ otpModal not found');
    }
}

/* ===============================
   MỞ MODAL ĐẶT LẠI MẬT KHẨU
================================= */
function openResetPasswordModal() {
    console.log('🔹 openResetPasswordModal called');
    closeAllModals();
    const modal = document.getElementById('resetPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('✅ Reset password modal opened');
    } else {
        console.error('❌ resetPasswordModal not found');
    }
}

/* ===============================
   ĐÓNG TẤT CẢ MODAL
================================= */
function closeAllModals() {
    console.log('🔹 closeAllModals called');
    const modals = ['forgotPasswordModal', 'otpModal', 'resetPasswordModal', 'authModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            console.log(`   Closed modal: ${id}`);
        }
    });
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        console.log('   Timer cleared');
    }
}

/* ===============================
   ĐÓNG MODAL CỤ THỂ
================================= */
export function closeModal(modalId) {
    console.log(`🔹 closeModal called for: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        console.log(`   Closed modal: ${modalId}`);
    }
    if (modalId === 'otpModal' && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        console.log('   Timer cleared due to modal close');
    }
}

/* ===============================
   BẮT ĐẦU ĐẾM NGƯỢC
================================= */
function startTimer(seconds) {
    console.log(`🔹 startTimer called with ${seconds} seconds`);
    const timerEl = document.getElementById('timer');
    if (!timerEl) {
        console.error('❌ timer element not found');
        return;
    }

    let timeLeft = seconds;
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerEl.textContent = '0';
            console.log('⏰ Timer expired');
            toastr.warning('Mã xác nhận đã hết hạn. Vui lòng yêu cầu lại.');
        }
    }, 1000);
}

/* ===============================
   XỬ LÝ FORM QUÊN MẬT KHẨU
================================= */
async function handleForgotPassword(e) {
    e.preventDefault();
    console.log('🔹 handleForgotPassword called');

    const emailInput = document.getElementById('forgotEmail');
    const email = emailInput?.value.trim();
    console.log('   Email entered:', email);

    if (!email) {
        console.warn('⚠️ No email entered');
        toastr.warning('Vui lòng nhập email!');
        return;
    }

    if (!isValidEmail(email)) {
        console.warn('⚠️ Invalid email format');
        toastr.warning('Email không hợp lệ!');
        return;
    }

    try {
        console.log('   Calling authService.forgotPassword with email:', email);
        await authService.forgotPassword(email);
        currentEmail = email;
        console.log('✅ Forgot password request successful');
        toastr.success('Mã xác nhận đã được gửi đến email của bạn!');
        closeAllModals();
        openOtpModal();
    } catch (error) {
        console.error('❌ Forgot password error:', error);
        toastr.error(error.message || 'Gửi yêu cầu thất bại');
    }
}

/* ===============================
   XỬ LÝ XÁC NHẬN OTP
================================= */
async function handleVerifyOtp(e) {
    e.preventDefault();
    console.log('🔹 handleVerifyOtp called');

    const otpInput = document.getElementById('otpCode');
    const otp = otpInput?.value.trim();
    console.log('   OTP entered:', otp);

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
        console.warn('⚠️ Invalid OTP format');
        toastr.warning('Vui lòng nhập mã OTP 6 chữ số!');
        return;
    }

    try {
        console.log('   Calling authService.verifyOtp with email:', currentEmail, 'otp:', otp);
        await authService.verifyOtp(currentEmail, otp); // Không cần lưu token
        console.log('✅ OTP verification successful');
        toastr.success('Xác thực thành công!');
        closeAllModals();
        openResetPasswordModal();
    } catch (error) {
        console.error('❌ OTP verification error:', error);
        toastr.error(error.message || 'Mã OTP không hợp lệ');
    }
}

/* ===============================
   XỬ LÝ ĐẶT LẠI MẬT KHẨU
================================= */
async function handleResetPassword(e) {
    e.preventDefault();
    console.log('🔹 handleResetPassword called');

    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmNewPassword')?.value;
    console.log('   New password entered:', newPassword ? '***' : '');

    if (!newPassword || !confirmPassword) {
        console.warn('⚠️ Password fields empty');
        toastr.warning('Vui lòng nhập mật khẩu!');
        return;
    }

    if (newPassword.length < 6) {
        console.warn('⚠️ Password too short');
        toastr.warning('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    if (newPassword !== confirmPassword) {
        console.warn('⚠️ Passwords do not match');
        toastr.warning('Mật khẩu xác nhận không khớp!');
        return;
    }

    if (!currentEmail) {
        console.error('❌ No current email');
        toastr.error('Phiên làm việc không hợp lệ. Vui lòng thử lại.');
        closeAllModals();
        openForgotPasswordModal();
        return;
    }

    try {
        console.log('   Calling authService.resetPassword with email:', currentEmail);
        await authService.resetPassword(currentEmail, newPassword); // Không có token
        console.log('✅ Reset password successful');
        toastr.success('Đổi mật khẩu thành công! Hãy đăng nhập lại.');
        closeAllModals();
        openAuthModal(true);
        currentEmail = ''; // Reset biến
    } catch (error) {
        console.error('❌ Reset password error:', error);
        toastr.error(error.message || 'Đổi mật khẩu thất bại');
    }
}

/* ===============================
   GỬI LẠI OTP
================================= */
async function resendOtp() {
    console.log('🔹 resendOtp called');
    if (!currentEmail) {
        console.warn('⚠️ No current email for resend');
        toastr.error('Không tìm thấy email!');
        return;
    }

    try {
        console.log('   Resending OTP to:', currentEmail);
        await authService.forgotPassword(currentEmail);
        toastr.success('Đã gửi lại mã OTP!');
        if (timerInterval) clearInterval(timerInterval);
        startTimer(60);
    } catch (error) {
        console.error('❌ Resend OTP error:', error);
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
        if (form) {
            const linkDiv = document.createElement('p');
            linkDiv.className = 'text-center form-links';
            linkDiv.innerHTML = `
                <a href="#" id="forgotPasswordLink">
                    <i class="fas fa-key"></i> Quên mật khẩu?
                </a>
            `;
            form.appendChild(linkDiv);
            console.log('   Forgot password link added to auth modal');
        } else {
            console.warn('   Form not found in auth modal');
        }
    }

    // Gắn sự kiện cho link quên mật khẩu
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('   Forgot password link clicked');
            closeAllModals();
            openForgotPasswordModal();
        });
        console.log('   Event listener attached to forgotPasswordLink');
    } else {
        console.warn('   forgotPasswordLink not found');
    }

    // Form quên mật khẩu
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
        console.log('   Event listener attached to forgotPasswordForm');
    } else {
        console.warn('   forgotPasswordForm not found');
    }

    // Form OTP
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleVerifyOtp);
        console.log('   Event listener attached to otpForm');
    } else {
        console.warn('   otpForm not found');
    }

    // Form đặt lại mật khẩu
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
        console.log('   Event listener attached to resetPasswordForm');
    } else {
        console.warn('   resetPasswordForm not found');
    }

    // Nút gửi lại OTP
    const resendBtn = document.getElementById('resendOtpBtn');
    if (resendBtn) {
        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('   Resend OTP button clicked');
            resendOtp();
        });
        console.log('   Event listener attached to resendOtpBtn');
    } else {
        console.warn('   resendOtpBtn not found');
    }

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
                console.log(`   Button ${id} clicked`);
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
            console.log(`   Event listener attached to ${id}`);
        } else {
            console.warn(`   Button ${id} not found`);
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
                console.log(`   Toggled password visibility for ${targetId}`);
            }
        });
    });

    // Kiểm tra độ mạnh mật khẩu
    const newPassword = document.getElementById('newPassword');
    if (newPassword) {
        newPassword.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
        console.log('   Password strength listener attached');
    } else {
        console.warn('   newPassword input not found');
    }
}

export default {
    initForgotPassword,
    openForgotPasswordModal,
    closeModal
};