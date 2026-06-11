const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./utils/errorHandler');
const path = require('path');

const app = express();

// Connect DB
connectDB();

//mullter Upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));  // Serve uploads publicly

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/v1', limiter);

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/doctors', require('./routes/doctors'));
app.use('/api/v1/appointments', require('./routes/appointments'));
app.use('/api/v1/chats', require('./routes/chats'));
app.use('/api/v1/uploads', require('./routes/uploads'));
// app.use('/api/v1/assistant', require('./routes/assistant'));

// Error handler
app.use(errorHandler);

module.exports = app;