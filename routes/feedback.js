const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');


router.use((req, res, next) => {
  console.log(`Request received at ${new Date().toISOString()}`);
  next();
});

// Create feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send(feedback);

    res.send("Api is working fine")
  } catch (error) {
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