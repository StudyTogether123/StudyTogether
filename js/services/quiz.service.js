// js/services/quiz.service.js
import { authService } from './auth.service.js';

const API_BASE = "https://studytogether-backend.onrender.com/api";

class QuizService {
    /**
     * Lấy header chứa token xác thực nếu người dùng đã đăng nhập
     * @returns {Object} Header object với Authorization hoặc rỗng
     */
    _getAuthHeader() {
        const user = authService.getCurrentUser();
        return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
    }

    /**
     * Gửi kết quả quiz lên server
     * @param {number} quizId - ID của quiz
     * @param {Object} answers - Map { questionId: answer }
     * @param {number} timeSpent - Thời gian làm bài (giây)
     * @returns {Promise<Object>} - Kết quả chi tiết từ server
     */
    async submitQuiz(quizId, answers, timeSpent) {
        console.log('📝 QuizService.submitQuiz called with quizId:', quizId);
        const response = await fetch(`${API_BASE}/quizzes/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this._getAuthHeader()
            },
            body: JSON.stringify({ quizId, answers, timeSpent })
        });

        // Kiểm tra response trước khi parse JSON
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Lỗi ${response.status}: Gửi quiz thất bại`);
        }

        const data = await response.json();
        return data;
    }

    /**
     * Lấy lịch sử quiz của người dùng hiện tại
     * @returns {Promise<Array>} - Danh sách lịch sử quiz
     */
    async getQuizHistory() {
        console.log('📜 QuizService.getQuizHistory called');
        const response = await fetch(`${API_BASE}/quizzes/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...this._getAuthHeader()
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Lỗi ${response.status}: Không thể lấy lịch sử`);
        }

        const data = await response.json();
        return data;
    }

    /**
     * Lấy bảng xếp hạng (công khai)
     * @returns {Promise<Array>} - Danh sách người dùng theo điểm
     */
    async getLeaderboard() {
        console.log('🏆 QuizService.getLeaderboard called');
        const response = await fetch(`${API_BASE}/quizzes/leaderboard`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Lỗi ${response.status}: Không thể lấy bảng xếp hạng`);
        }

        const data = await response.json();
        return data;
    }

    /**
     * Lấy quiz hàng ngày (công khai, không kèm đáp án)
     * @returns {Promise<Object|null>} - Quiz daily hoặc null nếu không có
     */
    async getDailyQuiz() {
        console.log('📅 QuizService.getDailyQuiz called');
        const response = await fetch(`${API_BASE}/quizzes/daily`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        // Nếu response không thành công
        if (!response.ok) {
            // Trường hợp đặc biệt: 404 (không có quiz) -> trả về null
            if (response.status === 404) {
                console.log('⚠️ No daily quiz found (404)');
                return null;
            }
            // Các lỗi khác: đọc body lỗi (nếu có) và ném exception
            const errorText = await response.text();
            throw new Error(errorText || `Lỗi ${response.status}: Không thể lấy quiz daily`);
        }

        const data = await response.json();
        return data;
    }

    /**
     * Lấy quiz theo ID (công khai, không kèm đáp án)
     * @param {number} quizId - ID của quiz
     * @returns {Promise<Object>} - Quiz
     */
    async getQuizById(quizId) {
        console.log('🔍 QuizService.getQuizById called with id:', quizId);
        const response = await fetch(`${API_BASE}/quizzes/${quizId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Lỗi ${response.status}: Không thể lấy quiz`);
        }

        const data = await response.json();
        return data;
    }

    /**
     * Kiểm tra người dùng đã hoàn thành quiz nào đó chưa
     * @param {number} quizId - ID của quiz
     * @returns {Promise<boolean>} - true nếu đã hoàn thành
     */
    async hasCompletedQuiz(quizId) {
        console.log('✅ QuizService.hasCompletedQuiz called for quizId:', quizId);
        const response = await fetch(`${API_BASE}/quizzes/check/${quizId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...this._getAuthHeader()
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Lỗi ${response.status}: Không thể kiểm tra quiz`);
        }

        const data = await response.json();
        return data.completed; // backend trả về { completed: true/false }
    }

    /**
     * Lấy thống kê quiz của người dùng hiện tại
     * @returns {Promise<Object>} - Thống kê (tổng số quiz, điểm trung bình, điểm cao nhất, tổng điểm)
     */
    async getUserStats() {
        console.log('📊 QuizService.getUserStats called');
        const response = await fetch(`${API_BASE}/quizzes/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...this._getAuthHeader()
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Lỗi ${response.status}: Không thể lấy thống kê`);
        }

        const data = await response.json();
        return data;
    }
}

export const quizService = new QuizService();