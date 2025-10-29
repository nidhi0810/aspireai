import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Star,
  ExternalLink,
  Plus,
  Filter,
  Zap
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    experience: 'all',
    jobType: 'all',
    salaryMin: ''
  });



  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a job title or keyword');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('/api/jobs/search', {
        params: {
          query: searchQuery,
          location: location || 'United States',
          experience: filters.experience,
          jobType: filters.jobType,
          remote_jobs_only: location.toLowerCase() === 'remote',
          page: 1,
          limit: 10
        }
      });

      setJobs(response.data.jobs);
      
      if (response.data.source === 'jsearch') {
        toast.success(`Found ${response.data.jobs.length} real jobs from JSearch API`);
      } else {
        toast.success(`Found ${response.data.totalResults} jobs (using mock data)`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Job search failed');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleSaveJob = async (job) => {
    try {
      await axios.post('/api/jobs/add', {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        salary: job.salary,
        url: job.applicationUrl,
        source: job.source || 'search',
        status: 'saved'
      });

      toast.success(`Saved ${job.title} at ${job.company}`);
    } catch (error) {
      toast.error('Failed to save job');
      console.error('Save job error:', error);
    }
  };

  const handleQuickApply = async (job) => {
    try {
      await axios.post('/api/jobs/auto-apply', {
        jobIds: [job.id],
        coverLetter: 'Auto-generated cover letter',
        resumeId: 'default'
      });

      toast.success(`Applied to ${job.title} at ${job.company}`);
    } catch (error) {
      toast.error('Quick apply failed');
      console.error('Quick apply error:', error);
    }
  };

  const JobCard = ({ job, isRecommendation = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            {isRecommendation && (
              <span className="px-2 py-1 bg-primary-500/20 text-primary-500 text-xs rounded-full">
                Recommended
              </span>
            )}
            {job.isRemote && (
              <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                Remote
              </span>
            )}
            {job.source === 'jsearch' && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full">
                Real Job
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-slate-600 dark:text-slate-400 font-medium">{job.company}</p>
            {job.companyLogo && (
              <img 
                src={job.companyLogo} 
                alt={`${job.company} logo`}
                className="w-6 h-6 rounded"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
        </div>
        
        {job.matchScore && (
          <div className="flex items-center space-x-1 text-success-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{job.matchScore}% match</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        
        {job.salary && (
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>
              ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
              {job.salary.period && job.salary.period !== 'YEAR' && ` /${job.salary.period.toLowerCase()}`}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{new Date(job.postedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {job.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {job.description}
        </p>
      )}

      {isRecommendation && job.matchReasons && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Why this matches you:</h4>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            {job.matchReasons.slice(0, 2).map((reason, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span className="text-success-500 mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => handleSaveJob(job)}
          className="flex-1 btn-secondary text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Save Job
        </button>
        
        <button
          onClick={() => handleQuickApply(job)}
          className="flex-1 btn-primary text-sm"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Apply
        </button>
        
        <a
          href={job.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="View original posting"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Job Search</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Find your next opportunity with AI-powered job matching
          </p>
        </motion.div>



        {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl mb-8"
            >
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Location or Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search Jobs'}
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  className="input-field w-auto"
                >
                  <option value="all">All Experience</option>
                  <option value="under_3_years_experience">Under 3 years</option>
                  <option value="more_than_3_years_experience">3+ years</option>
                  <option value="no_experience">No experience</option>
                </select>
                
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                  className="input-field w-auto"
                >
                  <option value="FULLTIME">Full Time</option>
                  <option value="PARTTIME">Part Time</option>
                  <option value="CONTRACTOR">Contract</option>
                  <option value="INTERN">Internship</option>
                </select>

                <select
                  value={filters.datePosted || 'all'}
                  onChange={(e) => setFilters({...filters, datePosted: e.target.value})}
                  className="input-field w-auto"
                >
                  <option value="all">Any time</option>
                  <option value="today">Today</option>
                  <option value="3days">Last 3 days</option>
                  <option value="week">Last week</option>
                  <option value="month">Last month</option>
                </select>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={location.toLowerCase() === 'remote'}
                    onChange={(e) => setLocation(e.target.checked ? 'remote' : '')}
                    className="rounded"
                  />
                  <span className="text-sm">Remote only</span>
                </label>
              </div>
            </motion.div>

            {/* Search Results */}
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <JobCard key={job.id || index} job={job} />
              ))}
              
              {jobs.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Search for jobs to see results here
                  </p>
                </div>
              )}
            </div>
      </div>
    </div>
  );
};

export default JobSearch;