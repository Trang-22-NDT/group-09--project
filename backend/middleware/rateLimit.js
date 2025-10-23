const rateLimit = require('express-rate-limit');

// If running in development or SKIP_RATE_LIMIT=true, bypass limiter to ease testing
const isDev = process.env.NODE_ENV === 'development' || process.env.SKIP_RATE_LIMIT === 'true';

if (isDev) {
  // no-op middleware for development/testing
  const forgotPasswordLimiter = (req, res, next) => {
    // optional: you can log when limiter is bypassed
    // console.log('forgotPasswordLimiter bypassed (development or SKIP_RATE_LIMIT)');
    return next();
  };

  module.exports = { forgotPasswordLimiter };
} else {
  // Limit requests to 5 per hour per IP for sensitive endpoints in production
  const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
      success: false,
      message: 'Too many password reset requests from this IP, please try again after an hour'
    }
  });

  module.exports = { forgotPasswordLimiter };
}
