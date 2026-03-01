import { sampleData } from '../data.js';

export function loadPostDetail(id) {

    const post = sampleData.knowledgeContent.find(
        item => String(item.id) === String(id)
    );

    if (!post) return;

    // Ẩn tất cả section
    document.querySelectorAll('.content-section')
        .forEach(sec => sec.style.display = 'none');

    const section = document.getElementById('post-detail-section');
    section.style.display = 'block';

    section.innerHTML = `
        <div class="post-detail-container">
            <h1>${post.title}</h1>

            <div class="post-meta">
                <span>${post.date}</span>
                ${post.category ? `<span>${post.category}</span>` : ''}
            </div>

            <img src="${post.image}" class="post-detail-image">

            <div class="post-content">
                ${post.description}
            </div>

            <button class="btn btn-outline back-btn">
                ← Quay lại
            </button>
        </div>
    `;

    section.querySelector('.back-btn')
        .addEventListener('click', () => {
            section.style.display = 'none';
            document.getElementById('knowledge-section').style.display = 'block';
        });
}