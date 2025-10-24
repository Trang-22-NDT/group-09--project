const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/admin/logs?userId=&action=&limit=&page=
router.get('/logs', protect, authorize('admin'), async (req, res) => {
  try {
    const { userId, action, limit = 50, page = 1 } = req.query;
    const q = {};
    if (userId) q.user = userId;
    if (action) q.action = action;

    const logs = await Log.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
