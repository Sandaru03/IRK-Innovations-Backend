require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const authRouter = require('./routers/authRouter');
const projectRouter = require('./routers/projectRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Database Connection & Admin Seeding
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully');

    // Seed Default Admin
    const adminExists = await Admin.findOne({ email: 'admin@irkinnovations.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await Admin.create({
        email: 'admin@irkinnovations.com',
        password: hashedPassword,
      });
      console.log('Default Admin Created: admin@irkinnovations.com / admin123');
    }
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
