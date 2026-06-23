const express = require('express');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.all('SELECT * FROM blog_posts ORDER BY created_at DESC'));
});

router.post('/', verifyToken, requireAdmin, (req, res) => {
  const { title, content, author, link_url } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
  const result = db.run('INSERT INTO blog_posts (title, content, author, link_url, created_by) VALUES (?, ?, ?, ?, ?)', title, content, author || null, link_url || null, req.user.id);
  res.status(201).json(db.get('SELECT * FROM blog_posts WHERE id = ?', result.lastInsertRowid));
});

router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  const { title, content, author, link_url } = req.body;
  db.run('UPDATE blog_posts SET title = COALESCE(?, title), content = COALESCE(?, content), author = COALESCE(?, author), link_url = COALESCE(?, link_url) WHERE id = ?', title, content, author, link_url, req.params.id);
  res.json(db.get('SELECT * FROM blog_posts WHERE id = ?', req.params.id));
});

router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM blog_posts WHERE id = ?', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;