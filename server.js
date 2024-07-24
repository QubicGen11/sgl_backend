const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedback');
const Feedback = require('./models/Feedback'); // Import the Feedback model

const app = express();

const allowedOrigins = ['https://sgl.vercel.app', 'http://localhost:5173', 'https://sglbk.vercel.app'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use('/api/feedback', feedbackRoutes);

let individualsList = [
  'Aishwarya', 'Akashkumar', 'Akhila', 'Anjali', 'Anudeep', 'Ashwini', 'Baji', 'Bharghav', 'Booja', 'Divya',
  'Harshit', 'Hemaletha', 'Hemendra', 'Hrithik', 'Ishika', 'Jahnavi', 'Jigsaya', 'Kalyani', 'Kiran', 'Kunmun',
  'Lakshmana Rao', 'Manga', 'Mani', 'Manish', 'Manohar', 'Monica', 'Nikhita', 'Pradeep', 'Pranathi', 'Praveen',
  'Rama Rao', 'Ravi Kumar', 'Raviteja', 'Shashank', 'Sheeja', 'Shreyas', 'Smitha', 'Sneha', 'Sravan', 'Srikanth',
  'Subham', 'Sumavanthi', 'Surabhi', 'Venkatesh'
];

let servicesList = [
  'Immigration', 'Litigation', 'Corporate', 'Employment', 'Family Based Immigration', 'Other'
];

app.get('/api/lists', (req, res) => {
  res.json({ individualsList, servicesList });
});

app.post('/api/lists/individuals', (req, res) => {
  const { updatedList } = req.body;
  individualsList = updatedList;
  res.json({ success: true });
});

app.post('/api/lists/services', (req, res) => {
  const { updatedList } = req.body;
  servicesList = updatedList;
  res.json({ success: true });
});

app.get('/api/feedback/suggestions', async (req, res) => {
  const { email } = req.query;
  try {
    if (!email) {
      return res.status(400).send('Email query parameter is required');
    }
    const suggestions = await Feedback.find({ email: { $regex: email, $options: 'i' } }).distinct('email');
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching email suggestions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch feedback within date range
app.get('/api/feedback/date-range', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    if (!startDate || !endDate) {
      return res.status(400).send('Start date and end date query parameters are required');
    }
    const feedbacks = await Feedback.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback within date range:', error);
    res.status(500).send('Internal Server Error');
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.get('/', (req, res) => {
  res.send('API is working fine.');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
