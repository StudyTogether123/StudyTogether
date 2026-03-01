import { sampleData } from './data.js';
import { renderQuizQuestions, showQuizResult, updateStatsAfterQuiz, resetQuizAnswers } from './quiz.js';

export function loadPostDetail(id) {
    const post = sampleData.knowledgeContent.find(
        item => String(item.id) === String(id)
    );

    if (!post) {
        console.warn(`Post with id ${id} not found`);
        return;
    }

    // Hide all sections
    hideAllSections();
    
    // Show post detail section
    const detailSection = document.getElementById('post-detail-section');
    if (!detailSection) {
        console.error('Post detail section not found');
        return;
    }
    detailSection.classList.remove('hidden-section');

    // Clear old content
    const container = document.getElementById('post-detail-content');
    if (container) {
        container.innerHTML = ''; // Clear trước khi render mới
    }

    // Render post content
    renderPostContent(post);
}

function hideAllSections() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden-section');
    });
}

function renderPostContent(post) {
    const container = document.getElementById('post-detail-content');
    if (!container) {
        console.error('Post detail container not found');
        return;
    }
    
    // Kiểm tra nếu là quiz
    const isQuiz = post.type === 'quiz' || post.title?.toLowerCase().includes('quiz');
    
    let contentHtml = '';
    if (isQuiz) {
        contentHtml = `
            <div class="quiz-section">
                <div id="quizQuestions" class="quiz-questions"></div>
                <div id="quizResult" class="quiz-result" style="display: none;"></div>
                
                <div class="quiz-actions">
                    <button class="btn btn-primary" id="submitQuizBtn" style="display: none;">
                        Nộp bài
                    </button>
                </div>
            </div>
        `;
    } else {
        contentHtml = `
            <div class="post-content">
                <p>${escapeHtml(post.description || '')}</p>
            </div>
        `;
    }
    
    container.innerHTML = `
        <article class="post-detail">
            <h2 class="section-title">${escapeHtml(post.title || '')}</h2>

            <div class="post-meta">
                <span class="post-date">${escapeHtml(post.date || '')}</span>
                ${post.category ? `
                    <span class="post-category">${escapeHtml(post.category)}</span>
                ` : ''}
            </div>

            ${post.image ? `
                <div class="post-image-wrapper">
                    <img src="${escapeHtml(post.image)}" 
                         alt="${escapeHtml(post.title)}" 
                         class="post-detail-image"
                         loading="lazy">
                </div>
            ` : ''}

            ${contentHtml}

            <div class="post-actions">
                <button class="btn btn-outline" id="backToKnowledgeBtn">
                    <span aria-hidden="true">←</span> Quay lại Kiến thức
                </button>
            </div>
        </article>
    `;

    // Setup buttons
    setupBackButton();
    
    // Nếu là quiz, render câu hỏi
    if (isQuiz) {
        // Reset quiz answers
        resetQuizAnswers();
        
        // Render quiz questions
        setTimeout(() => {
            renderQuizQuestions();
            setupQuizSubmitButton();
        }, 100);
    }
}

function setupBackButton() {
    const backButton = document.getElementById('backToKnowledgeBtn');
    if (!backButton) return;
    
    // Remove old listener
    const newBackButton = backButton.cloneNode(true);
    backButton.parentNode.replaceChild(newBackButton, backButton);
    
    newBackButton.addEventListener('click', function(e) {
        e.preventDefault();
        closePostDetail();
    });
}

function setupQuizSubmitButton() {
    const submitBtn = document.getElementById('submitQuizBtn');
    if (!submitBtn) return;
    
    // Remove old listener
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    
    newSubmitBtn.addEventListener('click', function() {
        // Show result
        const result = showQuizResult();
        
        // Update stats
        updateStatsAfterQuiz(result);
        
        // Hide submit button
        this.style.display = 'none';
    });
}

function closePostDetail() {
    console.log('Closing post detail...');
    
    const detailSection = document.getElementById('post-detail-section');
    const knowledgeSection = document.getElementById('knowledge-section');
    
    if (detailSection) {
        detailSection.classList.add('hidden-section');
    }
    
    if (knowledgeSection) {
        knowledgeSection.classList.remove('hidden-section');
        
        // Scroll to top
        setTimeout(() => {
            knowledgeSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
    
    // Reset quiz answers
    resetQuizAnswers();
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