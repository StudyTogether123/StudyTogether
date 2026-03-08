// js/modules/ui.js
import { sampleData } from './data.js';
import { loadPostDetail } from './postDetail.js';
import { quizService } from '../services/quiz.service.js'; // Import quizService

/* =====================================================
   UTIL RENDER
=====================================================*/
function renderList(containerId, data, templateFn, afterRender) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(templateFn).join('');

    if (afterRender) afterRender(container);
}

/* =====================================================
   CONTENT CARD (FEATURE + KNOWLEDGE)
=====================================================*/
export function createContentCard(content, isKnowledge = false) {

    const iconMap = {
        video: 'fa-play-circle',
        quiz: 'fa-question-circle',
        article: 'fa-file-alt'
    };

    const icon = iconMap[content.type] || 'fa-file-alt';

    const shortDesc =
        isKnowledge && content.description?.length > 120
            ? content.description.substring(0, 120) + '...'
            : content.description;

    const cardId = content.id;
    console.log(`Creating card with ID: ${cardId} (${typeof cardId})`);

    return `
        <div class="feature-card" data-id="${cardId}">
            <div class="feature-image">
                <img src="${content.image}" alt="${content.title}" loading="lazy">
            </div>

            <div class="feature-content">
                <h3 class="card-title">${content.title}</h3>
                <p class="card-desc">${shortDesc || ''}</p>

                <div class="meta">
                    <span><i class="far ${icon}"></i> ${content.readTime}</span>
                    <span><i class="far fa-calendar"></i> ${content.date}</span>
                    ${
                        content.category
                            ? `<span><i class="fas fa-tag"></i> ${content.category}</span>`
                            : ''
                    }
                </div>
                
                <button class="btn-read-more" onclick="window.viewPostDetail(${cardId})">
                    Đọc thêm <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
}

/* =====================================================
   CLICK EVENT
=====================================================*/
function enableContentCardClick(container) {
    if (!container) return;

    container.addEventListener('click', e => {
        if (e.target.closest('.btn-read-more')) return;

        const card = e.target.closest('.feature-card');
        if (!card) return;

        const id = card.dataset.id;
        if (!id) return;

        console.log('Card clicked, ID from dataset:', id, typeof id);
        
        card.classList.add('card-clicked');
        setTimeout(() => card.classList.remove('card-clicked'), 150);

        loadPostDetail(id);
    });
}

/* =====================================================
   ACTIVITY CARD
=====================================================*/
export function createActivityCard(activity) {

    const isUpcoming = activity.status === 'Đã diễn ra';

    return `
        <div class="activity-card">
            <div class="activity-header">
                <h3>${activity.title}</h3>
                <div class="activity-date">
                    ${activity.date} | ${activity.time}
                </div>
            </div>

            <div class="activity-body">
                <p>${activity.description}</p>

                <div class="activity-details">
                    <div class="activity-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${activity.location}</span>
                    </div>
                    <div class="activity-detail">
                        <i class="fas fa-users"></i>
                        <span>${activity.participants} người tham gia</span>
                    </div>
                </div>
            </div>

            <div class="activity-actions">
                <button 
                    class="btn ${isUpcoming ? 'btn-primary' : 'btn-outline'}"
                    data-id="${activity.id}"
                >
                    ${isUpcoming ? 'Đã diễn ra' : 'Đã diễn ra'}
                </button>
            </div>
        </div>
    `;
}

/* =====================================================
   FORUM POST
=====================================================*/
export function createForumPost(post) {

    const categoryIcons = {
        study: 'fa-book',
        activity: 'fa-calendar-alt',
        question: 'fa-question-circle',
        share: 'fa-share-alt',
        other: 'fa-comment'
    };

    const categoryLabels = {
        study: 'Học tập',
        activity: 'Hoạt động',
        question: 'Hỏi đáp',
        share: 'Chia sẻ',
        other: 'Khác'
    };

    return `
        <div class="forum-post">
            <div class="post-header">
                <div>
                    <span class="post-author">${post.author}</span>
                    <span class="dot">•</span>
                    <span>
                        <i class="fas ${categoryIcons[post.category]}"></i>
                        ${categoryLabels[post.category]}
                    </span>
                </div>
                <span class="post-time">${post.time}</span>
            </div>

            <div class="post-content">
                <h4>${post.title}</h4>
                <p>${post.content}</p>
            </div>

            <div class="post-actions">
                <div class="post-action like-post" data-id="${post.id}">
                    <i class="far fa-thumbs-up"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="post-action">
                    <i class="far fa-comment"></i>
                    <span>${post.comments}</span>
                </div>
                <div class="post-action">
                    <i class="far fa-share-square"></i>
                    <span>Chia sẻ</span>
                </div>
            </div>
        </div>
    `;
}

/* =====================================================
   RENDER FUNCTIONS
=====================================================*/
export function renderFeaturedContent() {
    const featuredData = sampleData.featuredContent?.length 
        ? sampleData.featuredContent 
        : sampleData.knowledgeContent.slice(0, 3);
    
    renderList(
        'featured-content',
        featuredData,
        item => createContentCard(item),
        enableContentCardClick
    );
}

export function renderKnowledgeContent() {
    renderList(
        'knowledge-content',
        sampleData.knowledgeContent,
        item => createContentCard(item, true),
        enableContentCardClick
    );
}

export function renderActivities() {
    renderList(
        'activities-content',
        sampleData.activitiesContent,
        createActivityCard
    );
}

export function renderForumPosts() {
    renderList(
        'forum-posts-content',
        sampleData.forumPosts,
        createForumPost
    );
}

/* =====================================================
   RANKING - Gọi API từ backend
=====================================================*/
export async function renderRankings(type = 'weekly') {
    const container = document.getElementById('ranking-content');
    if (!container) return;

    // Hiển thị loading
    container.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Đang tải...</div>';

    try {
        // Gọi API lấy leaderboard (mặc định là tổng điểm, có thể phân loại sau)
        const leaderboard = await quizService.getLeaderboard();
        
        if (!leaderboard || leaderboard.length === 0) {
            container.innerHTML = '<p class="empty-state">Chưa có dữ liệu xếp hạng.</p>';
            return;
        }

        // Tạo HTML cho bảng xếp hạng
        const tableHtml = `
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th>Hạng</th>
                        <th>Tên sinh viên</th>
                        <th>Điểm</th>
                        <th>Số quiz đã làm</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaderboard.map((item, index) => {
                        const rank = index + 1;
                        return `
                            <tr>
                                <td class="rank ${rank <= 3 ? `rank-${rank}` : ''}">${rank}</td>
                                <td>${item.fullName || item.username}</td>
                                <td>${item.totalPoints.toLocaleString()}</td>
                                <td>${item.quizCount}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHtml;
    } catch (error) {
        console.error('❌ Error loading leaderboard:', error);
        container.innerHTML = '<p class="empty-state">Không thể tải bảng xếp hạng. Vui lòng thử lại sau.</p>';
    }
}

/* =====================================================
   QUIZ HISTORY (có thể sau này cũng gọi API)
=====================================================*/
export function renderQuizHistory() {
    const container = document.getElementById('quiz-history');
    if (!container) return;

    if (!sampleData.quizHistory.length) {
        container.innerHTML =
            `<p class="empty-state">
                Bạn chưa tham gia quiz nào. Hãy bắt đầu ngay!
            </p>`;
        return;
    }

    container.innerHTML = `
        <table class="ranking-table">
            <thead>
                <tr>
                    <th>Ngày</th>
                    <th>Chủ đề</th>
                    <th>Điểm</th>
                    <th>Điểm hoạt động</th>
                </tr>
            </thead>
            <tbody>
                ${sampleData.quizHistory.map(item => `
                    <tr>
                        <td>${item.date}</td>
                        <td>${item.topic}</td>
                        <td>${item.score}</td>
                        <td>${item.points}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/* =====================================================
   COUNTER ANIMATION
=====================================================*/
export function animateCounter(elementId, targetValue, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * targetValue);
        element.textContent = value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}