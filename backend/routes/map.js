const express = require('express');
const { db } = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const doctors = db.all("SELECT id, name, clinic_name, city, lat, lng FROM doctors WHERE is_approved = 1 AND lat IS NOT NULL AND lng IS NOT NULL");
  const cruelty = db.all("SELECT id, location, lat, lng, severity FROM cruelty_reports WHERE lat IS NOT NULL AND lng IS NOT NULL");
  const animalReports = db.all("SELECT id, animal_type, location, lat, lng, status FROM animal_reports WHERE lat IS NOT NULL AND lng IS NOT NULL");
  res.json({ doctors, cruelty, animalReports });
});

module.exports = router;