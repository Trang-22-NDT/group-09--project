Hướng dẫn cấu hình gửi email qua Gmail (App Password)

1) Bật 2-Step Verification trên tài khoản Google của bạn
   - Vào: https://myaccount.google.com/security
   - Bật "2-Step Verification" theo hướng dẫn của Google.

2) Tạo App Password
   - Sau khi bật 2-Step, vào mục "App passwords" ở cùng trang.
   - Chọn ứng dụng: Mail, thiết bị: Other (tùy chọn), đặt tên rồi tạo.
   - Google sẽ cung cấp một mật khẩu 16 ký tự. Sao chép giá trị này.

3) Điền vào file `.env` trong `backend/`
   - Ví dụ (sử dụng SMTP Gmail):

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USERNAME=youremail@gmail.com
EMAIL_PASSWORD=the_16_char_app_password
FROM_NAME="Group09 <youremail@gmail.com>"
TEST_RECIPIENT=your-test-recipient@example.com
```

4) Khởi động lại server backend
   - `npm run dev` trong `backend`.

5) Kiểm tra transporter bằng script `test-send-email.js`
   - Chạy: `node test-send-email.js`
   - Nếu transporter OK, script sẽ in "Transporter OK" và thông tin gửi.

6) Gọi endpoint `POST /api/auth/forgot-password` để yêu cầu gửi email reset.

Ghi chú
 - Nếu bạn dùng Google Workspace (tài khoản doanh nghiệp), admin có thể phải bật App Passwords hoặc SMTP.
 - Đối với production, cân nhắc sử dụng dịch vụ gửi mail chuyên dụng (SendGrid, Mailgun, SES) để đảm bảo deliverability.
