require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const authRouter = require('./routers/authRouter');
const projectRouter = require('./routers/projectRouter');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/contact', async (req, res) => {
  console.log('Contact form hit:', req.body);
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h3>Contact Details</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ message: 'Error sending message.' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Catch-all for 404s
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).send(`Route ${req.url} not found on this server.`);
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
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
