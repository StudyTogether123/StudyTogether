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

    const post = sampleData.knowledgeContent.find(
        item => String(item.id) === String(id)
    );

    if (!post) {
        console.warn(`Post with id ${id} not found`);
        return;
    }

    hideAllSections();

    const detailSection = document.getElementById('post-detail-section');
    if (!detailSection) return;

    detailSection.classList.remove('hidden-section');

    renderPostContent(post);
}


/* ===============================
   RENDER POST CONTENT
=================================*/
function renderPostContent(post) {

    const container = document.getElementById('post-detail-content');
    if (!container) return;

    const isQuiz = post.type === 'quiz';

    const readingTime = calculateReadingTime(post.description);

    let contentHtml = '';

    if (isQuiz) {

        contentHtml = `
            <div class="medium-quiz-wrapper">

                <div class="quiz-intro">
                    <h3>🧠 Thử sức với bài Quiz</h3>
                    <p>Kiểm tra kiến thức của bạn sau khi đọc bài viết.</p>
                </div>

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

        contentHtml = `
            <div class="medium-content">
                ${formatPostContent(post.description)}
            </div>
        `;
    }

    container.innerHTML = `
        <article class="medium-article">

            <!-- Header -->
            <header class="medium-header">

                <div class="medium-category">
                    ${escapeHtml(post.category || 'General')}
                </div>

                <h1 class="medium-title">
                    ${escapeHtml(post.title)}
                </h1>

                <div class="medium-meta">
                    <span>${escapeHtml(post.date || '')}</span>
                    <span>•</span>
                    <span>${readingTime} phút đọc</span>
                </div>

            </header>

            <!-- Cover Image -->
            ${post.image ? `
                <div class="medium-cover">
                    <img 
                        src="${escapeHtml(post.image)}"
                        alt="${escapeHtml(post.title)}"
                        loading="lazy"
                    />
                </div>
            ` : ''}

            <!-- Body -->
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
   FORMAT BLOG CONTENT
=================================*/
function formatPostContent(text = '') {

    // Chia đoạn theo xuống dòng
    const paragraphs = text.split('\n');

    return paragraphs.map(p => {

        if (p.startsWith('## ')) {
            return `<h2 class="medium-subtitle">${escapeHtml(p.replace('## ', ''))}</h2>`;
        }

        if (p.startsWith('> ')) {
            return `<blockquote class="medium-quote">${escapeHtml(p.replace('> ', ''))}</blockquote>`;
        }

        if (p.startsWith('- ')) {
            return `<li>${escapeHtml(p.replace('- ', ''))}</li>`;
        }

        return `<p>${escapeHtml(p)}</p>`;

    }).join('');
}


/* ===============================
   BUTTON HANDLERS
=================================*/
function setupBackButton() {

    const backButton = document.getElementById('backToKnowledgeBtn');
    if (!backButton) return;

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
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
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