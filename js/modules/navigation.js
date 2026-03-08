// js/modules/navigation.js
import {
    renderKnowledgeContent,
    renderActivities,
    renderForumPosts,
    renderRankings
} from './ui.js';
import { fetchAndRenderQuizHistory } from './quiz.js'; // Import hàm mới

/* ==========================================
   CHUYỂN SECTION
========================================== */
export function switchSection(sectionId) {

    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.add('hidden-section');
    });

    const activeSection = document.getElementById(sectionId);
    if (!activeSection) {
        console.warn("Section không tồn tại:", sectionId);
        return;
    }

    activeSection.classList.remove('hidden-section');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const sectionName = sectionId.replace('-section', '');
    const activeNav = document.querySelector(`.nav-link[data-section="${sectionName}"]`);

    if (activeNav) {
        activeNav.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    renderSectionContent(sectionId);
}

/* ==========================================
   RENDER NỘI DUNG TỪNG SECTION
========================================== */
function renderSectionContent(sectionId) {

    switch (sectionId) {

        case 'knowledge-section':
            renderKnowledgeContent();
            break;

        case 'quiz-section':
            fetchAndRenderQuizHistory(); // Gọi API để lấy lịch sử quiz
            break;

        case 'activities-section':
            renderActivities();
            break;

        case 'community-section':
            renderForumPosts();
            break;

        case 'ranking-section':
            renderRankings('weekly');
            break;

        case 'profile-section':
            if (typeof window.updateProfileUI === 'function') {
                window.updateProfileUI();
            }
            break;

        case 'home-section':
        default:
            // Không cần render lại
            break;
    }
}

/* ==========================================
   INIT NAVIGATION
========================================== */
export function initNavigation() {

    console.log("Initializing navigation...");

    const navLinks = document.querySelectorAll('[data-section]');

    navLinks.forEach(link => {

        link.addEventListener('click', function (e) {

            e.preventDefault();

            const sectionName = this.dataset.section;
            if (!sectionName) return;

            const sectionId = sectionName + '-section';
            switchSection(sectionId);
        });

    });
}