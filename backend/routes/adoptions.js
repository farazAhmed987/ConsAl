const express = require('express');
const { db } = require('../db');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/available', (req, res) => {
  const animals = db.all("SELECT id, location, incident_description, severity, created_at FROM cruelty_reports WHERE status = 'recovering' ORDER BY created_at DESC");
  res.json(animals);
});

router.get('/', verifyToken, (req, res) => {
  const apps = db.all('SELECT a.*, c.location, c.incident_description, c.severity FROM adoption_applications a JOIN cruelty_reports c ON a.cruelty_report_id = c.id WHERE a.user_id = ? ORDER BY a.created_at DESC', req.user.id);
  res.json(apps);
});

router.get('/admin', verifyToken, requireAdmin, (req, res) => {
  const apps = db.all('SELECT a.*, c.location, c.incident_description, c.severity, u.name AS user_name, u.email AS user_email FROM adoption_applications a JOIN cruelty_reports c ON a.cruelty_report_id = c.id JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC');
  res.json(apps);
});

router.post('/', verifyToken, (req, res) => {
  const { cruelty_report_id, applicant_name, applicant_contact, applicant_address, reason } = req.body;
  if (!cruelty_report_id || !applicant_name || !applicant_contact || !applicant_address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const report = db.get('SELECT id, status FROM cruelty_reports WHERE id = ?', cruelty_report_id);
  if (!report) return res.status(404).json({ error: 'Animal not found' });
  if (report.status !== 'recovering') return res.status(400).json({ error: 'This animal is not available for adoption' });

  const existing = db.get('SELECT id FROM adoption_applications WHERE cruelty_report_id = ? AND user_id = ? AND status = ?', cruelty_report_id, req.user.id, 'pending');
  if (existing) return res.status(400).json({ error: 'You already have a pending application for this animal' });

  const result = db.run('INSERT INTO adoption_applications (cruelty_report_id, user_id, applicant_name, applicant_contact, applicant_address, reason) VALUES (?, ?, ?, ?, ?, ?)', cruelty_report_id, req.user.id, applicant_name, applicant_contact, applicant_address, reason || null);
  res.status(201).json(db.get('SELECT * FROM adoption_applications WHERE id = ?', result.lastInsertRowid));
});

router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const app = db.get('SELECT * FROM adoption_applications WHERE id = ?', req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  db.run('UPDATE adoption_applications SET status = ? WHERE id = ?', status, req.params.id);
  if (status === 'approved') {
    db.run("UPDATE cruelty_reports SET status = 'adopted' WHERE id = ?", app.cruelty_report_id);
  }
  res.json(db.get('SELECT a.*, c.location, c.incident_description, c.severity, u.name AS user_name, u.email AS user_email FROM adoption_applications a JOIN cruelty_reports c ON a.cruelty_report_id = c.id JOIN users u ON a.user_id = u.id WHERE a.id = ?', req.params.id));
});

module.exports = router;
