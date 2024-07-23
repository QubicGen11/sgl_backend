const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedback');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  // origin:'https://sgl.vercel.app', // Add your frontend URLs here
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/feedback', feedbackRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Test route
app.get('/test', (req, res) => {
  res.send('Hello World!');
});
app.get('/', (req, res) => {
  res.send('API is working fine.');
});

// Set up the port dynamically
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for Vercel
module.exports = app;