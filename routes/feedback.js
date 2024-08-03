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
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options for the receiver (you)
    let receiverMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sanjusazid0@gmail.com',
      subject: 'Received New Feedback',
      text: ` 
        Greetings,

        Received new feedback from client ${feedback.email}.
        Thanks.

        The details are:
        ${feedback.firstName} ${feedback.lastName}
        ${feedback.email}
      `
    };

    // Email options for the sender (person who submitted the feedback)
    let senderMailOptions = {
      from: process.env.EMAIL_USER,
      to: feedback.email,
      subject: 'Thank you for your feedback',
      text: `Dear ${feedback.firstName},

      Thank you for submitting your feedback.

      Best regards,
      Somireddy Law Group PLLC`
    };

    // Send both emails
    await transporter.sendMail(receiverMailOptions);
    await transporter.sendMail(senderMailOptions);

    res.status(201).send(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(400).send({ error: error.message });
  }
});

// Get all feedback or by email, name, or organization
router.get('/', async (req, res) => {
  try {
    const { email, name, organizationName } = req.query; // Use organizationName as the query parameter
    let feedbacks;
    if (email) {
      feedbacks = await Feedback.findOne({ email: email });
    } else if (name) {
      const regex = new RegExp(name.split(' ').join('|'), 'i');
      feedbacks = await Feedback.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { fullName: regex }
        ]
      });
    } else if (organizationName) {
      feedbacks = await Feedback.find({ organizationName: organizationName });
    } else {
      feedbacks = await Feedback.find();
    }
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get suggestions by email, name, or organization
router.get('/suggestions', async (req, res) => {
  const { email, name, organizationName } = req.query; // Use organizationName
  try {
    let suggestions;
    if (email) {
      suggestions = await Feedback.find({ email: new RegExp(email, 'i') }).select('email');
      res.json(suggestions.map(s => s.email));
    } else if (name) {
      const regex = new RegExp(name.split(' ').join('|'), 'i'); // for searching by first + last name
      suggestions = await Feedback.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { fullName: { $regex: regex } }
        ]
      }).select('firstName lastName');
      res.json(suggestions.map(s => `${s.firstName} ${s.lastName}`));
    } else if (organizationName) {  // Handle organizationName suggestion
      suggestions = await Feedback.find({ organizationName: new RegExp(organizationName, 'i') }).select('organizationName');
      res.json(suggestions.map(s => s.organizationName));
    } else {
      return res.status(400).json({ message: 'Bad Request: email, name, or organizationName query parameter is required' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions' });
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
