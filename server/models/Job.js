const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: String,
  description: String,
  requirements: [String],
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  source: {
    type: String,
    enum: ['linkedin', 'indeed', 'naukri', 'manual'],
    default: 'manual'
  },
  url: String,
  status: {
    type: String,
    enum: ['saved', 'applied', 'interview', 'rejected', 'offer'],
    default: 'saved'
  },
  appliedAt: Date,
  lastFollowUp: Date,
  notes: String,
  aiInsights: {
    matchScore: Number,
    skillGaps: [String],
    recommendations: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);