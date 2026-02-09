const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (req, res) => {
  console.log('Received contact form submission:', req.body);
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await resend.emails.send({
      from: 'IRK Innovations <onboarding@resend.dev>',
      to: process.env.EMAIL_USER,
      replyTo: email,
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
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ message: 'Error sending message. Please try again later.' });
  }
};

module.exports = { sendEmail };
