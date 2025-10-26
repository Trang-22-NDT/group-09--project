const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Configure transporter: prefer explicit SMTP settings, fallback to Gmail
  let transporterConfig;

  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
    const portNum = Number(process.env.EMAIL_PORT);
    transporterConfig = {
      host: process.env.EMAIL_HOST,
      port: portNum,
      secure: portNum === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };
  } else if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    // Use Gmail SMTP
    transporterConfig = {
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    };
  } else {
    throw new Error('No email configuration found in environment variables');
  }

  const transporter = nodemailer.createTransport(transporterConfig);
  // Verify transporter (will surface auth/connection errors early)
  try {
    await transporter.verify();
  } catch (verifyErr) {
    // include useful fields when possible
    const message = `Transporter verify failed: ${verifyErr && verifyErr.message ? verifyErr.message : String(verifyErr)}`;
    verifyErr.details = {
      code: verifyErr.code || null,
      response: verifyErr.response || null
    };
    console.error(message, verifyErr.details);
    throw verifyErr;
  }

  const mailOptions = {
    from: process.env.FROM_NAME || process.env.GMAIL_USER || process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined
  };

  // Send email and return info with better error details
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId || info.accepted);
    return info;
  } catch (err) {
    console.error('Error sending email:', err && err.message ? err.message : err);
    // attach smtp response/code if present
    if (err && err.response) console.error('SMTP response:', err.response);
    if (err && err.code) console.error('Error code:', err.code);
    throw err;
  }
};

module.exports = sendEmail;
