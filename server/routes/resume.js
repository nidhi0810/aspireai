const express = require('express');
const multer = require('multer');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const ATSAnalyzer = require('../utils/atsAnalyzer');

const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Get user resumes
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create resume
router.post('/create', auth, async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      userId: req.userId
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload and analyze PDF resume
router.post('/upload-analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const { jobDescription } = req.body;
    
    // Initialize ATS analyzer
    const atsAnalyzer = new ATSAnalyzer();
    
    // Perform real ATS analysis
    const analysis = await atsAnalyzer.analyzePDF(req.file.buffer, jobDescription);
    
    // Add file metadata
    const analysisResults = {
      ...analysis,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadDate: new Date().toISOString()
    };

    res.json({
      message: 'Resume analysis completed',
      analysis: analysisResults
    });
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }
    
    if (error.message.includes('PDF analysis failed')) {
      return res.status(400).json({ message: 'Unable to analyze PDF. Please ensure it contains readable text.' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate ATS-optimized resume
router.post('/optimize', auth, async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    
    // This would integrate with OpenAI to optimize resume
    // For now, return a mock response
    res.json({
      message: 'Resume optimization completed',
      atsScore: 85,
      suggestions: [
        'Add more relevant keywords from job description',
        'Quantify achievements with numbers',
        'Use action verbs to start bullet points'
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;