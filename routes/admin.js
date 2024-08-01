const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const Settings = require('../models/Settings'); // Import the Settings model

const adminEmail = 'admin@gmail.com';
let adminPassword = bcrypt.hashSync('admin', 10); // mutable for change password

// Admin login route

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email, password });

  if (email === adminEmail && bcrypt.compareSync(password, adminPassword)) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token generated');
    res.json({ success: true, token });
  } else {
    console.log('Login failed, invalid email or password');
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Change password route
router.post('/change-password', authenticateJWT, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { email } = req.user;

  console.log('Change password request received:', { currentPassword, newPassword });

  if (!currentPassword || !newPassword) {
    console.log('Current password or new password is missing');
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }

  if (email === adminEmail) {
    console.log('Comparing passwords');
    if (bcrypt.compareSync(currentPassword, adminPassword)) {
      console.log('Current password is correct');
      adminPassword = bcrypt.hashSync(newPassword, 10);
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      console.log('Current password is incorrect');
      res.status(401).json({ success: false, message: 'Invalid current password' });
    }
  } else {
    console.log('Unauthorized user');
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// Protected route example
router.get('/protected-route', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Get default form data
router.get('/form-defaults', authenticateJWT, async (req, res) => {
  try {
    const defaults = await Settings.findOne({});
    res.json(defaults);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form defaults' });
  }
});

// Update default form data
router.post('/form-defaults', async (req, res) => {
  const { email, organizationName, firstName, lastName, phoneNumber, individualsList, servicesList, feedbackQuestions, titleOptions, newsletterOptions } = req.body;
  try {
    let settings = await Settings.findOne({});
    if (settings) {
      settings = await Settings.findOneAndUpdate({}, {
        email,
        organizationName,
        firstName,
        lastName,
        phoneNumber,
        individualsList,
        servicesList,
        feedbackQuestions,
        titleOptions,
        newsletterOptions
      }, { new: true });
    } else {
      settings = new Settings({
        email,
        organizationName,
        firstName,
        lastName,
        phoneNumber,
        individualsList,
        servicesList,
        feedbackQuestions,
        titleOptions,
        newsletterOptions
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating form defaults' });
  }
});


module.exports = router;
