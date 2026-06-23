const express = require('express');
const cors = require('cors');
const path = require('path');
const { initialize } = require('./db');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const doctorRoutes = require('./routes/doctors');
const crueltyRoutes = require('./routes/cruelty');
const donationRoutes = require('./routes/donations');
const rescueRoutes = require('./routes/rescue');
const awarenessRoutes = require('./routes/awareness');
const blogRoutes = require('./routes/blog');
const mapRoutes = require('./routes/map');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/cruelty-reports', crueltyRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/rescue-updates', rescueRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/map-data', mapRoutes);
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`PawPal backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});