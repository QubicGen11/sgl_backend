const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedback');

const app = express();

// Define CORS options for multiple origins
const allowedOrigins = ['https://sgl.vercel.app', 'http://localhost:5173', 'https://sglbk.vercel.app'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/feedback', feedbackRoutes);

// Update mongoose connection without deprecated options
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
