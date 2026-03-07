// js/modules/quiz.js
import { sampleData, appState } from './data.js';
import { renderQuizHistory } from './ui.js';
import { authService } from '../services/auth.service.js'; // THÊM IMPORT

/* ===============================
   KIỂM TRA DỮ LIỆU
================================= */
function validateQuizData() {
    if (!sampleData?.dailyQuiz?.questions?.length) {
        return { valid: false, message: 'Chưa có câu hỏi nào' };
    }
    return { valid: true, data: sampleData.dailyQuiz };
}

/* ===============================
   BẮT ĐẦU LÀM QUIZ
================================= */
export function startQuiz() {
    console.log('🚀 Bắt đầu làm quiz');
    
    const quizQuestions = document.getElementById('quizQuestions');
    const quizResult = document.getElementById('quizResult');
    const startBtn = document.getElementById('startQuizNowBtn');
    const submitBtn = document.getElementById('submitQuizBtn');
    
    if (quizQuestions) {
        quizQuestions.style.display = 'block';
        quizQuestions.classList.add('fade-in');
        
        setTimeout(() => {
            quizQuestions.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    
    if (quizResult) {
        quizResult.style.display = 'none';
    }
    
    if (startBtn) {
        startBtn.style.display = 'none';
    }
    
    if (submitBtn) {
        submitBtn.style.display = 'inline-block';
        submitBtn.classList.remove('pulse-animation');
    }
    
    renderQuizQuestions();
}

/* ===============================
   ĐÓNG QUIZ VÀ QUAY LẠI
================================= */
export function closeQuiz() {
    console.log('🔚 Đóng quiz');
    
    const quizQuestions = document.getElementById('quizQuestions');
    const quizResult = document.getElementById('quizResult');
    const startBtn = document.getElementById('startQuizNowBtn');
    const submitBtn = document.getElementById('submitQuizBtn');
    const closeBtn = document.getElementById('closeQuizResultBtn');
    
    if (quizQuestions) quizQuestions.style.display = 'none';
    if (quizResult) quizResult.style.display = 'none';
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (submitBtn) submitBtn.style.display = 'none';
    if (closeBtn) closeBtn.style.display = 'none';
    
    resetQuizAnswers();
}

/* ===============================
   HIỂN THỊ CÂU HỎI QUIZ
================================= */
export function renderQuizQuestions() {
    console.log('%c=== RENDER QUIZ QUESTIONS ===', 'color: #4361ee; font-weight: bold');
    
    const container = document.getElementById('quizQuestions');
    if (!container) {
        console.error('❌ Không tìm thấy element #quizQuestions');
        return;
    }

    appState.currentQuizAnswers = {};

    const validation = validateQuizData();
    if (!validation.valid) {
        container.innerHTML = `
            <div class="quiz-empty-state">
                <i class="fas fa-question-circle"></i>
                <h3>${validation.message}</h3>
                <p>Vui lòng quay lại sau để làm quiz nhé!</p>
                <button class="btn btn-outline" id="backToQuizMenuBtn">
                    <i class="fas fa-arrow-left"></i> Quay lại
                </button>
            </div>
        `;
        
        const backBtn = document.getElementById('backToQuizMenuBtn');
        if (backBtn) backBtn.addEventListener('click', closeQuiz);
        return;
    }

    const quiz = validation.data;
    const questions = quiz.questions;
    const totalQuestions = questions.length;

    let questionsHtml = '';
    
    questions.forEach((q, index) => {
        const questionId = q.id || `q${index + 1}`;
        
        let optionsHtml = '';
        if (q.options && Array.isArray(q.options)) {
            q.options.forEach((option, optIndex) => {
                const optionLetter = String.fromCharCode(65 + optIndex);
                optionsHtml += `
                    <div class="quiz-option" data-question="${questionId}" data-answer="${optIndex}">
                        <span class="option-letter">${optionLetter}</span>
                        <span class="option-text">${option || ''}</span>
                    </div>
                `;
            });
        }

        questionsHtml += `
            <div class="quiz-question-card" data-id="${questionId}">
                <div class="question-header">
                    <span class="question-number">Câu ${index + 1}/${totalQuestions}</span>
                </div>
                <h3 class="question-title">${q.question || 'Không có câu hỏi'}</h3>
                <div class="quiz-options-container">
                    ${optionsHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="quiz-header">
            <div class="quiz-header-top">
                <h2 class="quiz-main-title">${quiz.title || 'Quiz hàng ngày'}</h2>
                <button class="btn-close-quiz" id="closeQuizBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${quiz.description ? `<p class="quiz-description">${quiz.description}</p>` : ''}
            <div class="quiz-progress-info">
                <span><i class="fas fa-list"></i> ${totalQuestions} câu hỏi</span>
                <span><i class="fas fa-star"></i> ${totalQuestions * 10} điểm tối đa</span>
            </div>
        </div>
        <div class="quiz-questions-container">
            ${questionsHtml}
        </div>
    `;

    attachQuizEvents();
    
    const closeQuizBtn = document.getElementById('closeQuizBtn');
    if (closeQuizBtn) closeQuizBtn.addEventListener('click', closeQuiz);
    
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.style.display = 'inline-block';
        submitBtn.classList.remove('pulse-animation');
    }
}

/* ===============================
   GẮN SỰ KIỆN CHO QUIZ
================================= */
function attachQuizEvents() {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.removeEventListener('click', handleQuizOptionClick);
        option.addEventListener('click', handleQuizOptionClick);
    });

    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn && !submitBtn.hasAttribute('data-listener')) {
        submitBtn.setAttribute('data-listener', 'true');
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const result = showQuizResult();
            if (result) {
                updateStatsAfterQuiz(result);
            }
        });
    }

    const closeResultBtn = document.getElementById('closeQuizResultBtn');
    if (closeResultBtn && !closeResultBtn.hasAttribute('data-listener')) {
        closeResultBtn.setAttribute('data-listener', 'true');
        closeResultBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeQuiz();
        });
    }
}

/* ===============================
   XỬ LÝ CLICK VÀO ĐÁP ÁN
================================= */
function handleQuizOptionClick(e) {
    const element = e.currentTarget;
    const questionId = element.dataset.question;
    const answerId = parseInt(element.dataset.answer);

    document.querySelectorAll(`.quiz-option[data-question="${questionId}"]`)
        .forEach(opt => opt.classList.remove('selected'));

    element.classList.add('selected');
    element.style.animation = 'optionPulse 0.3s ease';

    appState.currentQuizAnswers[questionId] = answerId;

    const validation = validateQuizData();
    if (validation.valid) {
        const totalQuestions = validation.data.questions.length;
        const answeredCount = Object.keys(appState.currentQuizAnswers).length;
        
        const submitBtn = document.getElementById('submitQuizBtn');
        if (submitBtn) {
            if (answeredCount === totalQuestions) {
                submitBtn.classList.add('pulse-animation');
            } else {
                submitBtn.classList.remove('pulse-animation');
            }
        }
    }
}

/* ===============================
   TÍNH ĐIỂM
================================= */
function calculateQuizScore() {
    const validation = validateQuizData();
    if (!validation.valid) {
        return { score: 0, total: 0, percentage: 0 };
    }
    
    const questions = validation.data.questions;
    const totalQuestions = questions.length;
    let score = 0;

    questions.forEach((q, index) => {
        const questionId = q.id || `q${index + 1}`;
        const userAnswer = appState.currentQuizAnswers[questionId];
        
        if (userAnswer !== undefined && userAnswer === q.correctAnswer) {
            score++;
        }
    });

    return {
        score,
        total: totalQuestions,
        percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
    };
}

/* ===============================
   HIỂN THỊ KẾT QUẢ
================================= */
export function showQuizResult() {
    if (Object.keys(appState.currentQuizAnswers).length === 0) {
        showNotification('Bạn chưa trả lời câu nào!', 'warning');
        return null;
    }
    
    const result = calculateQuizScore();
    const container = document.getElementById('quizResult');
    const submitBtn = document.getElementById('submitQuizBtn');
    
    if (!container) return null;

    if (submitBtn) submitBtn.style.display = 'none';

    let resultHtml = `
        <div class="quiz-result-container">
            <div class="result-header">
                <h2>Kết quả của bạn</h2>
                <div class="score-circle ${getScoreClass(result.percentage)}">
                    <span class="score-number">${result.score}</span>
                    <span class="score-total">/${result.total}</span>
                </div>
                <div class="score-percentage">${result.percentage}%</div>
                <div class="score-points">
                    <i class="fas fa-star"></i>
                    +${result.score * 10} điểm
                </div>
            </div>
            
            <div class="result-details">
                <h3>Chi tiết câu trả lời</h3>
    `;

    const validation = validateQuizData();
    if (validation.valid) {
        validation.data.questions.forEach((q, index) => {
            const questionId = q.id || `q${index + 1}`;
            const isCorrect = appState.currentQuizAnswers[questionId] === q.correctAnswer;
            
            let userAnswer = "Chưa trả lời";
            if (appState.currentQuizAnswers[questionId] !== undefined && q.options) {
                userAnswer = q.options[appState.currentQuizAnswers[questionId]] || "Không xác định";
            }
            
            const correctAnswer = q.options?.[q.correctAnswer] || "Không xác định";

            resultHtml += `
                <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="result-question">
                        <span class="result-number">Câu ${index + 1}</span>
                        <span class="result-icon">
                            <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        </span>
                    </div>
                    <p class="result-question-text">${q.question || ''}</p>
                    <div class="result-answers">
                        <div class="user-answer">
                            <span class="label">Bạn chọn:</span>
                            <span class="value">${userAnswer}</span>
                        </div>
                        ${!isCorrect ? `
                            <div class="correct-answer">
                                <span class="label">Đáp án đúng:</span>
                                <span class="value">${correctAnswer}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }

    resultHtml += `
            </div>
            <div class="result-actions">
                <button class="btn btn-outline" id="backToQuizMenuBtn">
                    <i class="fas fa-arrow-left"></i> Quay lại
                </button>
                <button class="btn btn-primary" id="retryQuizBtn">
                    <i class="fas fa-redo"></i> Làm lại
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = resultHtml;
    
    const backBtn = document.getElementById('backToQuizMenuBtn');
    if (backBtn) backBtn.addEventListener('click', closeQuiz);
    
    const retryBtn = document.getElementById('retryQuizBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            resetQuizAnswers();
            renderQuizQuestions();
        });
    }
    
    container.style.display = 'block';
    container.classList.add('fade-in');

    return result;
}

/* ===============================
   RESET QUIZ
================================= */
export function resetQuizAnswers() {
    appState.currentQuizAnswers = {};
    
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.style.display = 'inline-block';
        submitBtn.classList.remove('pulse-animation');
    }
    
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
}

/* ===============================
   CẬP NHẬT THỐNG KÊ
================================= */
export function updateStatsAfterQuiz(result) {
    if (!result || result.score <= 0) return;

    // Cập nhật số người đã làm hôm nay (UI thống kê)
    const quizCompletedToday = document.getElementById('quizCompletedToday');
    if (quizCompletedToday) {
        let currentCompleted = parseInt(quizCompletedToday.textContent) || 0;
        currentCompleted += 1;
        quizCompletedToday.textContent = currentCompleted;
    }

    // Tính điểm vừa đạt được
    const pointsEarned = result.score * 10;

    // Cập nhật điểm qua authService
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
        const newPoints = (currentUser.points || 0) + pointsEarned;
        authService.updatePoints(newPoints);
    }

    // Lưu lịch sử quiz vào sampleData (demo)
    if (!sampleData.quizHistory) sampleData.quizHistory = [];

    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    sampleData.quizHistory.unshift({
        id: Date.now(),
        date: dateStr,
        topic: sampleData.dailyQuiz?.title || 'Quiz hàng ngày',
        score: `${result.score}/${result.total}`,
        points: pointsEarned,
        percentage: result.percentage
    });

    // Giới hạn lịch sử 10 item
    if (sampleData.quizHistory.length > 10) {
        sampleData.quizHistory.pop();
    }
    
    // Cập nhật hiển thị lịch sử
    const quizHistoryContainer = document.getElementById('quiz-history');
    if (quizHistoryContainer && typeof renderQuizHistory === 'function') {
        renderQuizHistory();
        showNotification(`Bạn đã nhận được ${pointsEarned} điểm!`, 'success');
    }

    // Đồng thời cập nhật appState.currentUser.points nếu vẫn dùng (tùy chọn)
    if (appState.currentUser) {
        appState.currentUser.points = (parseInt(appState.currentUser.points) || 0) + pointsEarned;
    }
}

/* ===============================
   HELPER FUNCTIONS
================================= */
function getScoreClass(percentage) {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'average';
    return 'poor';
}

function showNotification(message, type = 'info') {
    if (window.toastr) {
        toastr[type](message);
    } else {
        alert(message);
    }
}

/* ===============================
   KHỞI TẠO QUIZ
================================= */
export function initQuiz() {
    console.log('%c=== INITIALIZING QUIZ ===', 'color: #4361ee; font-weight: bold');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupQuiz);
    } else {
        setupQuiz();
    }
}

function setupQuiz() {
    const startQuizNowBtn = document.getElementById('startQuizNowBtn');
    if (startQuizNowBtn) {
        startQuizNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!authService.isAuthenticated()) {
                showNotification('Vui lòng đăng nhập để làm quiz!', 'warning');
                if (window.openAuthModal) window.openAuthModal(true);
                return;
            }
            
            startQuiz();
        });
    }
    
    const refreshHistoryBtn = document.getElementById('refreshQuizHistoryBtn');
    if (refreshHistoryBtn) {
        refreshHistoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof renderQuizHistory === 'function') {
                renderQuizHistory();
                showNotification('Đã làm mới lịch sử quiz!', 'success');
            }
        });
    }
    
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        
        newSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const result = showQuizResult();
            if (result) updateStatsAfterQuiz(result);
        });
    }
    
    const closeBtn = document.getElementById('closeQuizResultBtn');
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeQuiz();
        });
    }
}

export default {
    renderQuizQuestions,
    showQuizResult,
    resetQuizAnswers,
    initQuiz,
    updateStatsAfterQuiz,
    startQuiz,
    closeQuiz
};