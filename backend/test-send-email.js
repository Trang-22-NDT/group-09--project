const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    console.log('📧 Preparing to send email...');
    console.log('📧 To:', options.email);
    console.log('📧 Subject:', options.subject);
    console.log('📧 Config check:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD,
      passwordLength: process.env.EMAIL_PASSWORD?.length
    });

    // Create transporter - Gmail config
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Email options
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);

    return info;
  } catch (error) {
      console.error('Send error:', error && error.message ? error.message : error);
      if (error && error.code) console.error('Error code:', error.code);
      if (error && error.response) console.error('Error response:', error.response);
    throw new Error('Không thể gửi email: ' + error.message);
  }
};

module.exports = sendEmail;