require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const Admin = require('./models/Admin');
const authRouter = require('./routers/authRouter');
const projectRouter = require('./routers/projectRouter');
const contactRouter = require('./routers/contactRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== ROUTES ==================

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Contact form
// Uses contactRouter -> contactController

// API routers
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/contact', contactRouter);

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({
    message: `Route ${req.url} not found on this server.`,
  });
});

// ================== DATABASE ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully');

    // Seed default admin
    const adminExists = await Admin.findOne({
      email: 'admin@irkinnovations.com',
    });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await Admin.create({
        email: 'admin@irkinnovations.com',
        password: hashedPassword,
      });

      console.log(
        'Default Admin Created: admin@irkinnovations.com / admin123'
      );
    }
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
