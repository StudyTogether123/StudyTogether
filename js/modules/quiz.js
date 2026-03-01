import { sampleData, appState } from './data.js';

/* ===============================
   KIỂM TRA VÀ LOG DỮ LIỆU
================================= */
function debugQuizData() {
    console.log('%c=== DEBUG QUIZ DATA ===', 'color: blue; font-weight: bold');
    console.log('sampleData exists:', !!sampleData);
    console.log('dailyQuiz exists:', !!sampleData?.dailyQuiz);
    console.log('questions:', sampleData?.dailyQuiz?.questions);
    console.log('questions length:', sampleData?.dailyQuiz?.questions?.length);
    console.log('appState:', appState);
    console.log('%c========================', 'color: blue; font-weight: bold');
}

/* ===============================
   HIỂN THỊ CÂU HỎI QUIZ
================================= */
export function renderQuizQuestions() {
    console.log('%c=== RENDER QUIZ QUESTIONS ===', 'color: green; font-weight: bold');
    
    // Debug dữ liệu
    debugQuizData();
    
    const container = document.getElementById('quizQuestions');
    if (!container) {
        console.error('❌ Không tìm thấy element #quizQuestions trong DOM');
        return;
    }

    console.log('✅ Tìm thấy container #quizQuestions');

    // Reset câu trả lời trước khi render
    appState.currentQuizAnswers = {};

    // Kiểm tra dữ liệu quiz
    if (!sampleData) {
        console.error('❌ sampleData không tồn tại');
        container.innerHTML = '<div class="error-message" style="color: red; padding: 20px; text-align: center;">Lỗi: Không tìm thấy dữ liệu</div>';
        return;
    }

    if (!sampleData.dailyQuiz) {
        console.error('❌ dailyQuiz không tồn tại trong sampleData');
        container.innerHTML = '<div class="error-message" style="color: red; padding: 20px; text-align: center;">Lỗi: dailyQuiz không tồn tại</div>';
        return;
    }

    if (!sampleData.dailyQuiz.questions || !Array.isArray(sampleData.dailyQuiz.questions)) {
        console.error('❌ dailyQuiz.questions không hợp lệ:', sampleData.dailyQuiz.questions);
        container.innerHTML = '<div class="error-message" style="color: red; padding: 20px; text-align: center;">Lỗi: Dữ liệu câu hỏi không hợp lệ</div>';
        return;
    }

    if (sampleData.dailyQuiz.questions.length === 0) {
        console.warn('⚠️ dailyQuiz.questions là mảng rỗng');
        container.innerHTML = '<div class="error-message" style="color: orange; padding: 20px; text-align: center;">Chưa có câu hỏi nào</div>';
        return;
    }

    console.log(`✅ Bắt đầu render ${sampleData.dailyQuiz.questions.length} câu hỏi`);

    // Bắt đầu render
    let html = `
        <div class="quiz-header">
            <h2>${sampleData.dailyQuiz.title || 'Quiz hàng ngày'}</h2>
            ${sampleData.dailyQuiz.description ? `<p class="quiz-description">${sampleData.dailyQuiz.description}</p>` : ''}
        </div>
    `;

    sampleData.dailyQuiz.questions.forEach((q, index) => {
        // Đảm bảo mỗi câu hỏi có id
        const questionId = q.id || `q${index + 1}`;
        
        html += `
            <div class="quiz-question" data-id="${questionId}">
                <h3>Câu ${index + 1}: ${q.question || 'Không có câu hỏi'}</h3>
                <div class="quiz-options">
        `;

        if (q.options && Array.isArray(q.options) && q.options.length > 0) {
            q.options.forEach((option, optIndex) => {
                const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D...
                html += `
                    <div class="quiz-option" 
                         data-question="${questionId}"
                         data-answer="${optIndex}">
                        <span class="option-letter">${optionLetter}.</span>
                        <span class="option-text">${option || ''}</span>
                    </div>
                `;
            });
        } else {
            html += `<div class="error-message" style="color: red;">Không có đáp án cho câu này</div>`;
        }

        html += `</div></div>`;
    });

    // Thêm nút nộp bài nếu chưa có
    const quizActions = document.querySelector('.quiz-actions');
    if (!quizActions) {
        html += `
            <div class="quiz-actions" style="text-align: center; margin: 20px 0;">
                <button id="submitQuizBtn" class="btn btn-primary" style="display: none;">Nộp bài</button>
                <button id="closeQuizResultBtn" class="btn btn-outline" style="display: none;">Đóng</button>
            </div>
        `;
    }

    container.innerHTML = html;
    console.log('✅ Đã render HTML vào container');

    // Gắn sự kiện chọn đáp án
    attachQuizEvents();
    
    // Reset UI
    toggleQuizUI(false);
    
    console.log('✅ Hoàn thành render quiz');
}

/* ===============================
   GẮN SỰ KIỆN CHO QUIZ
================================= */
function attachQuizEvents() {
    const options = document.querySelectorAll('.quiz-option');
    console.log(`🔍 Tìm thấy ${options.length} đáp án để gắn sự kiện`);
    
    if (options.length === 0) {
        console.warn('⚠️ Không tìm thấy .quiz-option nào để gắn sự kiện');
    }
    
    options.forEach(option => {
        // Xóa event cũ trước khi gắn mới
        option.removeEventListener('click', handleQuizOptionClick);
        option.addEventListener('click', handleQuizOptionClick);
    });
}

/* ===============================
   XỬ LÝ CLICK VÀO ĐÁP ÁN
================================= */
function handleQuizOptionClick(e) {
    const element = e.currentTarget;
    const questionId = element.dataset.question;
    const answerId = parseInt(element.dataset.answer);

    console.log(`📝 Đã chọn câu ${questionId}, đáp án ${answerId}`);

    // Bỏ selected của cùng câu
    document.querySelectorAll(
        `.quiz-option[data-question="${questionId}"]`
    ).forEach(opt => opt.classList.remove('selected'));

    element.classList.add('selected');

    appState.currentQuizAnswers[questionId] = answerId;
    console.log('📊 Current answers:', appState.currentQuizAnswers);

    // Hiển thị nút nộp khi đủ câu
    if (sampleData.dailyQuiz?.questions) {
        const totalQuestions = sampleData.dailyQuiz.questions.length;
        const answeredCount = Object.keys(appState.currentQuizAnswers).length;
        
        console.log(`📊 Đã trả lời ${answeredCount}/${totalQuestions} câu`);
        
        const submitBtn = document.getElementById('submitQuizBtn');
        if (submitBtn) {
            if (answeredCount === totalQuestions) {
                submitBtn.style.display = 'inline-block';
                submitBtn.disabled = false;
                console.log('✅ Đã hiển thị nút nộp bài');
            } else {
                submitBtn.style.display = 'none';
            }
        } else {
            console.error('❌ Không tìm thấy nút #submitQuizBtn');
        }
    }
}

/* ===============================
   TÍNH ĐIỂM
================================= */
function calculateQuizScore() {
    let score = 0;
    
    if (!sampleData.dailyQuiz?.questions) {
        console.error('❌ Không thể tính điểm: thiếu dữ liệu questions');
        return { score: 0, total: 0, percentage: 0 };
    }
    
    const totalQuestions = sampleData.dailyQuiz.questions.length;

    sampleData.dailyQuiz.questions.forEach((q, index) => {
        const questionId = q.id || `q${index + 1}`;
        const userAnswer = appState.currentQuizAnswers[questionId];
        
        if (userAnswer !== undefined && userAnswer === q.correctAnswer) {
            score++;
            console.log(`✅ Câu ${questionId}: đúng`);
        } else {
            console.log(`❌ Câu ${questionId}: sai (user: ${userAnswer}, correct: ${q.correctAnswer})`);
        }
    });

    const result = {
        score,
        total: totalQuestions,
        percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
    };
    
    console.log('📊 Kết quả quiz:', result);
    return result;
}

/* ===============================
   HIỂN THỊ KẾT QUẢ
================================= */
export function showQuizResult() {
    console.log('%c=== SHOW QUIZ RESULT ===', 'color: purple; font-weight: bold');
    
    // Kiểm tra đã trả lời câu nào chưa
    if (Object.keys(appState.currentQuizAnswers).length === 0) {
        alert('Bạn chưa trả lời câu nào!');
        return;
    }
    
    const result = calculateQuizScore();
    const container = document.getElementById('quizResult');
    
    if (!container) {
        console.error('❌ Không tìm thấy element #quizResult');
        return result;
    }
    
    if (result.total === 0) {
        container.innerHTML = '<p class="error-message" style="color: red;">Không có dữ liệu để hiển thị kết quả</p>';
        return result;
    }

    let html = `
        <div class="quiz-result">
            <h2>Kết quả quiz của bạn</h2>
            <div class="quiz-score" style="font-size: 48px; font-weight: bold; color: #FF6B35; text-align: center; margin: 20px 0;">
                ${result.score}/${result.total}
            </div>
            <p style="text-align: center;">Bạn trả lời đúng ${result.score}/${result.total} câu.</p>
            <p style="text-align: center;">Tỷ lệ đúng: <strong>${result.percentage}%</strong></p>
            <p style="text-align: center;">Điểm nhận được: <strong>${result.score * 10}</strong> điểm</p>
            <div class="quiz-result-details" style="margin-top: 30px;">
    `;

    if (sampleData.dailyQuiz?.questions) {
        sampleData.dailyQuiz.questions.forEach((q, index) => {
            const questionId = q.id || `q${index + 1}`;
            const isCorrect = appState.currentQuizAnswers[questionId] === q.correctAnswer;
            
            let userAnswer = "Chưa trả lời";
            if (appState.currentQuizAnswers[questionId] !== undefined && q.options) {
                userAnswer = q.options[appState.currentQuizAnswers[questionId]] || "Không xác định";
            }
            
            const correctAnswer = q.options && q.options[q.correctAnswer] ? 
                q.options[q.correctAnswer] : "Không xác định";

            html += `
                <div class="quiz-result-item" style="margin-bottom:15px;padding:15px;
                            border-left:4px solid ${isCorrect ? '#4CAF50' : '#F44336'};
                            background:#f9f9f9; border-radius: 5px;">
                    <p><strong>Câu ${index + 1}:</strong> ${q.question || ''}</p>
                    <p>Đáp án bạn chọn:
                       <span style="color:${isCorrect ? '#4CAF50' : '#F44336'}; font-weight:bold;">
                       ${userAnswer}
                       </span>
                    </p>
                    ${!isCorrect ? `
                        <p>Đáp án đúng:
                            <span style="color:#4CAF50; font-weight:bold;">${correctAnswer}</span>
                        </p>
                    ` : ''}
                </div>
            `;
        });
    }

    html += `</div>
        <div style="text-align: center; margin-top: 20px;">
            <button class="btn btn-primary" id="retryQuizBtn">Làm lại quiz</button>
        </div>
    </div>`;
    
    container.innerHTML = html;
    
    // Gắn sự kiện cho nút làm lại
    const retryBtn = document.getElementById('retryQuizBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            resetQuizAnswers();
            renderQuizQuestions();
            toggleQuizUI(false);
        });
    }
    
    toggleQuizUI(true);

    console.log('✅ Đã hiển thị kết quả');
    return result;
}

/* ===============================
   RESET QUIZ
================================= */
export function resetQuizAnswers() {
    appState.currentQuizAnswers = {};
    
    // Reset UI
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
        submitBtn.disabled = false;
    }
    
    // Bỏ selected tất cả options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    console.log('🔄 Đã reset quiz answers');
}

/* ===============================
   HELPER FUNCTIONS
================================= */
function toggleQuizUI(showResult) {
    const quizQuestions = document.getElementById('quizQuestions');
    const quizResult = document.getElementById('quizResult');
    const submitBtn = document.getElementById('submitQuizBtn');
    const closeBtn = document.getElementById('closeQuizResultBtn');

    if (quizQuestions) {
        quizQuestions.style.display = showResult ? 'none' : 'block';
    }
    
    if (quizResult) {
        quizResult.style.display = showResult ? 'block' : 'none';
    }

    if (submitBtn) {
        submitBtn.style.display = showResult ? 'none' : 'block';
        submitBtn.disabled = false;
    }
    
    if (closeBtn) {
        closeBtn.style.display = showResult ? 'inline-block' : 'none';
    }
    
    console.log('🔄 Toggle UI:', showResult ? 'Hiển thị kết quả' : 'Hiển thị câu hỏi');
}

/* ===============================
   KHỞI TẠO QUIZ
================================= */
export function initQuiz() {
    console.log('%c=== INITIALIZING QUIZ ===', 'color: orange; font-weight: bold');
    
    // Kiểm tra DOM đã sẵn sàng chưa
    if (document.readyState === 'loading') {
        console.log('⏳ DOM đang loading, chờ load...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✅ DOM đã sẵn sàng');
            setupQuiz();
        });
    } else {
        console.log('✅ DOM đã sẵn sàng');
        setupQuiz();
    }
}

function setupQuiz() {
    // Kiểm tra các element cần thiết
    const quizQuestions = document.getElementById('quizQuestions');
    const submitBtn = document.getElementById('submitQuizBtn');
    const closeBtn = document.getElementById('closeQuizResultBtn');
    
    console.log('🔍 Kiểm tra elements:');
    console.log('- #quizQuestions:', !!quizQuestions);
    console.log('- #submitQuizBtn:', !!submitBtn);
    console.log('- #closeQuizResultBtn:', !!closeBtn);
    
    if (!quizQuestions) {
        console.error('❌ Không tìm thấy #quizQuestions! Hãy kiểm tra file HTML');
        return;
    }
    
    // Gắn sự kiện cho nút submit
    if (submitBtn) {
        // Xóa event cũ
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        
        newSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📝 Submit button clicked');
            const result = showQuizResult();
            if (result && result.score > 0) {
                updateStatsAfterQuiz(result);
            }
        });
        console.log('✅ Đã gắn sự kiện cho nút submit');
    }
    
    // Gắn sự kiện cho nút đóng
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📝 Close button clicked');
            toggleQuizUI(false);
        });
        console.log('✅ Đã gắn sự kiện cho nút close');
    }
}

/* ===============================
   CẬP NHẬT THỐNG KÊ
================================= */
export function updateStatsAfterQuiz(result) {
    if (result.score <= 0) return;

    // Cập nhật số lần hoàn thành
    const quizCompletedToday = document.getElementById('quizCompletedToday');
    if (quizCompletedToday) {
        let currentCompleted = parseInt(quizCompletedToday.textContent) || 0;
        currentCompleted += 1;
        quizCompletedToday.textContent = currentCompleted;
    }

    // Cập nhật phần trăm (giả định)
    const percentage = 42; // Giữ nguyên để demo
    updateQuizProgress(percentage);

    // Lưu lịch sử
    if (!sampleData.quizHistory) {
        sampleData.quizHistory = [];
    }

    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    sampleData.quizHistory.unshift({
        date: dateStr,
        topic: sampleData.dailyQuiz?.title || 'Quiz hàng ngày',
        score: `${result.score}/${result.total}`,
        points: result.score * 10
    });

    // Giới hạn lịch sử 10 item
    if (sampleData.quizHistory.length > 10) {
        sampleData.quizHistory.pop();
    }
    
    // Cập nhật lịch sử hiển thị
    const quizHistoryContainer = document.getElementById('quiz-history');
    if (quizHistoryContainer && typeof renderQuizHistory === 'function') {
        renderQuizHistory();
    }
    
    console.log('✅ Đã cập nhật thống kê');
}

function updateQuizProgress(percent) {
    const elements = ['quizPercentage', 'quizPercentage2'];
    const bars = ['quizProgressBar', 'quizProgressBar2'];

    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = `${percent}%`;
        }
    });

    bars.forEach(id => {
        const bar = document.getElementById(id);
        if (bar) {
            bar.style.width = `${percent}%`;
            bar.setAttribute('aria-valuenow', percent);
        }
    });
}

// Không tự động khởi tạo khi import - để main.js quyết định
// initQuiz();