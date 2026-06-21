const express = require('express');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.all("SELECT * FROM doctors WHERE is_approved = 1 ORDER BY created_at DESC"));
});

router.post('/', verifyToken, (req, res) => {
  const { name, clinic_name, specialty, city, contact, lat, lng } = req.body;
  if (!name || !clinic_name || !city || !contact) return res.status(400).json({ error: 'Name, clinic, city, and contact are required' });
  const result = db.run('INSERT INTO doctors (submitted_by, name, clinic_name, specialty, city, contact, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', req.user.id, name, clinic_name, specialty || null, city, contact, lat || null, lng || null);
  res.status(201).json(db.get('SELECT * FROM doctors WHERE id = ?', result.lastInsertRowid));
});

router.get('/pending', verifyToken, requireAdmin, (req, res) => {
  res.json(db.all("SELECT d.*, u.name AS submitter FROM doctors d LEFT JOIN users u ON d.submitted_by = u.id WHERE d.is_approved = 0 ORDER BY d.created_at DESC"));
});

router.put('/:id/approve', verifyToken, requireAdmin, (req, res) => {
  const { is_approved } = req.body;
  if (![0, 1, 2].includes(is_approved)) return res.status(400).json({ error: 'is_approved must be 0, 1, or 2' });
  db.run('UPDATE doctors SET is_approved = ? WHERE id = ?', is_approved, req.params.id);
  res.json(db.get('SELECT * FROM doctors WHERE id = ?', req.params.id));
});

module.exports = router;