const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', verifyToken, (req, res) => {
  const { donor_name, donor_email, amount, payment_method, notes } = req.body;
  if (!donor_name || !amount || amount <= 0) return res.status(400).json({ error: 'Donor name and a positive amount are required' });
  const transaction_id = 'TXN-' + uuidv4().slice(0, 8).toUpperCase();
  const result = db.run('INSERT INTO donations (user_id, donor_name, donor_email, amount, payment_method, transaction_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', req.user.id, donor_name, donor_email || null, amount, payment_method || 'credit_card', transaction_id, notes || null);
  res.status(201).json(db.get('SELECT * FROM donations WHERE id = ?', result.lastInsertRowid));
});

router.get('/', verifyToken, requireAdmin, (req, res) => {
  res.json(db.all('SELECT * FROM donations ORDER BY created_at DESC'));
});

router.get('/stats', verifyToken, requireAdmin, (req, res) => {
  const total = db.get('SELECT COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total_amount FROM donations');
  const byMonth = db.all("SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count, SUM(amount) AS total FROM donations GROUP BY month ORDER BY month DESC LIMIT 12");
  const topDonor = db.get('SELECT donor_name, SUM(amount) AS total FROM donations GROUP BY donor_name ORDER BY total DESC LIMIT 1');
  res.json({ ...total, byMonth, topDonor: topDonor || null });
});

module.exports = router;