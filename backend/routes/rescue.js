const express = require('express');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.all('SELECT * FROM rescue_updates ORDER BY created_at DESC'));
});

router.post('/', verifyToken, requireAdmin, (req, res) => {
  const { title, location, description, status, image_url } = req.body;
  if (!title || !location || !status) return res.status(400).json({ error: 'Title, location, and status are required' });
  const result = db.run('INSERT INTO rescue_updates (title, location, description, status, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?)', title, location, description || null, status, image_url || null, req.user.id);
  res.status(201).json(db.get('SELECT * FROM rescue_updates WHERE id = ?', result.lastInsertRowid));
});

router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  const { title, location, description, status, image_url } = req.body;
  db.run('UPDATE rescue_updates SET title = COALESCE(?, title), location = COALESCE(?, location), description = COALESCE(?, description), status = COALESCE(?, status), image_url = COALESCE(?, image_url) WHERE id = ?', title, location, description, status, image_url, req.params.id);
  res.json(db.get('SELECT * FROM rescue_updates WHERE id = ?', req.params.id));
});

router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM rescue_updates WHERE id = ?', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router