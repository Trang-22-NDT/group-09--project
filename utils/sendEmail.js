const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // TẠM THỜI: Hardcode config
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '9ae311f3e83d15',
        pass: '8960118d602d42'
      }
    });

    const mailOptions = {
      from: 'Auth App Group 09 <noreply@authapp.com>',
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
};

module.exports = sendEmail;