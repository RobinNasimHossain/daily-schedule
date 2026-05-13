const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/renovation-schedule';
  await mongoose.connect(uri);
  cachedDb = mongoose.connection;
  return cachedDb;
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

const authRoutes = require('../server/routes/auth');
const projectRoutes = require('../server/routes/projects');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

module.exports = app;
