import { getReports, getReport, approveReport, rejectReport, getPost, updatePost } from "../services/report.service.js";

let currentPage = 1;
let totalPages = 1;

export async function loadReports(page = 1) {
    const container = document.getElementById("report-section");
    if (!container) return;

    // Hiển thị loading
    container.innerHTML = `
        <div class="container">
            <h2 class="section-title">Quản lý báo cáo lỗi</h2>
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        </div>
    `;

    try {
        const data = await getReports(page, 10);
        currentPage = data.page || 1;
        totalPages = data.totalPages || 1;
        renderReportList(container, data.reports);
    } catch (error) {
        container.innerHTML = `
            <div class="container">
                <h2 class="section-title">Quản lý báo cáo lỗi</h2>
                <div class="status-card error">
                    <div class="status-icon">❌</div>
                    <p>${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderReportList(container, reports) {
    if (!reports || reports.length === 0) {
        container.innerHTML = `
            <div class="container">
                <h2 class="section-title">Quản lý báo cáo lỗi</h2>
                <div class="empty-state">
                    <i class="fas fa-flag"></i>
                    <h3>Chưa có báo cáo nào</h3>
                    <p>Hiện tại chưa có báo cáo lỗi từ người dùng.</p>
                </div>
            </div>
        `;
        return;
    }

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': return '<span class="badge badge-pending"><i class="fas fa-clock"></i> Chờ xử lý</span>';
            case 'approved': return '<span class="badge badge-success"><i class="fas fa-check"></i> Đã duyệt</span>';
            case 'rejected': return '<span class="badge badge-danger"><i class="fas fa-times"></i> Từ chối</span>';
            default: return '<span class="badge">Không xác định</span>';
        }
    };

    container.innerHTML = `
        <div class="container">
            <h2 class="section-title">Quản lý báo cáo lỗi</h2>
            <div class="admin-table-container">
                <div class="admin-table-header">
                    <h3>Danh sách báo cáo</h3>
                </div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Bài viết</th>
                            <th>Người báo cáo</th>
                            <th>Lý do</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reports.map(report => `
                            <tr data-id="${report.id}">
                                <td>#${report.id}</td>
                                <td><a href="#" class="post-link" data-post-id="${report.postId}">${report.postTitle}</a></td>
                                <td>${report.reportedBy}</td>
                                <td>${report.reason.substring(0, 50)}${report.reason.length > 50 ? '...' : ''}</td>
                                <td>${getStatusBadge(report.status)}</td>
                                <td>${new Date(report.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn view-btn" onclick="window.viewReportDetail(${report.id})">
                                            <i class="fas fa-eye"></i> Xem
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${renderPagination()}
            </div>
        </div>
    `;

    // Gắn sự kiện cho các link bài viết
    document.querySelectorAll('.post-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = link.dataset.postId;
            // Chuyển sang trang chi tiết bài viết (có thể mở modal)
            alert('Xem chi tiết bài viết - chức năng đang phát triển');
        });
    });
}

function renderPagination() {
    if (totalPages <= 1) return '';

    let paginationHtml = '<div class="pagination">';
    if (currentPage > 1) {
        paginationHtml += `<button class="btn btn-outline" onclick="loadReports(${currentPage - 1})">Trước</button>`;
    }
    paginationHtml += `<span>Trang ${currentPage} / ${totalPages}</span>`;
    if (currentPage < totalPages) {
        paginationHtml += `<button class="btn btn-outline" onclick="loadReports(${currentPage + 1})">Sau</button>`;
    }
    paginationHtml += '</div>';
    return paginationHtml;
}

// Xem chi tiết báo cáo (modal)
export async function viewReportDetail(reportId) {
    try {
        const report = await getReport(reportId);
        const post = await getPost(report.postId);
        showReportModal(report, post);
    } catch (error) {
        toastr.error(error.message);
    }
}

function showReportModal(report, post) {
    // Tạo modal nếu chưa có
    let modal = document.getElementById('report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'report-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large">
                <span class="close-modal" onclick="document.getElementById('report-modal').style.display='none'">&times;</span>
                <h2>Chi tiết báo cáo</h2>
                <div id="report-detail-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const content = document.getElementById('report-detail-content');
    content.innerHTML = `
        <div style="display: grid; gap: 20px; grid-template-columns: 1fr 1fr;">
            <div>
                <h3>Thông tin báo cáo</h3>
                <p><strong>ID:</strong> #${report.id}</p>
                <p><strong>Người báo cáo:</strong> ${report.reportedBy}</p>
                <p><strong>Lý do:</strong> ${report.reason}</p>
                <p><strong>Mô tả chi tiết:</strong> ${report.description || 'Không có'}</p>
                <p><strong>Ngày tạo:</strong> ${new Date(report.createdAt).toLocaleString('vi-VN')}</p>
                <p><strong>Trạng thái:</strong> ${report.status}</p>
            </div>
            <div>
                <h3>Bài viết bị báo cáo</h3>
                <p><strong>Tiêu đề:</strong> ${post.title}</p>
                <p><strong>Nội dung hiện tại:</strong></p>
                <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; border-radius: 8px;">
                    ${post.content}
                </div>
                <div style="margin-top: 20px;">
                    <label><strong>Chỉnh sửa nội dung (nếu cần):</strong></label>
                    <textarea id="edit-post-content" rows="6" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc;">${post.content}</textarea>
                </div>
            </div>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="admin-btn admin-btn-success" onclick="window.approveReportWithEdit(${report.id}, ${post.id})">
                <i class="fas fa-check"></i> Phê duyệt & Cập nhật
            </button>
            <button class="admin-btn admin-btn-danger" onclick="window.rejectReportWithReason(${report.id})">
                <i class="fas fa-times"></i> Từ chối
            </button>
            <button class="admin-btn admin-btn-outline" onclick="document.getElementById('report-modal').style.display='none'">
                Đóng
            </button>
        </div>
    `;

    modal.style.display = 'flex';
}

// Phê duyệt và cập nhật bài viết
window.approveReportWithEdit = async (reportId, postId) => {
    const newContent = document.getElementById('edit-post-content').value;
    if (!confirm('Bạn có chắc muốn phê duyệt báo cáo và cập nhật bài viết?')) return;

    try {
        await updatePost(postId, { content: newContent });
        await approveReport(reportId, { content: newContent });
        toastr.success('Đã phê duyệt và cập nhật bài viết thành công!');
        document.getElementById('report-modal').style.display = 'none';
        loadReports(currentPage); // reload danh sách
    } catch (error) {
        toastr.error(error.message);
    }
};

// Từ chối báo cáo (có thể nhập lý do)
window.rejectReportWithReason = async (reportId) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason === null) return;
    if (!reason.trim()) {
        alert('Vui lòng nhập lý do từ chối');
        return;
    }
    try {
        await rejectReport(reportId, reason);
        toastr.info('Đã từ chối báo cáo');
        document.getElementById('report-modal').style.display = 'none';
        loadReports(currentPage);
    } catch (error) {
        toastr.error(error.message);
    }
};

// Gán vào window để dùng từ HTML
window.viewReportDetail = viewReportDetail;
window.loadReports = loadReports;