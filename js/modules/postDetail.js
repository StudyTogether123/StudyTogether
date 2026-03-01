import { sampleData } from './data.js';
import { 
    renderQuizQuestions, 
    showQuizResult, 
    updateStatsAfterQuiz, 
    resetQuizAnswers 
} from './quiz.js';

/* ===============================
   LOAD POST DETAIL
=================================*/
export function loadPostDetail(id) {
    console.log('Loading post detail for ID:', id, 'Type:', typeof id);
    
    // Chuyển id về số nguyên
    const postId = parseInt(id);
    console.log('Parsed ID:', postId);
    
    // Tìm bài viết với so sánh số
    const post = sampleData.knowledgeContent.find(
        item => item.id === postId  // So sánh số với số
    );

    if (!post) {
        console.warn(`Post with id ${id} (parsed: ${postId}) not found`);
        console.log('Available IDs:', sampleData.knowledgeContent.map(item => item.id));
        
        if (typeof toastr !== 'undefined') {
            toastr.error('Không tìm thấy bài viết!');
        }
        return;
    }

    console.log('Found post:', post.title);
    hideAllSections();

    const detailSection = document.getElementById('post-detail-section');
    if (!detailSection) {
        console.error('post-detail-section not found');
        return;
    }

    detailSection.classList.remove('hidden-section');
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    renderPostContent(post);
}

/* ===============================
   RENDER POST CONTENT
=================================*/
function renderPostContent(post) {

    const container = document.getElementById('post-detail-content');
    if (!container) return;

    const isQuiz = post.type === 'quiz';

    // SỬA QUAN TRỌNG: Tính thời gian đọc từ content thay vì description
    const readingTime = calculateReadingTime(post.content || post.description || '');

    let contentHtml = '';

    if (isQuiz) {
        // Nếu là quiz
        contentHtml = `
            <div class="medium-quiz-wrapper">
                <div class="quiz-intro">
                    <h3>🧠 Thử sức với bài Quiz</h3>
                    <p>Kiểm tra kiến thức của bạn sau khi đọc bài viết.</p>
                </div>

                <!-- Mô tả ngắn (nếu có) -->
                ${post.description ? `<p class="quiz-description">${escapeHtml(post.description)}</p>` : ''}

                <div id="quizQuestions" class="quiz-questions"></div>
                <div id="quizResult" class="quiz-result hidden"></div>

                <div class="quiz-actions">
                    <button class="btn-primary" id="submitQuizBtn">
                        🚀 Nộp bài
                    </button>
                </div>
            </div>
        `;
    } else {
        // SỬA QUAN TRỌNG: Hiển thị content dưới dạng HTML thuần
        contentHtml = `
            <div class="medium-content">
                <!-- HIỂN THỊ TRỰC TIẾP HTML TỪ post.content -->
                ${post.content || formatPostContent(post.description)}
            </div>
        `;
    }

    // Render toàn bộ bài viết
    container.innerHTML = `
        <article class="medium-article">

            <!-- Header -->
            <header class="medium-header">
                <div class="medium-category">
                    ${escapeHtml(post.category || 'Kiến thức')}
                </div>

                <h1 class="medium-title">
                    ${escapeHtml(post.title)}
                </h1>

                <div class="medium-meta">
                    <span>${escapeHtml(post.date || '')}</span>
                    <span>•</span>
                    <span>${readingTime} phút đọc</span>
                </div>

                <!-- Hiển thị description như một phần giới thiệu ngắn -->
                ${post.description && post.content ? `
                    <p class="medium-description">${escapeHtml(post.description)}</p>
                ` : ''}
            </header>

            <!-- Cover Image -->
            ${post.image ? `
                <div class="medium-cover">
                    <img 
                        src="${escapeHtml(post.image)}"
                        alt="${escapeHtml(post.title)}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'"
                    />
                </div>
            ` : ''}

            <!-- Body - Nội dung chính -->
            ${contentHtml}

            <!-- Footer -->
            <footer class="medium-footer">
                <button class="btn-outline" id="backToKnowledgeBtn">
                    ← Quay lại
                </button>
            </footer>

        </article>
    `;

    setupBackButton();

    if (isQuiz) {
        resetQuizAnswers();
        setTimeout(() => {
            renderQuizQuestions();
            setupQuizSubmitButton();
        }, 100);
    }
}

/* ===============================
   FORMAT BLOG CONTENT (FALLBACK)
   Chỉ dùng khi không có content
=================================*/
function formatPostContent(text = '') {
    if (!text) return '';
    
    // Chia đoạn theo xuống dòng
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');

    let inList = false;
    let listItems = [];
    let html = '';

    paragraphs.forEach(p => {
        // Xử lý heading
        if (p.startsWith('## ')) {
            if (inList) {
                html += `<ul>${listItems.join('')}</ul>`;
                listItems = [];
                inList = false;
            }
            html += `<h2 class="medium-subtitle">${escapeHtml(p.replace('## ', ''))}</h2>`;
        }
        // Xử lý blockquote
        else if (p.startsWith('> ')) {
            if (inList) {
                html += `<ul>${listItems.join('')}</ul>`;
                listItems = [];
                inList = false;
            }
            html += `<blockquote class="medium-quote">${escapeHtml(p.replace('> ', ''))}</blockquote>`;
        }
        // Xử lý list item
        else if (p.startsWith('- ') || p.startsWith('* ')) {
            inList = true;
            listItems.push(`<li>${escapeHtml(p.replace(/^[-*]\s/, ''))}</li>`);
        }
        // Xử lý paragraph thường
        else {
            if (inList) {
                html += `<ul>${listItems.join('')}</ul>`;
                listItems = [];
                inList = false;
            }
            html += `<p>${escapeHtml(p)}</p>`;
        }
    });

    // Đóng list nếu còn
    if (inList) {
        html += `<ul>${listItems.join('')}</ul>`;
    }

    return html;
}

/* ===============================
   BUTTON HANDLERS
=================================*/
function setupBackButton() {
    const backButton = document.getElementById('backToKnowledgeBtn');
    if (!backButton) return;

    // Xóa event cũ bằng cách clone
    const newBtn = backButton.cloneNode(true);
    backButton.parentNode.replaceChild(newBtn, backButton);

    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closePostDetail();
    });
}

function setupQuizSubmitButton() {
    const submitBtn = document.getElementById('submitQuizBtn');
    if (!submitBtn) return;

    const newBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newBtn, submitBtn);

    newBtn.addEventListener('click', function() {
        const result = showQuizResult();
        updateStatsAfterQuiz(result);

        this.style.display = 'none';

        const resultDiv = document.getElementById('quizResult');
        if (resultDiv) resultDiv.classList.remove('hidden');
    });
}

/* ===============================
   CLOSE DETAIL
=================================*/
function closePostDetail() {
    const detailSection = document.getElementById('post-detail-section');
    const knowledgeSection = document.getElementById('knowledge-section');

    if (detailSection) detailSection.classList.add('hidden-section');
    if (knowledgeSection) knowledgeSection.classList.remove('hidden-section');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    resetQuizAnswers();
}

/* ===============================
   HELPERS
=================================*/
function hideAllSections() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden-section');
    });
}

function calculateReadingTime(text = '') {
    if (!text) return 1;
    const wordsPerMinute = 200;
    // Loại bỏ HTML tags nếu có
    const plainText = text.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}