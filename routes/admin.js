const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

const adminEmail = 'admin@gmail.com';
let adminPassword = bcrypt.hashSync('admin', 10); // mutable for change password

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

router.get('/protected-route', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
