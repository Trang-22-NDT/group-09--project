const Log = require('../models/Log');

const logActivity = async ({ user = null, action, req = null, meta = {} }) => {
  try {
    const ip = (req && (req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress)) || meta.ip || null;
    const userAgent = (req && req.headers && req.headers['user-agent']) || meta.userAgent || null;

    const entry = await Log.create({
      user: user || null,
      action,
      ip,
      userAgent,
      meta
    });

    return entry;
  } catch (err) {
    // Logging must not break the main flow
    console.error('logActivity error:', err && err.message ? err.message : err);
    return null;
  }
};

module.exports = logActivity;
