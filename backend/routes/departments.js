// routes/departments.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/departments - Returns a list of unique department names from HOD users
router.get('/', async (req, res) => {
  try {
    const departments = await User.find({ role: 'HOD' }).distinct('department');
    const formatted = departments.map((name, idx) => ({
      _id: idx.toString(),
      name
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching departments' });
  }
});

module.exports = router;
