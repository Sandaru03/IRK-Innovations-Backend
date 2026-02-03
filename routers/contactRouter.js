const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/contactController');

router.post('/', sendEmail);
router.get('/test', (req, res) => res.send('Contact route is working'));

module.exports = router;
