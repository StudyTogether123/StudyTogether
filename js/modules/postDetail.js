// js/modules/postDetail.js
import { sampleData } from './data.js';
import {
    renderQuizQuestions,
    showQuizResult,
    resetQuizAnswers,
    updateStatsAfterQuiz
} from './quiz.js';

/* ===============================
   LOAD POST DETAIL
=================================*/
export function loadPostDetail(id) {
    console.log('Loading post detail for ID:', id, 'Type:', typeof id);

    const postId = parseInt(id);
    const post = sampleData.knowledgeContent.find(item => item.id === postId);

    if (!post) {
        console.warn(`Post with id ${id} not found`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderPostContent(post);
}

/* ===============================
   RENDER POST CONTENT
=================================*/
function renderPostContent(post) {
    const container = document.getElementById('post-detail-content');
    if (!container) return;

    const isQuiz = post.type === 'quiz';
    const readingTime = calculateReadingTime(post.content || post.description || '');

    let contentHtml = '';

    if (isQuiz) {
        contentHtml = `
            <div class="medium-quiz-wrapper">
                <div class="quiz-intro">
                    <h3>🧠 Thử sức với bài Quiz</h3>
                    <p>Kiểm tra kiến thức của bạn sau khi đọc bài viết.</p>
                </div>
                ${post.description ? `<p class="quiz-description">${escapeHtml(post.description)}</p>` : ''}
                <div id="quizQuestions" class="quiz-questions"></div>
                <div id="quizResult" class="quiz-result hidden"></div>
                <div class="quiz-actions">
                    <button class="btn-primary" id="submitQuizBtn">🚀 Nộp bài</button>
                </div>
            </div>
        `;
    } else {
        contentHtml = `
            <div class="medium-content">
                ${post.content || formatPostContent(post.description)}
            </div>
        `;
    }

    container.innerHTML = `
        <article class="medium-article">
            <header class="medium-header">
                <div class="medium-category">${escapeHtml(post.category || 'Kiến thức')}</div>
                <h1 class="medium-title">${escapeHtml(post.title)}</h1>
                <div class="medium-meta">
                    <span>${escapeHtml(post.date || '')}</span>
                    <span>•</span>
                    <span>${readingTime} phút đọc</span>
                </div>
                ${post.description && post.content ? `<p class="medium-description">${escapeHtml(post.description)}</p>` : ''}
            </header>
            ${post.image ? `
                <div class="medium-cover">
                    <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy"
                         onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'">
                </div>
            ` : ''}
            ${contentHtml}
            <footer class="medium-footer">
                <button class="btn-outline" id="backToKnowledgeBtn">← Quay lại</button>
            </footer>
        </article>
    `;

    setupBackButton();

    if (isQuiz) {
        // Reset quiz state và render câu hỏi (dùng sampleData.dailyQuiz qua quiz.js)
        resetQuizAnswers();
        setTimeout(() => {
            renderQuizQuestions();
        }, 100);
    }
}

/* ===============================
   BUTTON HANDLERS
=================================*/
function setupBackButton() {
    const backButton = document.getElementById('backToKnowledgeBtn');
    if (!backButton) return;

    const newBtn = backButton.cloneNode(true);
    backButton.parentNode.replaceChild(newBtn, backButton);

    newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closePostDetail();
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const plainText = text.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}

function formatPostContent(text = '') {
    if (!text) return '';
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    let inList = false;
    let listItems = [];
    let html = '';

    paragraphs.forEach(p => {
        if (p.startsWith('## ')) {
            if (inList) { html += `<ul>${listItems.join('')}</ul>`; listItems = []; inList = false; }
            html += `<h2 class="medium-subtitle">${escapeHtml(p.replace('## ', ''))}</h2>`;
        } else if (p.startsWith('> ')) {
            if (inList) { html += `<ul>${listItems.join('')}</ul>`; listItems = []; inList = false; }
            html += `<blockquote class="medium-quote">${escapeHtml(p.replace('> ', ''))}</blockquote>`;
        } else if (p.startsWith('- ') || p.startsWith('* ')) {
            inList = true;
            listItems.push(`<li>${escapeHtml(p.replace(/^[-*]\s/, ''))}</li>`);
        } else {
            if (inList) { html += `<ul>${listItems.join('')}</ul>`; listItems = []; inList = false; }
            html += `<p>${escapeHtml(p)}</p>`;
        }
    });
    if (inList) html += `<ul>${listItems.join('')}</ul>`;
    return html;
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