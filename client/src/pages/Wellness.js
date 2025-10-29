import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Calendar, MessageCircle, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

const Wellness = () => {
  const [todayMood, setTodayMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(5);
  const [productivityLevel, setProductivityLevel] = useState(7);
  const [notes, setNotes] = useState('');
  const [weeklyData, setWeeklyData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Sad' },
    { value: 2, emoji: '😔', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Happy' },
    { value: 6, emoji: '😄', label: 'Very Happy' }
  ];

  const tips = [
    "Take a 10-minute walk between job applications to clear your mind",
    "Practice the 4-7-8 breathing technique when feeling overwhelmed",
    "Set small, achievable daily goals to maintain momentum",
    "Connect with other job seekers for mutual support",
    "Celebrate small wins, like completing an application or getting a response"
  ];

  // Load wellness data on component mount
  useEffect(() => {
    loadWellnessData();
  }, []);

  const loadWellnessData = async () => {
    try {
      setIsLoading(true);
      
      // Load today's data
      const todayResponse = await api.get('/api/wellness/today');
      if (todayResponse.data.data) {
        const todayData = todayResponse.data.data;
        setTodayMood(todayData.mood);
        setStressLevel(todayData.stressLevel);
        setProductivityLevel(todayData.productivityLevel);
        setNotes(todayData.notes || '');
      }

      // Load weekly data
      const weeklyResponse = await api.get('/api/wellness/weekly');
      setWeeklyData(weeklyResponse.data.data || []);

      // Load insights
      const insightsResponse = await api.get('/api/wellness/insights');
      setInsights(insightsResponse.data);

      // Load goals
      const goalsResponse = await api.get('/api/wellness/goals');
      setGoals(goalsResponse.data.data || []);

    } catch (error) {
      console.error('Error loading wellness data:', error);
      toast.error('Failed to load wellness data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCheckIn = async () => {
    if (!todayMood) {
      toast.error('Please select your mood first');
      return;
    }

    try {
      setIsSaving(true);
      
      await api.post('/api/wellness/log', {
        mood: todayMood,
        stressLevel,
        productivityLevel,
        notes
      });

      toast.success('Daily check-in saved successfully!');
      
      // Reload data to get updated insights
      loadWellnessData();
    } catch (error) {
      console.error('Error saving wellness data:', error);
      toast.error('Failed to save wellness data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Wellness & Work-Life Balance</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your mental health and get AI-powered wellness insights during your job search
          </p>
          {isLoading && (
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
              Loading your wellness data...
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Check-in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">Daily Check-in</h2>
            
            {/* Mood Tracker */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">How are you feeling today?</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setTodayMood(mood.value)}
                    className={`p-4 rounded-lg text-center transition-all ${
                      todayMood === mood.value
                        ? 'bg-primary-500/20 border-2 border-primary-500 scale-105'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Stress Level (1-10)</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">High</span>
                <span className="text-lg font-semibold w-8 text-center">{stressLevel}</span>
              </div>
            </div>

            {/* Productivity Level */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Productivity Level (1-10)</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={productivityLevel}
                  onChange={(e) => setProductivityLevel(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">High</span>
                <span className="text-lg font-semibold w-8 text-center">{productivityLevel}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Daily Notes (Optional)</h3>
              <textarea
                placeholder="How was your job search today? Any challenges or wins?"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field resize-none"
              />
            </div>

            <button 
              onClick={handleSaveCheckIn}
              disabled={isSaving || !todayMood}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Today\'s Check-in'}
            </button>
          </motion.div>

          {/* AI Wellness Coach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">AI Wellness Coach</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <div className="flex items-center mb-2">
                  <MessageCircle className="h-4 w-4 text-primary-500 mr-2" />
                  <span className="text-sm font-medium text-primary-500">Daily Tip</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {insights?.recommendations?.[0] || tips[Math.floor(Math.random() * tips.length)]}
                </p>
              </div>

              <div className="p-4 bg-success-500/10 rounded-lg border border-success-500/20">
                <div className="flex items-center mb-2">
                  <Heart className="h-4 w-4 text-success-500 mr-2" />
                  <span className="text-sm font-medium text-success-500">Motivation</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {insights?.trends?.mood === 'improving' 
                    ? "Great progress! Your mood is trending upward. Keep up the positive habits! 🌟"
                    : "Every rejection brings you one step closer to the right opportunity. Keep going! 💪"
                  }
                </p>
              </div>
            </div>

            <button className="w-full btn-secondary mb-4">
              Chat with AI Coach
            </button>

            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Available 24/7 for support and guidance
              </p>
            </div>
          </motion.div>
        </div>

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass p-6 rounded-2xl"
        >
          <h2 className="text-xl font-semibold mb-6">Weekly Overview</h2>
          
          <div className="grid md:grid-cols-7 gap-4">
            {isLoading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg text-center animate-pulse">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              weeklyData.map((day, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg text-center">
                  <h3 className="font-medium mb-3">{day.day}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Mood</p>
                      <p className="text-lg">
                        {day.mood ? moodEmojis[day.mood - 1]?.emoji : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Stress</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                        <div
                          className="bg-red-500 h-1 rounded-full transition-all"
                          style={{ width: day.stress ? `${(day.stress / 10) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Productivity</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                        <div
                          className="bg-success-500 h-1 rounded-full transition-all"
                          style={{ width: day.productivity ? `${(day.productivity / 10) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Insights & Goals */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">AI Insights</h2>
            
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 animate-pulse">
                    <div className="h-5 w-5 bg-slate-300 dark:bg-slate-600 rounded mt-1"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                      <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    </div>
                  </div>
                ))
              ) : insights ? (
                <>
                  {insights.trends?.mood === 'improving' && (
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-success-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-success-500">Positive Trend</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Your mood is trending upward! Keep up the great work.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {insights.averages?.stress > 7 && (
                    <div className="flex items-start space-x-3">
                      <Heart className="h-5 w-5 text-red-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-red-500">Stress Alert</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Your average stress level is {insights.averages.stress.toFixed(1)}/10. Consider taking more breaks.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {insights.trends?.productivity === 'improving' && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-blue-500">Productivity Boost</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Your productivity is trending upward. Great momentum!
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {insights.recommendations?.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <MessageCircle className="h-5 w-5 text-primary-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-primary-500">AI Recommendation</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    Start tracking your wellness to get personalized insights!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Wellness Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">Wellness Goals</h2>
            
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
                      <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-12"></div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-slate-300 dark:bg-slate-600 h-2 rounded-full w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : goals.length > 0 ? (
                goals.map((goal, index) => {
                  const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                  const getProgressColor = () => {
                    if (progress >= 80) return 'bg-success-500';
                    if (progress >= 50) return 'bg-yellow-500';
                    return 'bg-red-500';
                  };
                  const getTextColor = () => {
                    if (progress >= 80) return 'text-success-500';
                    if (progress >= 50) return 'text-yellow-600';
                    return 'text-red-500';
                  };

                  return (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{goal.name}</h3>
                        <span className={`text-sm ${getTextColor()}`}>
                          {goal.current}/{goal.target} {goal.type === 'weekly' ? 'this week' : 'today'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor()}`} 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    No wellness goals set yet
                  </p>
                  <button className="btn-primary text-sm">
                    Create Your First Goal
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowGoalsModal(true)}
              className="w-full mt-4 btn-secondary"
            >
              <Target className="h-4 w-4 mr-2" />
              Set New Goals
            </button>
          </motion.div>
        </div>

        {/* Goals Modal */}
        {showGoalsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Set Wellness Goals</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Goals help you stay motivated and track your progress. You can update them anytime.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-medium mb-2">Default Goals Available:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Daily Meditation (7 days/week)</li>
                    <li>• Exercise 3x/week</li>
                    <li>• 8 hours sleep (7 nights/week)</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const defaultGoals = [
                        { name: 'Daily Meditation', target: 7, current: 0, type: 'weekly', category: 'meditation' },
                        { name: 'Exercise 3x/week', target: 3, current: 0, type: 'weekly', category: 'exercise' },
                        { name: '8 hours sleep', target: 7, current: 0, type: 'weekly', category: 'sleep' }
                      ];
                      
                      await api.post('/api/wellness/goals', { goals: defaultGoals });
                      toast.success('Goals set successfully!');
                      setShowGoalsModal(false);
                      loadWellnessData();
                    } catch (error) {
                      toast.error('Failed to set goals');
                    }
                  }}
                  className="flex-1 btn-primary"
                >
                  Set Goals
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wellness;