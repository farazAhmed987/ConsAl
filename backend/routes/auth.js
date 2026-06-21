const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { signToken, verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
  const existing = db.get('SELECT id FROM users WHERE email = ?', email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hash = bcrypt.hashSync(password, 10);
  const result = db.run('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)', name, email, hash, phone || null);
  const user = db.get('SELECT id, name, email, phone, role FROM users WHERE id = ?', result.lastInsertRowid);
  const token = signToken(user);
  res.status(201).json({ user, token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = db.get('SELECT * FROM users WHERE email = ?', email);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid email or password' });
  const token = signToken(user);
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

router.get('/me', verifyToken, (req, res) => {
  const user = db.get('SELECT id, name, email, phone, role FROM users WHERE id = ?', req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;