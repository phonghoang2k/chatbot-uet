module.exports = {
    FIRST_COME:
        "[BOT] Chào mừng bạn đến với Chatbot. Trước khi bắt đầu, hãy chắc rằng bạn đã chọn đúng giới tính người muốn match.\n\nẤn trợ giúp (hoặc gửi trogiup) để xem thêm.",
    INSTRUCTION: "[BOT] Gửi batdau hoặc bấm vào nút để tìm bạn chat.",

    START_WARN_GENDER:
        "[BOT] Lưu ý: Bạn không chọn giới tính. Có thể bạn sẽ phải đợi lâu hơn.",
    START_ERR_ALREADY: "[BOT] Bạn không thể batdau khi chưa ketthuc...",
    WAITING:
        "[BOT] Đang tìm partner... Nếu bạn muốn đổi giới tính, gửi ketthuc sau đó chọn giới tính mới.",

    START_OKAY: "[BOT] OK! Chúng mình sẽ thông báo khi match nhé.",
    START_CHAT:
        "[BOT] Connected! Nếu muốn kết thúc, hãy gửi ketthuc\nChúc 2 bạn nói chuyện vui vẻ, cẩn thận bị lừa :)",

    END_CHAT: "[BOT] End chat!\nGửi batdau hoặc bấm vào nút để tìm bạn chat.",
    END_CHAT_PARTNER:
        "[BOT] Partner đã ngắt kết nối :D \nGửi batdau hoặc bấm vào nút để tìm bạn chat.",

    ERR_UNKNOWN:
        "[BOT] Server xảy ra lỗi nhưng không nghiêm trọng lắm\nHãy gửi ketthuc để thoát ra và thử lại",
    ERR_ATTACHMENT: "[BOT] Lỗi: Chúng mình chưa hỗ trợ gửi dạng dữ liệu này",
    ATTACHMENT_FILE: "[BOT] Partner đã gửi 1 tệp tin: ",
    ATTACHMENT_LINK: "[BOT] Partner đã gửi 1 đường link: ",
    ERR_FAKE_MSG: "[BOT] Lỗi: Bạn không được giả mạo tin nhắn của bot!",
    DATABASE_ERR:
        "[BOT] Lỗi: Không thể kết nối với database. Hãy báo cho admin!",
    GENDER_ERR:
        "[BOT] Lỗi: Giới tính nhập vào không hợp lệ!\n\nẤn trợ giúp (hoặc gửi trogiup) để xem thêm.",
    GENDER_WRITE_OK: "[BOT] Bạn đã chọn giới tính mong muốn tìm được là:",
    GENDER_MAP: {
        None: "hong",
        Male: "nam",
        Female: "nữ",
    },
    GENDER_WRITE_WARN:
        "\n\nLưu ý: Tùy chọn này chỉ có tác dụng với PHẦN LỚN các cuộc nói chuyện.",

    HELP_TXT: `[BOT] Danh sách các lệnh:
        - batdau: Bắt đầu tìm bạn chat
        - ketthuc: Kết thúc chat
        - trogiup: Xem trợ giúp
         
        Các lệnh có thể dùng khi đang không chat:
        - timnu: Tìm nữ chat cùng
        - timnam: Tìm nam chat cùng`,

    KEYWORD_START: "batdau",
    KEYWORD_END: "ketthuc",
    KEYWORD_GENDERPREFER: "tim",
    KEYWORD_HELP: "trogiup",

    ERR_TOO_LONG:
        "[Chatbot] Oops: tin nhắn bạn gửi quá dài (nhiều hơn 640 ký tự). Hãy chia nhỏ tin nhắn và gửi dần ha.",
    ERR_200:
        "[Chatbot] Bạn chat không thể nhận tin nhắn do đã xóa inbox hoặc block page.",
    ERR_10:
        "[Chatbot] Bạn chat không thể nhận tin nhắn do 2 bạn không nói chuyện gì trong vòng 24h. Gửi ketthuc để kết thúc chat.",
};
