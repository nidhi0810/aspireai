const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  content: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      portfolio: String
    },
    summary: String,
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: [String]
    }],
    education: [{
      degree: String,
      institution: String,
      location: String,
      graduationDate: Date,
      gpa: String
    }],
    skills: {
      technical: [String],
      soft: [String]
    },
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      url: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      url: String
    }]
  },
  atsScore: Number,
  customizations: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    modifications: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);