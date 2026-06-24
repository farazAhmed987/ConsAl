const express = require('express');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

const VALID_STATUSES = ['pending', 'investigating', 'rescued', 'recovering', 'adopted'];

router.get('/', verifyToken, requireAdmin, (req, res) => {
  res.json(db.all('SELECT c.*, u.name AS submitter FROM cruelty_reports c LEFT JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC'));
});

router.get('/rescue-feed', (req, res) => {
  const rows = db.all("SELECT *, 'cruelty_report' AS source_type, 'Cruelty Report' AS type_label FROM cruelty_reports WHERE status IN ('rescued','recovering','adopted') ORDER BY created_at DESC");
  res.json(rows);
});

router.post('/', verifyToken, (req, res) => {
  const { location, incident_description, severity, lat, lng } = req.body;
  if (!location || !incident_description) return res.status(400).json({ error: 'Location and incident description are required' });
  const result = db.run('INSERT INTO cruelty_reports (user_id, location, incident_description, severity, lat, lng) VALUES (?, ?, ?, ?, ?, ?)', req.user.id, location, incident_description, severity || 'medium', lat || null, lng || null);
  res.status(201).json(db.get('SELECT * FROM cruelty_reports WHERE id = ?', result.lastInsertRowid));
});

router.put('/:id/status', verifyToken, requireAdmin, (req, res) => {
  const { status, admin_notes } = req.body;
  if (status && !VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  if (admin_notes !== undefined) {
    db.run('UPDATE cruelty_reports SET admin_notes = ? WHERE id = ?', admin_notes, req.params.id);
  }
  if (status) {
    db.run('UPDATE cruelty_reports SET status = ? WHERE id = ?', status, req.params.id);
  }
  res.json(db.get('SELECT * FROM cruelty_reports WHERE id = ?', req.params.id));
});

module.exports = router;
