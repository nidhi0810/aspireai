const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const jobRoutes = require('./routes/jobs');
const aiRoutes = require('./routes/ai');
const wellnessRoutes = require('./routes/wellness');
const testRoutes = require('./routes/test');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting (required for X-Forwarded-For headers)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://aspireai-frontend.onrender.com', 'https://aspireai.onrender.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/test', testRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MongoDB connection
console.log('🔄 Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Error code:', err.code);
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check your MongoDB Atlas credentials');
    console.error('   2. Verify your IP is whitelisted in Network Access');
    console.error('   3. Ensure the database user has proper permissions');
    console.error('   4. Check if the cluster is running');
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});