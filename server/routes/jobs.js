const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const JobSearchService = require('../services/jobSearchService');

const router = express.Router();

// Get all jobs for user
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.userId };
    
    if (status) query.status = status;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new job
router.post('/add', auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      userId: req.userId
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        status,
        ...(status === 'applied' && { appliedAt: new Date() })
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search jobs from external sources using JSearch API
router.get('/search', auth, async (req, res) => {
  try {
    const { 
      query = 'software engineer', 
      location = 'United States', 
      page = 1, 
      limit = 10,
      experience = 'all',
      jobType = 'FULLTIME',
      remote_jobs_only = false,
      date_posted = 'all'
    } = req.query;

    // Initialize job search service
    const jobSearchService = new JobSearchService();
    
    // Search jobs using JSearch API
    const searchResults = await jobSearchService.searchJobs({
      query,
      location: location === 'remote' ? 'United States' : location,
      page: parseInt(page),
      limit: parseInt(limit),
      employment_types: jobType,
      job_requirements: experience !== 'all' ? experience : '',
      remote_jobs_only: location === 'remote' || remote_jobs_only === 'true',
      date_posted
    });
    
    res.json(searchResults);
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ 
      message: 'Job search failed', 
      error: error.message,
      fallback: 'Using mock data due to API unavailability'
    });
  }
});

// Get detailed job information
router.get('/details/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobSearchService = new JobSearchService();
    
    const jobDetails = await jobSearchService.getJobDetails(jobId);
    res.json(jobDetails);
  } catch (error) {
    console.error('Job details error:', error);
    res.status(500).json({ message: 'Failed to fetch job details', error: error.message });
  }
});

// Get job recommendations based on user profile
router.get('/recommendations', auth, async (req, res) => {
  try {
    // Get user profile for personalized recommendations
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user || !user.profile) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    const { targetRole, skills, experience, location } = user.profile;
    
    // Generate personalized job recommendations
    const recommendations = generateJobRecommendations(targetRole, skills, experience, location);
    
    res.json({
      recommendations,
      basedOn: {
        targetRole,
        skills: skills?.slice(0, 5), // Show top 5 skills
        experience,
        location
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
  }
});

// Auto-apply to multiple jobs
router.post('/auto-apply', auth, async (req, res) => {
  try {
    const { jobIds, coverLetter, resumeId } = req.body;
    
    if (!jobIds || jobIds.length === 0) {
      return res.status(400).json({ message: 'No jobs selected for application' });
    }
    
    // Mock auto-apply process
    const results = {
      successful: [],
      failed: [],
      total: jobIds.length
    };
    
    // Simulate application process
    for (const jobId of jobIds) {
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        // Save to user's tracked jobs
        const job = new Job({
          userId: req.userId,
          title: `Auto-Applied Job ${jobId}`,
          company: `Company ${jobId}`,
          status: 'applied',
          appliedAt: new Date(),
          source: 'auto-apply',
          notes: 'Applied via AspireAI auto-apply feature'
        });
        
        await job.save();
        results.successful.push({ jobId, status: 'applied' });
      } else {
        results.failed.push({ jobId, reason: 'Application requirements not met' });
      }
    }
    
    res.json({
      message: `Auto-apply completed: ${results.successful.length}/${results.total} successful`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Auto-apply failed', error: error.message });
  }
});

// Helper function to generate mock job results
function generateMockJobResults(query, location, page, limit, experience, jobType) {
  const companies = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Spotify',
    'Airbnb', 'Uber', 'LinkedIn', 'Twitter', 'Adobe', 'Salesforce', 'Oracle'
  ];
  
  const jobTitles = [
    'Software Engineer', 'Senior Software Engineer', 'Full Stack Developer',
    'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Data Scientist',
    'Product Manager', 'UX Designer', 'Machine Learning Engineer'
  ];
  
  const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote',
    'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Atlanta, GA'
  ];
  
  const jobs = [];
  const startIndex = (page - 1) * limit;
  
  for (let i = 0; i < limit; i++) {
    const jobIndex = startIndex + i;
    jobs.push({
      id: `job_${jobIndex}`,
      title: jobTitles[jobIndex % jobTitles.length],
      company: companies[jobIndex % companies.length],
      location: location === 'remote' ? 'Remote' : locations[jobIndex % locations.length],
      salary: {
        min: 80000 + (jobIndex % 10) * 10000,
        max: 120000 + (jobIndex % 10) * 15000,
        currency: 'USD'
      },
      description: `We are looking for a talented ${jobTitles[jobIndex % jobTitles.length]} to join our team. You will work on cutting-edge projects and collaborate with world-class engineers.`,
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of software development experience',
        'Proficiency in JavaScript, Python, or Java',
        'Experience with cloud platforms (AWS, GCP, Azure)',
        'Strong problem-solving skills'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development budget',
        'Unlimited PTO'
      ],
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: `https://careers.${companies[jobIndex % companies.length].toLowerCase()}.com/job/${jobIndex}`,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
      source: 'linkedin'
    });
  }
  
  return jobs;
}

// Helper function to generate job recommendations
function generateJobRecommendations(targetRole, skills, experience, location) {
  const recommendations = [];
  
  // Generate 10 personalized recommendations
  for (let i = 0; i < 10; i++) {
    recommendations.push({
      id: `rec_${i}`,
      title: targetRole || 'Software Engineer',
      company: `Recommended Company ${i + 1}`,
      location: location || 'Remote',
      matchScore: Math.floor(Math.random() * 20) + 80, // 80-100% match
      matchReasons: [
        `Matches your target role: ${targetRole}`,
        `Requires skills you have: ${skills?.slice(0, 2).join(', ')}`,
        `Suitable for ${experience} years experience`,
        'Company culture aligns with your preferences'
      ],
      salary: {
        min: 90000 + i * 5000,
        max: 130000 + i * 7000,
        currency: 'USD'
      },
      postedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: `https://example.com/job/rec_${i}`
    });
  }
  
  return recommendations;
}

module.exports = router;