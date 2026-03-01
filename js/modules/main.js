// main.js
import { 
    renderFeaturedContent, 
    renderActivities, 
    renderForumPosts, 
    renderRankings,
    renderKnowledgeContent,
    renderQuizHistory 
} from './ui.js';

import { 
    renderQuizQuestions, 
    showQuizResult, 
    updateStatsAfterQuiz,
    resetQuizAnswers 
} from './quiz.js';

import { 
    openAuthModal, 
    handleAuth,
    closeAuthModal,
    logout 
} from './auth.js';

import { switchSection, initNavigation } from './navigation.js';
import { appState, sampleData } from './data.js';
import { loadPostDetail } from './postDetail.js';

// =============================
// KIỂM TRA VÀ XỬ LÝ LOCALSTORAGE
// =============================
(function() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('✅ localStorage hoạt động bình thường');
    } catch (e) {
        console.warn('⚠️ localStorage bị chặn, tạo fallback storage');
        
        const fallbackStorage = {
            _data: {},
            setItem: function(key, value) {
                this._data[key] = String(value);
            },
            getItem: function(key) {
                return this._data[key] || null;
            },
            removeItem: function(key) {
                delete this._data[key];
            },
            clear: function() {
                this._data = {};
            }
        };
        
        Object.defineProperty(window, 'localStorage', {
            value: fallbackStorage,
            writable: false,
            configurable: false
        });
    }
})();

// =============================
// CẤU HÌNH TOASTR
// =============================
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: "4000",
    extendedTimeOut: "1000",
    showDuration: "300",
    hideDuration: "1000",
    preventDuplicates: true
};

// =============================
// ĐỒNG BỘ TRẠNG THÁI USER
// =============================
function syncUserFromStorage() {
    let username = null;
    let token = null;
    let email = null;
    let points = null;
    
    try {
        username = localStorage.getItem("username");
        token = localStorage.getItem("token");
        email = localStorage.getItem("email");
        points = localStorage.getItem("points");
    } catch (e) {
        console.warn("Lỗi đọc localStorage:", e);
    }
    
    if (!username || !token) {
        try {
            username = username || sessionStorage.getItem("username");
            token = token || sessionStorage.getItem("token");
            email = email || sessionStorage.getItem("email");
            points = points || sessionStorage.getItem("points");
        } catch (e) {
            console.warn("Lỗi đọc sessionStorage:", e);
        }
    }

    console.log("🔄 Syncing user:", { username, token });

    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const displayUsername = document.getElementById("displayUsername");

    if (username && token) {
        appState.currentUser = { 
            name: username,
            email: email || 'Chưa cập nhật',
            points: points || '0'
        };

        if (authButtons) authButtons.style.display = "none";
        if (userMenu) {
            userMenu.style.display = "flex";
        }
        if (displayUsername) displayUsername.textContent = username;

        updateProfileUI(username, email, points);
    } else {
        appState.currentUser = null;
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
    }
}

// =============================
// CẬP NHẬT PROFILE UI
// =============================
function updateProfileUI(username, email, points) {
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const profilePoints = document.getElementById("profilePoints");
    
    if (profileUsername) profileUsername.textContent = username || "---";
    if (profileEmail) profileEmail.textContent = email || "Chưa cập nhật";
    if (profilePoints) profilePoints.textContent = points || "0";
}

// =============================
// XỬ LÝ ĐĂNG XUẤT
// =============================
function handleLogout(e) {
    e?.preventDefault();

    try {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("points");
        
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("points");
    } catch (e) {
        console.warn("Lỗi xóa storage:", e);
    }

    appState.currentUser = null;

    toastr.success("👋 Đăng xuất thành công!");
    syncUserFromStorage();
    switchSection("home-section");
    
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu) dropdownMenu.classList.remove("show-dropdown");
}

// =============================
// MỞ QUIZ TRONG POST DETAIL
// =============================
function openQuizInPostDetail() {
    if (!appState.currentUser) {
        toastr.warning("Vui lòng đăng nhập để làm quiz!");
        openAuthModal(true);
        return;
    }
    
    // Tìm quiz trong knowledgeContent
    const quizPost = sampleData.knowledgeContent.find(item => 
        item.type === 'quiz' || item.title?.toLowerCase().includes('quiz')
    );
    
    if (quizPost) {
        loadPostDetail(quizPost.id);
    } else {
        toastr.error("Không tìm thấy quiz!");
    }
}

// =============================
// XỬ LÝ TẠO BÀI VIẾT
// =============================
function handleCreatePost(event) {
    event.preventDefault();

    if (!appState.currentUser) {
        toastr.warning("Bạn cần đăng nhập để tạo bài viết!");
        openAuthModal(true);
        return;
    }

    const title = document.getElementById('postTitle')?.value.trim();
    const category = document.getElementById('postCategory')?.value;
    const content = document.getElementById('postContent')?.value.trim();

    if (!title || !content) {
        toastr.error("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (title.length < 5) {
        toastr.error("Tiêu đề phải có ít nhất 5 ký tự!");
        return;
    }

    if (content.length < 10) {
        toastr.error("Nội dung phải có ít nhất 10 ký tự!");
        return;
    }

    const newPost = {
        id: Date.now(),
        author: appState.currentUser.name,
        time: "Vừa xong",
        title: title,
        content: content,
        likes: 0,
        comments: 0,
        category: category
    };

    sampleData.forumPosts.unshift(newPost);
    renderForumPosts();

    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.style.display = "none";
        modal.classList.remove('show');
    }
    
    document.getElementById('postForm').reset();
    toastr.success("✅ Đăng bài thành công!");
    switchSection("community-section");
}

// =============================
// KHỞI TẠO USER DROPDOWN
// =============================
function initUserDropdown() {
    const userInfo = document.getElementById("userInfo");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (!userInfo || !dropdownMenu) return;

    userInfo.addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        dropdownMenu.classList.toggle("show-dropdown");
    });

    document.addEventListener("click", function(e) {
        if (!userInfo.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show-dropdown");
        }
    });

    const profileBtn = document.getElementById("profileBtn");
    const quizHistoryBtn = document.getElementById("quizHistoryBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (profileBtn) {
        profileBtn.addEventListener("click", function(e) {
            e.preventDefault();
            switchSection("profile-section");
            dropdownMenu.classList.remove("show-dropdown");
        });
    }

    if (quizHistoryBtn) {
        quizHistoryBtn.addEventListener("click", function(e) {
            e.preventDefault();
            switchSection("quiz-section");
            dropdownMenu.classList.remove("show-dropdown");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }
}

// =============================
// XỬ LÝ CLICK CARD
// =============================
document.addEventListener('click', function (e) {
    const card = e.target.closest('.feature-card');
    if (!card) return;

    const inKnowledge = card.closest('#knowledge-content');
    if (!inKnowledge) return;

    const id = card.dataset.id;
    if (id) {
        loadPostDetail(id);
    }
});

// =============================
// KHỞI TẠO EVENT LISTENERS
// =============================
function initEventListeners() {
    console.log("Initializing event listeners...");

    // Login/Register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal(true);
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal(false);
        });
    }

    // Switch auth mode
    const switchAuthMode = document.getElementById('switchAuthMode');
    if (switchAuthMode) {
        switchAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            appState.isLoginMode = !appState.isLoginMode;
            openAuthModal(appState.isLoginMode);
        });
    }

    // Close auth modal
    const closeAuthModal = document.getElementById('closeAuthModal');
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            const modal = document.getElementById('authModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        });
    }

    // Click outside to close modal
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('authModal');
        if (e.target === modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    });

    // Auth form
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }

    // Quiz buttons - sử dụng post detail thay vì modal
    const takeQuizBtn = document.getElementById('takeQuizBtn');
    const takeQuizBtn2 = document.getElementById('takeQuizBtn2');
    const dailyQuizBtn = document.getElementById('dailyQuizBtn');
    
    if (takeQuizBtn) {
        takeQuizBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuizInPostDetail();
        });
    }
    
    if (takeQuizBtn2) {
        takeQuizBtn2.addEventListener('click', (e) => {
            e.preventDefault();
            openQuizInPostDetail();
        });
    }

    if (dailyQuizBtn) {
        dailyQuizBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuizInPostDetail();
        });
    }

    // Create post button
    const createPostBtn = document.getElementById('createPostBtn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', () => {
            if (!appState.currentUser) {
                toastr.warning("Vui lòng đăng nhập!");
                openAuthModal(true);
                return;
            }
            const modal = document.getElementById('createPostModal');
            if (modal) {
                modal.style.display = "flex";
                modal.classList.add('show');
            }
        });
    }

    // Post form
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handleCreatePost);
    }

    // Close post modal
    const closePostModal = document.getElementById('closePostModal');
    if (closePostModal) {
        closePostModal.addEventListener('click', () => {
            const modal = document.getElementById('createPostModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
            document.getElementById('postForm').reset();
        });
    }

    // Load more activities
    const loadMoreActivities = document.getElementById('loadMoreActivities');
    if (loadMoreActivities) {
        loadMoreActivities.addEventListener('click', () => {
            toastr.info("Tính năng đang phát triển!");
        });
    }

    // Ranking buttons
    const weeklyRankingBtn = document.getElementById('weeklyRankingBtn');
    const monthlyRankingBtn = document.getElementById('monthlyRankingBtn');
    
    if (weeklyRankingBtn) {
        weeklyRankingBtn.addEventListener('click', () => {
            renderRankings('weekly');
            weeklyRankingBtn.classList.add('btn-primary');
            weeklyRankingBtn.classList.remove('btn-outline');
            if (monthlyRankingBtn) {
                monthlyRankingBtn.classList.add('btn-outline');
                monthlyRankingBtn.classList.remove('btn-primary');
            }
        });
    }
    
    if (monthlyRankingBtn) {
        monthlyRankingBtn.addEventListener('click', () => {
            renderRankings('monthly');
            monthlyRankingBtn.classList.add('btn-primary');
            monthlyRankingBtn.classList.remove('btn-outline');
            if (weeklyRankingBtn) {
                weeklyRankingBtn.classList.add('btn-outline');
                weeklyRankingBtn.classList.remove('btn-primary');
            }
        });
    }

    // Community buttons
    const joinForumBtn = document.getElementById('joinForumBtn');
    const findGroupBtn = document.getElementById('findGroupBtn');
    const askQuestionBtn = document.getElementById('askQuestionBtn');

    if (joinForumBtn) {
        joinForumBtn.addEventListener('click', () => {
            if (!appState.currentUser) {
                toastr.warning("Vui lòng đăng nhập!");
                openAuthModal(true);
                return;
            }
            switchSection("community-section");
        });
    }

    if (findGroupBtn) {
        findGroupBtn.addEventListener('click', () => {
            toastr.info("Tính năng đang phát triển!");
        });
    }

    if (askQuestionBtn) {
        askQuestionBtn.addEventListener('click', () => {
            if (!appState.currentUser) {
                toastr.warning("Vui lòng đăng nhập!");
                openAuthModal(true);
                return;
            }
            document.getElementById('createPostModal').style.display = "flex";
        });
    }
}

// =============================
// KHỞI TẠO ỨNG DỤNG
// =============================
function initApp() {
    console.log("🚀 Initializing StudyTogether app...");

    try {
        renderFeaturedContent();
        renderRankings('weekly');
        renderActivities();
        renderForumPosts();
        renderKnowledgeContent();
        renderQuizHistory();
        console.log("✅ Content rendered successfully");
    } catch (error) {
        console.error("❌ Error rendering content:", error);
    }

    syncUserFromStorage();
    initEventListeners();
    initUserDropdown();
    initNavigation();

    setTimeout(() => {
        if (!appState.currentUser) {
            toastr.info("👋 Chào mừng bạn đến với StudyTogether! Hãy đăng nhập để trải nghiệm đầy đủ tính năng.");
        } else {
            toastr.success(`🎉 Chào mừng ${appState.currentUser.name} quay trở lại!`);
        }
    }, 1500);
}

// =============================
// KHỞI ĐỘNG ỨNG DỤNG
// =============================
document.addEventListener('DOMContentLoaded', initApp);

// Export functions ra window để debug
window.syncUserFromStorage = syncUserFromStorage;
window.appState = appState;
window.viewPostDetail = loadPostDetail;