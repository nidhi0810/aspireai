const axios = require('axios');

class JobSearchService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.baseUrl = 'https://jsearch.p.rapidapi.com';
    
    // Configure axios instance for JSearch API
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });
  }

  async searchJobs(params) {
    try {
      const {
        query = 'software engineer',
        location = 'United States',
        page = 1,
        limit = 10,
        employment_types = 'FULLTIME',
        job_requirements = '',
        remote_jobs_only = false,
        date_posted = 'all'
      } = params;

      // JSearch API parameters
      const searchParams = {
        query: `${query} ${location}`.trim(),
        page: page.toString(),
        num_pages: '1',
        date_posted: date_posted,
        remote_jobs_only: remote_jobs_only.toString()
      };

      // Add employment types if specified
      if (employment_types && employment_types !== 'all') {
        searchParams.employment_types = employment_types.toUpperCase();
      }

      // Add job requirements if specified
      if (job_requirements && job_requirements !== 'all') {
        searchParams.job_requirements = job_requirements;
      }

      console.log('JSearch API Request:', searchParams);

      const response = await this.api.get('/search', {
        params: searchParams
      });

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from JSearch API');
      }

      // Transform JSearch response to our format
      const transformedJobs = this.transformJSearchResults(response.data.data);
      
      return {
        jobs: transformedJobs,
        totalResults: response.data.data.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(response.data.data.length / limit),
        searchQuery: params,
        source: 'jsearch'
      };

    } catch (error) {
      console.error('JSearch API Error:', error.response?.data || error.message);
      
      // Fallback to mock data if API fails
      if (error.response?.status === 429) {
        console.log('Rate limit exceeded, using mock data');
        return this.getMockJobResults(params);
      }
      
      if (!this.rapidApiKey || this.rapidApiKey === 'your_rapidapi_key_here') {
        console.log('No RapidAPI key configured, using mock data');
        return this.getMockJobResults(params);
      }
      
      throw error;
    }
  }

  transformJSearchResults(jobs) {
    return jobs.map(job => ({
      id: job.job_id || `job_${Date.now()}_${Math.random()}`,
      title: job.job_title,
      company: job.employer_name,
      location: this.formatLocation(job),
      salary: this.formatSalary(job),
      description: job.job_description || 'No description available',
      requirements: this.extractRequirements(job.job_description),
      benefits: this.extractBenefits(job.job_description),
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
      applicationUrl: job.job_apply_link,
      matchScore: this.calculateMatchScore(job),
      source: 'jsearch',
      employmentType: job.job_employment_type,
      isRemote: job.job_is_remote,
      companyLogo: job.employer_logo,
      jobHighlights: job.job_highlights,
      jobRequiredExperience: job.job_required_experience,
      jobRequiredSkills: job.job_required_skills
    }));
  }

  formatLocation(job) {
    if (job.job_is_remote) {
      return 'Remote';
    }
    
    const parts = [];
    if (job.job_city) parts.push(job.job_city);
    if (job.job_state) parts.push(job.job_state);
    if (job.job_country) parts.push(job.job_country);
    
    return parts.join(', ') || 'Location not specified';
  }

  formatSalary(job) {
    if (job.job_min_salary && job.job_max_salary) {
      return {
        min: job.job_min_salary,
        max: job.job_max_salary,
        currency: job.job_salary_currency || 'USD',
        period: job.job_salary_period || 'YEAR'
      };
    }
    
    return null;
  }

  extractRequirements(description) {
    if (!description) return [];
    
    const requirements = [];
    const text = description.toLowerCase();
    
    // Common requirement patterns
    const patterns = [
      /(\d+\+?\s*years?\s*(?:of\s*)?experience)/gi,
      /(bachelor'?s?\s*degree)/gi,
      /(master'?s?\s*degree)/gi,
      /(experience\s*(?:with|in)\s*[\w\s,]+)/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = description.match(pattern);
      if (matches) {
        requirements.push(...matches.slice(0, 3)); // Limit to 3 per pattern
      }
    });
    
    return requirements.slice(0, 5); // Limit total requirements
  }

  extractBenefits(description) {
    if (!description) return [];
    
    const benefits = [];
    const commonBenefits = [
      'health insurance', 'dental insurance', 'vision insurance',
      'retirement plan', '401k', 'flexible schedule', 'remote work',
      'paid time off', 'pto', 'professional development',
      'tuition reimbursement', 'stock options', 'equity'
    ];
    
    const text = description.toLowerCase();
    commonBenefits.forEach(benefit => {
      if (text.includes(benefit)) {
        benefits.push(benefit.charAt(0).toUpperCase() + benefit.slice(1));
      }
    });
    
    return benefits.slice(0, 5); // Limit to 5 benefits
  }

  calculateMatchScore(job) {
    // Simple scoring algorithm based on available data
    let score = 70; // Base score
    
    // Boost for remote jobs
    if (job.job_is_remote) score += 10;
    
    // Boost for jobs with salary info
    if (job.job_min_salary && job.job_max_salary) score += 10;
    
    // Boost for recent postings
    if (job.job_posted_at_datetime_utc) {
      const postedDate = new Date(job.job_posted_at_datetime_utc);
      const daysSincePosted = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePosted <= 7) score += 10;
    }
    
    return Math.min(score, 100);
  }

  // Fallback mock data when API is unavailable
  getMockJobResults(params) {
    const { query, location, page = 1, limit = 10 } = params;
    
    const companies = [
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Spotify',
      'Airbnb', 'Uber', 'LinkedIn', 'Twitter', 'Adobe', 'Salesforce', 'Oracle'
    ];
    
    const jobTitles = [
      'Software Engineer', 'Senior Software Engineer', 'Full Stack Developer',
      'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Data Scientist',
      'Product Manager', 'UX Designer', 'Machine Learning Engineer'
    ];
    
    // Use actual location or default locations
    const locations = location && location !== 'remote' ? 
      [location, `${location}, USA`, `Remote - ${location}`] :
      ['Remote', 'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX'];
    
    const jobs = [];
    const startIndex = (page - 1) * limit;
    
    for (let i = 0; i < limit; i++) {
      const jobIndex = startIndex + i;
      jobs.push({
        id: `mock_job_${jobIndex}`,
        title: query.includes('engineer') ? 
          jobTitles.filter(t => t.includes('Engineer'))[jobIndex % 3] :
          jobTitles[jobIndex % jobTitles.length],
        company: companies[jobIndex % companies.length],
        location: locations[jobIndex % locations.length],
        salary: {
          min: 80000 + (jobIndex % 10) * 10000,
          max: 120000 + (jobIndex % 10) * 15000,
          currency: 'USD',
          period: 'YEAR'
        },
        description: `We are looking for a talented professional to join our team in ${location || 'various locations'}. This role involves working with cutting-edge technology and collaborating with world-class engineers.`,
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '3+ years of software development experience',
          'Proficiency in modern programming languages',
          'Experience with cloud platforms',
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
        applicationUrl: `https://careers.example.com/job/${jobIndex}`,
        matchScore: Math.floor(Math.random() * 30) + 70,
        source: 'mock',
        isRemote: location === 'remote' || Math.random() > 0.7
      });
    }
    
    return {
      jobs,
      totalResults: 1250,
      currentPage: parseInt(page),
      totalPages: Math.ceil(1250 / limit),
      searchQuery: params,
      source: 'mock'
    };
  }

  async getJobDetails(jobId) {
    try {
      const response = await this.api.get('/job-details', {
        params: { job_id: jobId }
      });
      
      return this.transformJSearchResults([response.data.data])[0];
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  }

  async searchJobsByEmployer(employerName) {
    try {
      const response = await this.api.get('/search', {
        params: {
          query: `company:${employerName}`,
          page: '1',
          num_pages: '1'
        }
      });
      
      return this.transformJSearchResults(response.data.data);
    } catch (error) {
      console.error('Error searching jobs by employer:', error);
      throw error;
    }
  }
}

module.exports = JobSearchService;