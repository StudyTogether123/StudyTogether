// Dữ liệu mẫu cho website StudyTogether - FPT Đà Nẵng
export const sampleData = {

    // ===============================
    // FEATURED CONTENT (GIỮ NGUYÊN + BỔ SUNG)
    // ===============================
    featuredContent: [
        {
            id: 1,
            title: "5 bí quyết quản lý thời gian hiệu quả cho tân sinh viên FPT",
            description: "Khám phá những phương pháp giúp bạn cân bằng giữa học tập và cuộc sống.",
            content: `
                <h3>1. Lập kế hoạch tuần</h3>
                <p>Sử dụng Google Calendar hoặc Notion để quản lý lịch học và deadline.</p>
                <h3>2. Áp dụng Pomodoro</h3>
                <p>Học 25 phút – nghỉ 5 phút giúp duy trì sự tập trung.</p>
                <h3>3. Ưu tiên việc quan trọng</h3>
                <p>Phân loại theo mức độ khẩn cấp và quan trọng.</p>
                <h3>4. Tránh trì hoãn</h3>
                <p>Hoàn thành việc nhỏ trước để tạo động lực.</p>
                <h3>5. Cân bằng nghỉ ngơi</h3>
                <p>Ngủ đủ 7–8 tiếng để giữ hiệu suất học tập cao.</p>
            `,
            image: "https://fschool.fpt.edu.vn/wp-content/uploads/2025/10/Vi-sao-quan-ly-thoi-gian-la-ky-nang-song-con-trong-thoi-dai-ban-ron-cach-quan-ly-thoi-gian-hieu-qua.jpg",
            type: "article",
            readTime: "5 phút đọc",
            date: "15/10/2023"
        },
        {
            id: 2,
            title: "Kỹ năng làm việc nhóm hiệu quả",
            description: "Chia sẻ kinh nghiệm teamwork trong môi trường đại học.",
            content: `
                <p>Làm việc nhóm là kỹ năng quan trọng tại FPT.</p>
                <ul>
                    <li>Phân công rõ ràng</li>
                    <li>Giao tiếp thường xuyên</li>
                    <li>Tôn trọng ý kiến nhau</li>
                </ul>
            `,
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1000&q=80",
            type: "video",
            readTime: "3 phút xem",
            date: "12/10/2023"
        },
        {
            id: 3,
            title: "Quiz: Bạn đã sẵn sàng cho kỳ thi giữa kỳ?",
            description: "Kiểm tra mức độ sẵn sàng của bạn trước kỳ thi.",
            content: `<p>Hãy thử sức với quiz 8 câu hỏi để đánh giá khả năng chuẩn bị của bạn.</p>`,
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
            type: "quiz",
            readTime: "8 câu hỏi",
            date: "Hôm nay"
        },
        {
            id: 7,
            title: "Cách đạt điểm cao môn Lập trình C",
            description: "Chiến lược học và làm bài thi hiệu quả.",
            content: `
                <h3>Hiểu bản chất con trỏ</h3>
                <p>Con trỏ là phần quan trọng nhất trong C.</p>
                <h3>Luyện đề</h3>
                <p>Làm lại các đề thi cũ ít nhất 3 lần.</p>
                <h3>Debug kỹ</h3>
                <p>Sử dụng printf để kiểm tra luồng chương trình.</p>
            `,
            image: "https://200lab.io/blog/_next/image?url=https%3A%2F%2Fstatics.cdn.200lab.io%2F2024%2F04%2Flap-trinh-c.jpg&w=1920&q=75",
            type: "article",
            readTime: "7 phút đọc",
            date: "20/10/2023"
        },
        {
            id: 8,
            title: "Hướng dẫn sử dụng thư viện tại FPT",
            description: "Tận dụng tối đa tài nguyên học tập.",
            content: `
                <p>Thư viện cung cấp hàng ngàn tài liệu học tập.</p>
                <p>Sinh viên có thể mượn sách tối đa 14 ngày.</p>
                <p>Đăng nhập bằng tài khoản sinh viên để truy cập tài liệu online.</p>
            `,
            image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80",
            type: "article",
            readTime: "6 phút đọc",
            date: "18/10/2023"
        }
    ],

    // ===============================
    // KNOWLEDGE CONTENT (RẤT NHIỀU)
    // ===============================
    knowledgeContent: [
        {
            id: 4,
            title: "Cách ghi chép bài hiệu quả trong giảng đường",
            description: "Đại học yêu cầu phương pháp ghi chép khoa học hơn.",
            content: `
                <h3>Phương pháp Cornell</h3>
                <p>Chia giấy thành 3 phần: ghi chú, từ khóa, tóm tắt.</p>
                <h3>Mindmap</h3>
                <p>Phù hợp với môn có nhiều khái niệm liên kết.</p>
                <h3>Ghi chép điện tử</h3>
                <p>Sử dụng Notion hoặc OneNote để lưu trữ lâu dài.</p>
            `,
            image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1000&q=80",
            type: "article",
            readTime: "6 phút đọc",
            date: "10/10/2023",
            category: "Học tập"
        },
        {
            id: 5,
            title: "Vượt qua sốc văn hóa khi học xa nhà",
            description: "Chia sẻ cách thích nghi môi trường mới.",
            content: `
                <p>Rời quê lên Đà Nẵng học tập là thử thách lớn.</p>
                <ul>
                    <li>Kết bạn mới</li>
                    <li>Tham gia CLB</li>
                    <li>Giữ liên lạc gia đình</li>
                </ul>
            `,
            image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=1000&q=80",
            type: "article",
            readTime: "7 phút đọc",
            date: "08/10/2023",
            category: "Đời sống"
        },
        {
            id: 6,
            title: "Kỹ năng thuyết trình cho người mới bắt đầu",
            description: "Tự tin hơn khi nói trước đám đông.",
            content: `
                <h3>Chuẩn bị nội dung</h3>
                <p>Hiểu rõ chủ đề trước khi trình bày.</p>
                <h3>Luyện tập</h3>
                <p>Tập trước gương hoặc quay video để cải thiện.</p>
                <h3>Kiểm soát ngôn ngữ cơ thể</h3>
                <p>Giữ ánh mắt và tư thế tự tin.</p>
            `,
            image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80",
            type: "video",
            readTime: "4 phút xem",
            date: "05/10/2023",
            category: "Kỹ năng mềm"
        },

        {
            id: 9,
            title: "Bí quyết học online hiệu quả",
            description: "Tối ưu việc học từ xa.",
            content: `
                <p>Chuẩn bị không gian học yên tĩnh.</p>
                <p>Tắt thông báo mạng xã hội.</p>
                <p>Chủ động đặt câu hỏi với giảng viên.</p>
            `,
            image: "https://cdn.tgdd.vn/Files/2021/09/16/1383275/hoc-online-thi-can-chuan-bi-nhung-gi-cac-meo-hay-giup-ban-hoc-online-hieu-qua-202109162058271611.jpg",
            type: "article",
            readTime: "5 phút đọc",
            date: "03/10/2023",
            category: "Học tập"
        },

        {
            id: 10,
            title: "Cách xin thực tập năm 3 thành công",
            description: "Chuẩn bị CV và phỏng vấn.",
            content: `
                <h3>Viết CV nổi bật</h3>
                <p>Nhấn mạnh dự án đã làm.</p>
                <h3>Luyện phỏng vấn</h3>
                <p>Chuẩn bị câu hỏi thường gặp.</p>
                <h3>Xây dựng LinkedIn</h3>
                <p>Profile chuyên nghiệp giúp tăng cơ hội.</p>
            `,
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
            type: "article",
            readTime: "8 phút đọc",
            date: "01/10/2023",
            category: "Hướng nghiệp"
        },

        {
            id: 11,
            title: "Cách đạt IELTS 6.5 trong 1 năm",
            description: "Lộ trình học tiếng Anh hiệu quả.",
            content: `
                <p>Học từ vựng theo chủ đề.</p>
                <p>Luyện nghe mỗi ngày 30 phút.</p>
                <p>Viết essay mỗi tuần.</p>
            `,
            image: "https://res.edu.vn/wp-content/uploads/2021/02/ielts-la-gi.jpg",
            type: "article",
            readTime: "9 phút đọc",
            date: "28/09/2023",
            category: "Ngoại ngữ"
        }
    ],

    // ===============================
    // ACTIVITIES (BỔ SUNG NHIỀU)
    // ===============================
    activitiesContent: [
        {
            id: 1,
            title: "Ngày hội tuyển sinh FPT Open Day 2025",
            date: "28/10/2023",
            time: "8:00 - 17:00",
            location: "Sân trường FPT University, Đà Nẵng",
            description: "Tham gia ngày hội tuyển sinh để trải nghiệm môi trường học tập tại FPT.",
            participants: 150,
            status: "sắp diễn ra"
        },
        {
            id: 2,
            title: "Workshop: Kỹ năng lập trình cho người mới bắt đầu",
            date: "25/10/2023",
            time: "14:00 - 16:30",
            location: "Phòng lab 301",
            description: "Workshop dành cho tân sinh viên ngành CNTT.",
            participants: 80,
            status: "sắp diễn ra"
        },
        {
            id: 3,
            title: "Talkshow: Hành trình khởi nghiệp",
            date: "20/10/2023",
            time: "18:30 - 20:30",
            location: "Hội trường lớn",
            description: "Giao lưu với cựu sinh viên thành đạt.",
            participants: 200,
            status: "đã diễn ra"
        },
        {
            id: 4,
            title: "Cuộc thi FPT Hackathon 2025",
            date: "15-17/11/2023",
            time: "Toàn ngày",
            location: "FPT City",
            description: "Thử thách lập trình 48 giờ.",
            participants: 300,
            status: "sắp diễn ra"
        },
        {
            id: 5,
            title: "Giải bóng đá sinh viên FPT",
            date: "05/11/2023",
            time: "16:00",
            location: "Sân bóng FPT",
            description: "Giải đấu giao lưu giữa các khoa.",
            participants: 120,
            status: "sắp diễn ra"
        },
        {
            id: 6,
            title: "Workshop: UI/UX Design cơ bản",
            date: "12/11/2023",
            time: "14:00",
            location: "Innovation Space",
            description: "Học thiết kế trải nghiệm người dùng.",
            participants: 95,
            status: "sắp diễn ra"
        }
    ],

    // ===============================
    // FORUM POSTS (BỔ SUNG NHIỀU)
    // ===============================
    forumPosts: [
        {
            id: 1,
            author: "Nguyễn Văn A",
            time: "2 giờ trước",
            title: "Cần tìm nhóm học môn Lập trình hướng đối tượng",
            content: "Mình là sinh viên K17 ngành CNTT...",
            likes: 15,
            comments: 8,
            category: "study"
        },
        {
            id: 2,
            author: "Trần Thị B",
            time: "5 giờ trước",
            title: "Kinh nghiệm học Tiếng Anh tại FPT",
            content: "Chia sẻ với các tân sinh viên...",
            likes: 42,
            comments: 23,
            category: "share"
        },
        {
            id: 3,
            author: "Lê Văn C",
            time: "1 ngày trước",
            title: "Câu hỏi về môn Cấu trúc dữ liệu",
            content: "Mình đang gặp khó khăn...",
            likes: 8,
            comments: 12,
            category: "question"
        },
        {
            id: 4,
            author: "Phạm Thị D",
            time: "2 ngày trước",
            title: "Review trải nghiệm học online",
            content: "Sau một học kỳ học online...",
            likes: 31,
            comments: 17,
            category: "share"
        },
        {
            id: 5,
            author: "Hoàng Văn E",
            time: "3 ngày trước",
            title: "Có nên tham gia CLB không?",
            content: "Mình phân vân giữa việc đi làm thêm và tham gia CLB.",
            likes: 19,
            comments: 11,
            category: "question"
        },
        {
            id: 6,
            author: "Đỗ Thị F",
            time: "4 ngày trước",
            title: "Tìm bạn cùng phòng ký túc xá",
            content: "Mình cần tìm bạn ở ghép học kỳ tới.",
            likes: 22,
            comments: 6,
            category: "study"
        }
    ],

    // ===============================
    // DAILY QUIZ (GIỮ NGUYÊN)
    // ===============================
    dailyQuiz: {
        title: "Quiz hôm nay: Kiến thức về FPT University",
        questions: [
            {
                id: 1,
                question: "Đại học FPT Đà Nẵng được thành lập vào năm nào?",
                options: ["2006", "2008", "2010", "2012"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "Màu sắc chính thức của Đại học FPT là gì?",
                options: ["Xanh lá và Cam", "Xanh dương và Trắng", "Đỏ và Vàng", "Tím và Xanh"],
                correctAnswer: 0
            },
            {
                id: 3,
                question: "Chuẩn đầu ra tiếng Anh bắt buộc là gì?",
                options: ["TOEIC 600", "IELTS 6.0", "TOEFL 500", "Không có chuẩn"],
                correctAnswer: 1
            }
        ]
    },

    // ===============================
    // RANKINGS (GIỮ NGUYÊN)
    // ===============================
    rankings: {
        weekly: [
            { rank: 1, name: "Nguyễn Văn A", points: 1250, faculty: "Công nghệ thông tin" },
            { rank: 2, name: "Trần Thị B", points: 1180, faculty: "Kinh tế" }
        ],
        monthly: [
            { rank: 1, name: "Trần Thị B", points: 4850, faculty: "Kinh tế" },
            { rank: 2, name: "Nguyễn Văn A", points: 4720, faculty: "Công nghệ thông tin" }
        ]
    },

    quizHistory: [
        { date: "25/10/2023", topic: "Kỹ năng học tập", score: "8/10", points: 80 },
        { date: "24/10/2023", topic: "Quản lý thời gian", score: "7/10", points: 70 }
    ]
};

export const appState = {
    currentUser: null,
    currentQuizAnswers: {},
    isLoginMode: false
};