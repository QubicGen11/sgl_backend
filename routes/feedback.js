const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');

// Middleware for logging requests
router.use((req, res, next) => {
  console.log(`Request received at ${new Date().toISOString()}`);
  next();
});

// Create feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    
    // Set up the nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use the generated app password here
      }
    });

    // Email options for the receiver (you)
    let receiverMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sanjusazid0@gmail.com',
      subject: 'New Feedback Submitted',
      
      text: `A new feedback has been submitted by ${feedback.email}`
    };

    // Email options for the sender (person who submitted the feedback)
    let senderMailOptions = {
      from: process.env.EMAIL_USER,
      to: feedback.email,
      subject: 'Thank you for your feedback',
      text: `Dear ${feedback.firstName},

Thank you for submitting your feedback. We have received your message and will get back to you shortly.

Best regards,
Somireddy Law Group PLLC`
    };

    

    // Send both emails
    let receiverEmailInfo = await transporter.sendMail(receiverMailOptions);
    console.log('Confirmation email sent to receiver:', receiverEmailInfo);

    let senderEmailInfo = await transporter.sendMail(senderMailOptions);
    console.log('Confirmation email sent to sender:', senderEmailInfo);

    res.status(201).send(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(400).send({ error: error.message });
  }
});

// Get all feedback or by email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    let feedbacks;
    if (email) {
      feedbacks = await Feedback.findOne({ email: email });
    } else {
      feedbacks = await Feedback.find();
    }
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update feedback by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete feedback by ID
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
