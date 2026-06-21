const express = require('express');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  let rows;
  if (req.user.role === 'admin') {
    rows = db.all('SELECT r.*, u.name AS submitter FROM animal_reports r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC');
  } else {
    rows = db.all('SELECT * FROM animal_reports WHERE user_id = ? ORDER BY created_at DESC', req.user.id);
  }
  res.json(rows);
});

router.get('/:id', verifyToken, (req, res) => {
  const row = db.get('SELECT * FROM animal_reports WHERE id = ?', req.params.id);
  if (!row) return res.status(404).json({ error: 'Report not found' });
  if (req.user.role !== 'admin' && row.user_id !== req.user.id) return res.status(403).json({ error: 'Access denied' });
  res.json(row);
});

router.post('/', verifyToken, (req, res) => {
  const { animal_type, location, description, photo_url, contact_name, contact_phone, lat, lng } = req.body;
  if (!animal_type || !location || !description) return res.status(400).json({ error: 'Animal type, location, and description are required' });
  const result = db.run('INSERT INTO animal_reports (user_id, animal_type, location, description, photo_url, contact_name, contact_phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', req.user.id, animal_type, location, description, photo_url || null, contact_name || null, contact_phone || null, lat || null, lng || null);
  const row = db.get('SELECT * FROM animal_reports WHERE id = ?', result.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id/status', verifyToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['pending', 'in_progress', 'resolved'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.run('UPDATE animal_reports SET status = ? WHERE id = ?', status, req.params.id);
  res.json(db.get('SELECT * FROM animal_reports WHERE id = ?', req.params.id));
});

module.exports = router;