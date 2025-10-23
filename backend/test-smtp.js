require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('📧 Testing SMTP configuration...\n');
console.log('Config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  hasPassword: !!process.env.EMAIL_PASSWORD,
  passwordLength: process.env.EMAIL_PASSWORD?.length
});

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log('\n🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: process.env.EMAIL_USER,
      subject: '✅ SMTP Test - Group 09',
      text: 'SMTP configuration is working!',
      html: '<h2>✅ Success</h2><p>Your Gmail SMTP is working!</p>'
    });

    console.log('✅ Test email sent!');
    console.log('Message ID:', info.messageId);
    console.log('\n🎉 All checks passed!\n');
  } catch (error) {
    console.error('\n❌ SMTP Test Failed:', error.message);
    console.error('\n📋 Check:');
    console.error('1. EMAIL_PASSWORD is 16-char App Password (no spaces)');
    console.error('2. EMAIL_USER matches Gmail that created App Password');
    console.error('3. 2-Step Verification enabled');
    console.error('4. Try: https://accounts.google.com/DisplayUnlockCaptcha\n');
    process.exit(1);
  }
})();