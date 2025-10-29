import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MessageCircle, 
  TrendingUp,
  Heart,
  Plus,
  Clock,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Zap,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AddJobModal from '../components/AddJobModal';
import api from '../config/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    responses: 0,
    wellnessScore: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch user's jobs
      const jobsResponse = await api.get('/api/jobs/');
      const jobs = jobsResponse.data.jobs || [];
      
      // Fetch wellness data
      let wellnessScore = 0;
      try {
        const wellnessResponse = await api.get('/api/wellness/insights');
        wellnessScore = wellnessResponse.data.weeklyAverage?.mood || 0;
      } catch (wellnessError) {
        console.log('Wellness data not available');
      }
      
      // Calculate stats from real data
      const calculatedStats = {
        totalApplications: jobs.length,
        interviews: jobs.filter(job => job.status === 'interview').length,
        responses: jobs.filter(job => ['interview', 'offer', 'rejected'].includes(job.status)).length,
        wellnessScore: wellnessScore
      };

      // Animate stats
      animateStats(calculatedStats);
      
      // Set recent jobs (last 5)
      setRecentJobs(jobs.slice(0, 5));
      
      // Generate dynamic tasks based on jobs
      generateUpcomingTasks(jobs);
      
      // Generate AI recommendations
      generateRecommendations(jobs);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      // Keep stats at 0 if API fails
      setStats({
        totalApplications: 0,
        interviews: 0,
        responses: 0,
        wellnessScore: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const animateStats = (targetStats) => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        totalApplications: Math.floor(targetStats.totalApplications * progress),
        interviews: Math.floor(targetStats.interviews * progress),
        responses: Math.floor(targetStats.responses * progress),
        wellnessScore: Math.floor(targetStats.wellnessScore * progress * 10) / 10
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, stepDuration);
  };

  const generateUpcomingTasks = (jobs) => {
    const tasks = [];
    
    // Add follow-up tasks for applied jobs
    jobs.filter(job => job.status === 'applied').forEach(job => {
      const daysSinceApplied = Math.floor((Date.now() - new Date(job.appliedAt || job.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceApplied >= 7) {
        tasks.push({
          id: `followup-${job._id}`,
          task: `Follow up with ${job.company} recruiter`,
          due: 'Today',
          priority: 'high',
          type: 'followup',
          jobId: job._id
        });
      }
    });

    // Add interview prep tasks
    jobs.filter(job => job.status === 'interview').forEach(job => {
      tasks.push({
        id: `prep-${job._id}`,
        task: `Prepare for ${job.company} interview`,
        due: 'Tomorrow',
        priority: 'high',
        type: 'interview',
        jobId: job._id
      });
    });

    // Add general tasks
    if (jobs.length > 0) {
      tasks.push({
        id: 'resume-update',
        task: 'Update resume with latest experience',
        due: 'This week',
        priority: 'medium',
        type: 'resume'
      });
    }

    setUpcomingTasks(tasks.slice(0, 5));
  };

  const generateRecommendations = (jobs) => {
    const recs = [];
    
    if (jobs.length === 0) {
      recs.push({
        type: 'start',
        title: 'Start Your Job Search',
        message: 'Add your first job application to begin tracking your progress',
        action: 'Add Job',
        color: 'primary'
      });
    } else {
      const appliedJobs = jobs.filter(job => job.status === 'applied');
      if (appliedJobs.length > 5) {
        recs.push({
          type: 'followup',
          title: 'Follow Up Needed',
          message: `You have ${appliedJobs.length} applications without responses. Consider following up.`,
          action: 'View Applications',
          color: 'yellow'
        });
      }

      const interviewJobs = jobs.filter(job => job.status === 'interview');
      if (interviewJobs.length > 0) {
        recs.push({
          type: 'interview',
          title: 'Interview Preparation',
          message: `Practice for your upcoming interviews with our AI coach.`,
          action: 'Start Practice',
          color: 'success'
        });
      }
    }

    setRecommendations(recs);
  };

  const handleJobAdded = (newJob) => {
    // Refresh dashboard data
    fetchDashboardData();
    toast.success(`Added ${newJob.title} at ${newJob.company}`);
  };





  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.profile?.firstName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's your job search progress and AI insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Applications</p>
                <motion.p 
                  className="text-2xl font-bold"
                  key={stats.totalApplications}
                  initial={{ scale: 1.2, color: '#6366f1' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {stats.totalApplications}
                </motion.p>
                {stats.totalApplications > 0 && (
                  <div className="flex items-center text-xs text-success-500 mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    Active applications
                  </div>
                )}
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Briefcase className="h-8 w-8 text-primary-500 group-hover:scale-110 transition-transform" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Interviews</p>
                <motion.p 
                  className="text-2xl font-bold"
                  key={stats.interviews}
                  initial={{ scale: 1.2, color: '#22c55e' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {stats.interviews}
                </motion.p>
                {stats.interviews > 0 && (
                  <div className="flex items-center text-xs text-success-500 mt-1">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Scheduled interviews
                  </div>
                )}
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <MessageCircle className="h-8 w-8 text-success-500 group-hover:scale-110 transition-transform" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Responses</p>
                <motion.p 
                  className="text-2xl font-bold"
                  key={stats.responses}
                  initial={{ scale: 1.2, color: '#3b82f6' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {stats.responses}
                </motion.p>
                <div className="flex items-center text-xs text-blue-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.totalApplications > 0 ? Math.round((stats.responses / stats.totalApplications) * 100) : 0}% rate
                </div>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="glass p-6 rounded-2xl cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Wellness Score</p>
                <motion.p 
                  className="text-2xl font-bold"
                  key={stats.wellnessScore}
                  initial={{ scale: 1.2, color: '#ef4444' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {stats.wellnessScore}/10
                </motion.p>
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <Heart className="h-3 w-3 mr-1" />
                  {stats.wellnessScore >= 7 ? 'Good balance' : 
                   stats.wellnessScore >= 5 ? 'Fair balance' : 
                   stats.wellnessScore > 0 ? 'Needs attention' : 'No data'}
                </div>
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <button 
                onClick={() => setIsAddJobModalOpen(true)}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg animate-pulse">
                    <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
                    </div>
                    <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {recentJobs.map((activity, index) => (
                    <motion.div 
                      key={activity.id || activity._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <motion.div 
                        className={`p-2 rounded-lg ${
                          (activity.status || activity.type) === 'applied' || activity.type === 'application' ? 'bg-primary-500/20 text-primary-500' :
                          (activity.status || activity.type) === 'interview' ? 'bg-success-500/20 text-success-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {((activity.status || activity.type) === 'applied' || activity.type === 'application') && <Briefcase className="h-4 w-4" />}
                        {(activity.status || activity.type) === 'interview' && <MessageCircle className="h-4 w-4" />}
                        {((activity.status || activity.type) === 'offer' || activity.type === 'response') && <TrendingUp className="h-4 w-4" />}
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.company}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{activity.title || activity.role}</p>
                      </div>
                      <div className="text-sm text-slate-500">
                        {activity.time || new Date(activity.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                  
                  {recentJobs.length === 0 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        No job applications yet
                      </p>
                      <button 
                        onClick={() => setIsAddJobModalOpen(true)}
                        className="btn-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Job
                      </button>
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">Upcoming Tasks</h2>
            
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <motion.div 
                  key={task.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm">{task.task}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.due}
                    </div>
                    {task.type && (
                      <div className="flex items-center text-xs text-slate-400">
                        {task.type === 'followup' && <Bell className="h-3 w-3 mr-1" />}
                        {task.type === 'interview' && <MessageCircle className="h-3 w-3 mr-1" />}
                        {task.type === 'resume' && <Target className="h-3 w-3 mr-1" />}
                        {task.type}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {upcomingTasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    All caught up! 🎉
                  </p>
                </motion.div>
              )}
            </div>

            <button className="w-full mt-4 btn-secondary">
              View All Tasks
            </button>
          </motion.div>
        </div>

        {/* AI Insights & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 glass p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">AI Insights & Recommendations</h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-primary-500" />
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.length > 0 ? recommendations.map((rec, index) => (
              <motion.div 
                key={rec.type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border cursor-pointer ${
                  rec.color === 'primary' ? 'bg-primary-500/10 border-primary-500/20' :
                  rec.color === 'success' ? 'bg-success-500/10 border-success-500/20' :
                  rec.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-medium ${
                    rec.color === 'primary' ? 'text-primary-500' :
                    rec.color === 'success' ? 'text-success-500' :
                    rec.color === 'yellow' ? 'text-yellow-600' :
                    'text-blue-500'
                  }`}>
                    {rec.title}
                  </h3>
                  {rec.type === 'resume' && <Target className="h-4 w-4 text-primary-500" />}
                  {rec.type === 'interview' && <MessageCircle className="h-4 w-4 text-success-500" />}
                  {rec.type === 'followup' && <Bell className="h-4 w-4 text-yellow-500" />}
                  {rec.type === 'start' && <Plus className="h-4 w-4 text-primary-500" />}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {rec.message}
                </p>
                <button className={`text-sm font-medium ${
                  rec.color === 'primary' ? 'text-primary-500 hover:text-primary-600' :
                  rec.color === 'success' ? 'text-success-500 hover:text-success-600' :
                  rec.color === 'yellow' ? 'text-yellow-600 hover:text-yellow-700' :
                  'text-blue-500 hover:text-blue-600'
                } transition-colors`}>
                  {rec.action} →
                </button>
              </motion.div>
            )) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 text-center py-8"
              >
                <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  AI recommendations will appear here based on your job search activity
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Add Job Modal */}
        <AddJobModal
          isOpen={isAddJobModalOpen}
          onClose={() => setIsAddJobModalOpen(false)}
          onJobAdded={(newJob) => {
            // You can update the recent activity here if needed
            console.log('New job added:', newJob);
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;