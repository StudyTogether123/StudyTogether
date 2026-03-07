import { appState } from './data.js';

// Biến tạm thời lưu trạng thái
let resetEmail = '';
let resetCode = '';
let timerInterval = null;

/* ===============================
   MỞ MODAL QUÊN MẬT KHẨU
================================= */
export function openForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        // Đóng các modal khác
        closeOtherModals('forgotPasswordModal');
    }
}

/* ===============================
   ĐÓNG TẤT CẢ MODAL
================================= */
function closeOtherModals(exceptId) {
    const modals = ['authModal', 'forgotPasswordModal', 'otpModal', 'resetPasswordModal'];
    modals.forEach(id => {
        if (id !== exceptId) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        }
    });
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
    
    // Dừng timer nếu có
    if (modalId === 'otpModal' && timerInterval) {
        clearInterval(timerInterval);
    }
}

/* ===============================
   GỬI MÃ XÁC NHẬN
================================= */
function handleSendResetCode(email) {
    // Kiểm tra email có tồn tại trong hệ thống không
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showNotification('Email không tồn tại trong hệ thống!', 'error');
        return false;
    }
    
    // Tạo mã OTP ngẫu nhiên 6 số
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCode = code;
    resetEmail = email;
    
    // Lưu mã tạm thời (trong thực tế sẽ gửi email)
    console.log('📧 Mã xác nhận:', code);
    
    // Giả lập gửi email thành công
    showNotification(`Mã xác nhận đã được gửi đến email ${email}`, 'success');
    
    // Lưu thời gian hết hạn (60 giây)
    const expiryTime = Date.now() + 60000;
    sessionStorage.setItem('resetCode', code);
    sessionStorage.setItem('resetEmail', email);
    sessionStorage.setItem('codeExpiry', expiryTime);
    
    return true;
}

/* ===============================
   XỬ LÝ FORM QUÊN MẬT KHẨU
================================= */
function handleForgotPassword(e) {
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
    
    if (handleSendResetCode(email)) {
        // Đóng modal quên mật khẩu
        closeModal('forgotPasswordModal');
        
        // Mở modal OTP
        setTimeout(() => {
            openOtpModal();
        }, 300);
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
   MỞ MODAL OTP
================================= */
function openOtpModal() {
    const modal = document.getElementById('otpModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        // Bắt đầu đếm ngược
        startTimer(60);
    }
}

/* ===============================
   BẮT ĐẦU ĐẾM NGƯỢC
================================= */
function startTimer(seconds) {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    
    let timeLeft = seconds;
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerEl.textContent = '0';
            
            // Xóa mã hết hạn
            sessionStorage.removeItem('resetCode');
            sessionStorage.removeItem('codeExpiry');
            
            showNotification('Mã xác nhận đã hết hạn!', 'warning');
        }
    }, 1000);
}

/* ===============================
   XỬ LÝ XÁC NHẬN OTP
================================= */
function handleVerifyOtp(e) {
    e.preventDefault();
    
    const otp = document.getElementById('otpCode')?.value.trim();
    
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
        showNotification('Vui lòng nhập mã xác nhận 6 chữ số!', 'warning');
        return;
    }
    
    // Kiểm tra mã còn hạn không
    const expiry = sessionStorage.getItem('codeExpiry');
    if (expiry && Date.now() > parseInt(expiry)) {
        showNotification('Mã xác nhận đã hết hạn!', 'warning');
        return;
    }
    
    const storedCode = sessionStorage.getItem('resetCode');
    const storedEmail = sessionStorage.getItem('resetEmail');
    
    if (otp === storedCode) {
        // Xác nhận thành công
        showNotification('Xác nhận thành công!', 'success');
        
        // Đóng modal OTP
        closeModal('otpModal');
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Mở modal đặt lại mật khẩu
        setTimeout(() => {
            openResetPasswordModal(storedEmail);
        }, 300);
    } else {
        showNotification('Mã xác nhận không đúng!', 'error');
    }
}

/* ===============================
   MỞ MODAL ĐẶT LẠI MẬT KHẨU
================================= */
function openResetPasswordModal(email) {
    const modal = document.getElementById('resetPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

/* ===============================
   XỬ LÝ ĐẶT LẠI MẬT KHẨU
================================= */
function handleResetPassword(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmNewPassword')?.value;
    
    if (!newPassword || !confirmPassword) {
        showNotification('Vui lòng nhập đầy đủ mật khẩu!', 'warning');
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
    
    // Lấy email từ session
    const email = sessionStorage.getItem('resetEmail');
    
    if (!email) {
        showNotification('Phiên làm việc không hợp lệ!', 'error');
        return;
    }
    
    // Cập nhật mật khẩu trong localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword; // Trong thực tế nên mã hóa
        localStorage.setItem('users', JSON.stringify(users));
        
        showNotification('Đặt lại mật khẩu thành công!', 'success');
        
        // Xóa session
        sessionStorage.removeItem('resetCode');
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('codeExpiry');
        
        // Đóng modal
        closeModal('resetPasswordModal');
        
        // Mở modal đăng nhập
        setTimeout(() => {
            if (window.openAuthModal) {
                window.openAuthModal(true);
            }
        }, 500);
    } else {
        showNotification('Có lỗi xảy ra!', 'error');
    }
}

/* ===============================
   GỬI LẠI MÃ OTP
================================= */
function resendOtp() {
    const email = sessionStorage.getItem('resetEmail');
    
    if (!email) {
        showNotification('Không tìm thấy email!', 'error');
        return;
    }
    
    // Tạo mã mới
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCode = code;
    
    // Cập nhật session
    const expiryTime = Date.now() + 60000;
    sessionStorage.setItem('resetCode', code);
    sessionStorage.setItem('codeExpiry', expiryTime);
    
    console.log('📧 Mã mới:', code);
    showNotification('Đã gửi lại mã xác nhận!', 'success');
    
    // Reset timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    startTimer(60);
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
    
    // Thêm link "Quên mật khẩu" vào modal đăng nhập
    const authModal = document.getElementById('authModal');
    if (authModal) {
        const linksDiv = authModal.querySelector('.form-links') || document.createElement('div');
        if (!authModal.querySelector('.form-links')) {
            const form = authModal.querySelector('form');
            const forgotLink = document.createElement('p');
            forgotLink.className = 'text-center form-links';
            forgotLink.innerHTML = `
                <a href="#" id="forgotPasswordLink">
                    <i class="fas fa-key"></i> Quên mật khẩu?
                </a>
            `;
            form.appendChild(forgotLink);
        }
    }
    
    // Gắn sự kiện cho link quên mật khẩu
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('authModal');
            openForgotPasswordModal();
        });
    }
    
    // Gắn sự kiện cho form quên mật khẩu
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Gắn sự kiện cho form OTP
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleVerifyOtp);
    }
    
    // Gắn sự kiện cho form đặt lại mật khẩu
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }
    
    // Gắn sự kiện cho nút gửi lại mã
    const resendBtn = document.getElementById('resendOtpBtn');
    if (resendBtn) {
        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resendOtp();
        });
    }
    
    // Gắn sự kiện cho các nút đóng modal
    const closeBtns = [
        'closeForgotModal',
        'closeOtpModal',
        'closeResetModal',
        'backToLoginFromForgot',
        'backToForgotFromOtp'
    ];
    
    closeBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (id.includes('backToLogin')) {
                    closeModal('forgotPasswordModal');
                    if (window.openAuthModal) {
                        window.openAuthModal(true);
                    }
                } else if (id.includes('backToForgot')) {
                    closeModal('otpModal');
                    openForgotPasswordModal();
                } else {
                    const modalId = id.replace('close', '').replace('backTo', '').toLowerCase() + 'Modal';
                    closeModal(modalId);
                }
            });
        }
    });
    
    // Gắn sự kiện hiển thị/ẩn mật khẩu
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

export default {
    initForgotPassword,
    openForgotPasswordModal,
    closeModal
};