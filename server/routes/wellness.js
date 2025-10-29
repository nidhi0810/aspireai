const express = require('express');
const auth = require('../middleware/auth');
const Wellness = require('../models/Wellness');

const router = express.Router();

// Log wellness data
router.post('/log', auth, async (req, res) => {
  try {
    const { mood, stressLevel, productivityLevel, notes } = req.body;
    const userId = req.userId;
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if entry already exists for today
    let wellnessEntry = await Wellness.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (wellnessEntry) {
      // Update existing entry
      wellnessEntry.mood = mood;
      wellnessEntry.stressLevel = stressLevel;
      wellnessEntry.productivityLevel = productivityLevel;
      wellnessEntry.notes = notes;
      await wellnessEntry.save();
    } else {
      // Create new entry
      wellnessEntry = new Wellness({
        userId,
        date: today,
        mood,
        stressLevel,
        productivityLevel,
        notes
      });
      await wellnessEntry.save();
    }
    
    res.json({
      message: 'Wellness data logged successfully',
      data: wellnessEntry
    });
  } catch (error) {
    console.error('Wellness log error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get today's wellness data
router.get('/today', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const wellnessEntry = await Wellness.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    res.json({ data: wellnessEntry });
  } catch (error) {
    console.error('Get today wellness error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get weekly wellness data
router.get('/weekly', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const weeklyData = await Wellness.getWeeklyData(userId);
    
    // Format data for frontend
    const formattedData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayData = weeklyData.find(entry => 
        entry.date.toDateString() === date.toDateString()
      );
      
      formattedData.push({
        day: days[date.getDay()],
        date: date.toISOString().split('T')[0],
        mood: dayData?.mood || null,
        stress: dayData?.stressLevel || null,
        productivity: dayData?.productivityLevel || null
      });
    }

    res.json({ data: formattedData });
  } catch (error) {
    console.error('Get weekly wellness error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wellness insights
router.get('/insights', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const insights = await Wellness.getInsights(userId);
    
    res.json(insights);
  } catch (error) {
    console.error('Get wellness insights error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Set wellness goals
router.post('/goals', auth, async (req, res) => {
  try {
    const { goals } = req.body;
    const userId = req.userId;
    
    // Get or create today's wellness entry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let wellnessEntry = await Wellness.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!wellnessEntry) {
      wellnessEntry = new Wellness({
        userId,
        date: today,
        mood: 3,
        stressLevel: 5,
        productivityLevel: 5,
        goals
      });
    } else {
      wellnessEntry.goals = goals;
    }
    
    await wellnessEntry.save();
    
    res.json({
      message: 'Goals updated successfully',
      data: wellnessEntry.goals
    });
  } catch (error) {
    console.error('Set wellness goals error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wellness goals
router.get('/goals', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get the most recent wellness entry with goals
    const wellnessEntry = await Wellness.findOne({
      userId,
      goals: { $exists: true, $ne: [] }
    }).sort({ date: -1 });

    const goals = wellnessEntry?.goals || [
      { name: 'Daily Meditation', target: 7, current: 0, type: 'weekly', category: 'meditation' },
      { name: 'Exercise 3x/week', target: 3, current: 0, type: 'weekly', category: 'exercise' },
      { name: '8 hours sleep', target: 7, current: 0, type: 'weekly', category: 'sleep' }
    ];

    res.json({ data: goals });
  } catch (error) {
    console.error('Get wellness goals error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;