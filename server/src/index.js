const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler'); // ✅ Import error handler

const app = express();

// Configure CORS with more specific options
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const appointmentRoutes = require('./routes/appointments');
const serviceRoutes = require('./routes/services');

// Setup routes
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/services', serviceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Centralized Error Handler (MUST BE LAST MIDDLEWARE)
app.use(errorHandler);

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixtime')
  .then(() => {
    console.log('MongoDB connected successfully');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with error
  });
