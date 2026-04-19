/**
 * Mental Health Outcome Analytics System - Server
 * Express + MongoDB backend with JWT authentication
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const extraOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const corsOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];
const allowedVercelPreviewPattern =
  /^https:\/\/mental-health-outcome-analysis-1p56(?:-[a-z0-9]+)?\.vercel\.app$/;

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests and local tools that don't send Origin.
      if (!origin) return callback(null, true);

      if (
        corsOrigins.includes(origin) ||
        allowedVercelPreviewPattern.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/responses', require('./routes/responseRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mental Health Analytics API running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
