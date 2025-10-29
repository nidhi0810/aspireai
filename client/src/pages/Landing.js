import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  Target,
  MessageCircle,
  TrendingUp,
  Heart,
  ArrowRight,
  Users,
  Briefcase,
  Award,
  CheckCircle,
  Play,
  Star
} from 'lucide-react';

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentJobTitle, setCurrentJobTitle] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    jobsApplied: 0,
    successRate: 0,
    avgSalaryIncrease: 0
  });

  // Animate stats on page load
  useEffect(() => {
    const targetStats = {
      users: 12500,
      jobsApplied: 45000,
      successRate: 87,
      avgSalaryIncrease: 23
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        users: Math.floor(targetStats.users * progress),
        jobsApplied: Math.floor(targetStats.jobsApplied * progress),
        successRate: Math.floor(targetStats.successRate * progress),
        avgSalaryIncrease: Math.floor(targetStats.avgSalaryIncrease * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Rotate job titles
  useEffect(() => {
    const jobTitles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'];
    const interval = setInterval(() => {
      setCurrentJobTitle((prev) => (prev + 1) % jobTitles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "AspireAI helped me land my dream job at Google! The AI resume optimization increased my interview rate by 300%.",
      avatar: "👩‍💻",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager at Microsoft",
      content: "The interview coaching feature was incredible. I felt so prepared and confident during my Microsoft interview.",
      avatar: "👨‍💼",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Data Scientist at Netflix",
      content: "From 50+ rejections to multiple offers! AspireAI's job matching algorithm is a game-changer.",
      avatar: "👩‍🔬",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Auto Job Application",
      description: "Apply to multiple job portals automatically with AI-powered matching"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "ATS-Optimized Resumes",
      description: "Tailor your resume for each job with AI to pass applicant tracking systems"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "AI Interview Coach",
      description: "Practice interviews with voice AI and get real-time feedback"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and get personalized learning recommendations"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Wellness Tracking",
      description: "Monitor your job search wellness with AI-powered insights"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-primary-500 to-success-500 bg-clip-text text-transparent">
                Job Hunting Companion
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-3xl mx-auto">
              Transform your job search with AI. Get personalized resumes, practice interviews,
              and land your dream job faster than ever before.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-8"
            >
              <p className="text-lg text-slate-500 dark:text-slate-400">
                Perfect for{' '}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentJobTitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-primary-500 font-semibold"
                  >
                    {['Software Engineers', 'Data Scientists', 'Product Managers', 'UX Designers', 'DevOps Engineers'][currentJobTitle]}
                  </motion.span>
                </AnimatePresence>
                {' '}and more!
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
              <Link
                to="/login"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-300 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-success-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 right-20 w-16 h-16 bg-yellow-500/20 rounded-full blur-lg"
        />
        <motion.div
          animate={{ 
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-1/3 left-20 w-12 h-12 bg-blue-500/20 rounded-full blur-lg"
        />
      </section>

      {/* Dynamic Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500/10 to-success-500/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Join thousands who have transformed their careers with AspireAI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="glass p-6 rounded-2xl">
                <Users className="h-8 w-8 text-primary-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary-500 mb-2">
                  {stats.users.toLocaleString()}+
                </div>
                <p className="text-slate-600 dark:text-slate-400">Active Users</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="glass p-6 rounded-2xl">
                <Briefcase className="h-8 w-8 text-success-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-success-500 mb-2">
                  {stats.jobsApplied.toLocaleString()}+
                </div>
                <p className="text-slate-600 dark:text-slate-400">Jobs Applied</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="glass p-6 rounded-2xl">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {stats.successRate}%
                </div>
                <p className="text-slate-600 dark:text-slate-400">Success Rate</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="glass p-6 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {stats.avgSalaryIncrease}%
                </div>
                <p className="text-slate-600 dark:text-slate-400">Avg Salary Increase</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="block text-primary-500">Land Your Dream Job</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our AI-powered platform handles every aspect of your job search,
              from application to interview preparation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                className="glass p-6 rounded-2xl cursor-pointer group"
              >
                <motion.div 
                  className="text-primary-500 mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                  className="h-1 bg-gradient-to-r from-primary-500 to-success-500 rounded-full mt-4"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-primary-500/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Real people, real results with AspireAI
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="glass p-8 rounded-3xl text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl font-medium mb-6 text-slate-700 dark:text-slate-300">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-4xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial 
                      ? 'bg-primary-500' 
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass p-12 rounded-3xl"
          >
            <Brain className="h-16 w-16 text-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Join thousands of job seekers who have already found success with AspireAI.
            </p>
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-success-500 to-success-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-success-600 to-success-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
              <span className="relative flex items-center">
                Start Your Journey Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;