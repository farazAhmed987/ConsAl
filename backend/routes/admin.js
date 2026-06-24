const express = require('express');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', verifyToken, requireAdmin, (req, res) => {
  const reports = db.get('SELECT COUNT(*) AS count FROM animal_reports');
  const donations = db.get('SELECT COUNT(*) AS count FROM donations');
  const doctors = db.get('SELECT COUNT(*) AS count FROM doctors');
  const cruelty = db.get('SELECT COUNT(*) AS count FROM cruelty_reports');
  const awareness = db.get('SELECT COUNT(*) AS count FROM awareness_posts');
  const blog = db.get('SELECT COUNT(*) AS count FROM blog_posts');
  const adoptions = db.get('SELECT COUNT(*) AS count FROM adoption_applications WHERE status = ?', 'pending');
  res.json({
    reports: reports.count,
    donations: donations.count,
    doctors: doctors.count,
    cruelty: cruelty.count,
    awareness: awareness.count,
    blog: blog.count,
    adoptions: adoptions.count
  });
});

module.exports = router;
