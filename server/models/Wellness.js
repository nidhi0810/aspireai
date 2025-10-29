const mongoose = require('mongoose');

const wellnessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  productivityLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  notes: {
    type: String,
    maxlength: 500
  },
  goals: [{
    name: {
      type: String,
      required: true
    },
    target: Number,
    current: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    category: {
      type: String,
      enum: ['exercise', 'meditation', 'sleep', 'social', 'learning', 'other'],
      default: 'other'
    }
  }],
  activities: [{
    name: String,
    duration: Number, // in minutes
    category: {
      type: String,
      enum: ['exercise', 'meditation', 'break', 'social', 'learning']
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying by user and date
wellnessSchema.index({ userId: 1, date: -1 });

// Ensure one entry per user per day
wellnessSchema.index({ userId: 1, date: 1 }, { 
  unique: true,
  partialFilterExpression: { 
    date: { $type: "date" } 
  }
});

// Static method to get weekly data for a user
wellnessSchema.statics.getWeeklyData = async function(userId, startDate = null) {
  const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const end = new Date();
  
  return this.find({
    userId,
    date: { $gte: start, $lte: end }
  }).sort({ date: 1 });
};

// Static method to get insights for a user
wellnessSchema.statics.getInsights = async function(userId) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const data = await this.find({
    userId,
    date: { $gte: thirtyDaysAgo }
  }).sort({ date: 1 });

  if (data.length === 0) {
    return {
      averages: { mood: 0, stress: 0, productivity: 0 },
      trends: { mood: 'no-data', stress: 'no-data', productivity: 'no-data' },
      recommendations: ['Start tracking your wellness to get personalized insights!']
    };
  }

  // Calculate averages
  const averages = {
    mood: data.reduce((sum, entry) => sum + entry.mood, 0) / data.length,
    stress: data.reduce((sum, entry) => sum + entry.stressLevel, 0) / data.length,
    productivity: data.reduce((sum, entry) => sum + entry.productivityLevel, 0) / data.length
  };

  // Calculate trends (comparing first half vs second half of data)
  const midPoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midPoint);
  const secondHalf = data.slice(midPoint);

  const getTrend = (firstHalfAvg, secondHalfAvg) => {
    const diff = secondHalfAvg - firstHalfAvg;
    if (Math.abs(diff) < 0.3) return 'stable';
    return diff > 0 ? 'improving' : 'declining';
  };

  const trends = {
    mood: getTrend(
      firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length,
      secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length
    ),
    stress: getTrend(
      firstHalf.reduce((sum, entry) => sum + entry.stressLevel, 0) / firstHalf.length,
      secondHalf.reduce((sum, entry) => sum + entry.stressLevel, 0) / secondHalf.length
    ),
    productivity: getTrend(
      firstHalf.reduce((sum, entry) => sum + entry.productivityLevel, 0) / firstHalf.length,
      secondHalf.reduce((sum, entry) => sum + entry.productivityLevel, 0) / secondHalf.length
    )
  };

  // Generate recommendations based on data
  const recommendations = [];
  if (averages.stress > 7) {
    recommendations.push('Your stress levels are high. Consider taking regular breaks and practicing relaxation techniques.');
  }
  if (averages.mood < 3) {
    recommendations.push('Your mood has been low recently. Consider reaching out to friends or engaging in activities you enjoy.');
  }
  if (averages.productivity < 4) {
    recommendations.push('Try breaking tasks into smaller chunks and celebrating small wins to boost productivity.');
  }
  if (trends.mood === 'improving') {
    recommendations.push('Great job! Your mood is trending upward. Keep up the positive habits.');
  }

  return { averages, trends, recommendations };
};

module.exports = mongoose.model('Wellness', wellnessSchema);