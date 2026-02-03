const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  console.log('Received contact form submission:', req.body);
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // TEST: Send success response immediately to check if route works
  // return res.status(200).json({ message: 'Route reached successfully!' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kavindurajitha2002@gmail.com',
        pass: 'fqap berw vdpx azik', // Provided App Password
      },
    });

    const mailOptions = {
      from: email,
      to: 'kavindurajitha2002@gmail.com',
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
    res.status(500).json({ message: 'Error sending message. Please try again later.' });
  }
};

module.exports = { sendEmail };
