const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate cover letter
router.post('/cover-letter', auth, async (req, res) => {
  try {
    const { jobDescription, companyName, userProfile } = req.body;

    const prompt = `Generate a professional cover letter for ${userProfile.firstName} ${userProfile.lastName} applying for a position at ${companyName}. 

User Profile:
- Experience: ${userProfile.experience} years
- Skills: ${userProfile.skills?.join(', ')}
- Target Role: ${userProfile.targetRole}

Job Description:
${jobDescription}

Make it personalized, professional, and highlight relevant skills. Keep it concise (3-4 paragraphs).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    res.json({
      coverLetter: completion.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
});

// Analyze skill gaps
router.post('/skill-gap', auth, async (req, res) => {
  try {
    const { jobDescription, userSkills } = req.body;

    const prompt = `Analyze the skill gap between the user's current skills and job requirements.

User Skills: ${userSkills.join(', ')}

Job Requirements:
${jobDescription}

Provide:
1. Missing skills (list)
2. Skill match percentage
3. Recommended free courses/resources for each missing skill
4. Priority level for each skill (High/Medium/Low)

Format as JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.3
    });

    res.json({
      analysis: completion.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
});

// Interview coaching
router.post('/interview', auth, async (req, res) => {
  try {
    const { question, userAnswer, jobRole } = req.body;

    const prompt = `As an interview coach, analyze this interview response for a ${jobRole} position.

Question: ${question}
Answer: ${userAnswer}

Provide feedback on:
1. Content quality (1-10)
2. Confidence level (1-10)
3. Specific improvements
4. Suggested better answer
5. Body language tips

Be constructive and encouraging.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.5
    });

    res.json({
      feedback: completion.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
});

// Salary prediction
router.post('/salary', auth, async (req, res) => {
  try {
    const { jobTitle, location, experience, skills } = req.body;

    const prompt = `Predict salary range for:
Job Title: ${jobTitle}
Location: ${location}
Experience: ${experience} years
Skills: ${skills.join(', ')}

Provide:
1. Salary range (min-max)
2. Market factors affecting salary
3. Negotiation tips
4. Confidence level of prediction

Use current market data and be realistic.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.4
    });

    res.json({
      prediction: completion.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
});

// Generate professional summary
router.post('/generate-summary', auth, async (req, res) => {
  try {
    const { userProfile } = req.body;

    if (!userProfile.name || !userProfile.experience || userProfile.experience.length === 0) {
      return res.status(400).json({ message: 'Name and work experience are required' });
    }

    const experienceText = userProfile.experience.map(exp => 
      `${exp.title} at ${exp.company}`
    ).join(', ');

    const skillsText = userProfile.skills.length > 0 ? userProfile.skills.join(', ') : 'various technologies';

    const prompt = `Generate a professional resume summary for ${userProfile.name}.

Work Experience: ${experienceText}
Skills: ${skillsText}
Education: ${userProfile.education.map(edu => `${edu.degree} from ${edu.institution}`).join(', ')}

Create a compelling 2-3 sentence professional summary that:
1. Highlights their experience and expertise
2. Mentions key skills and achievements
3. Shows their value proposition
4. Is ATS-friendly with relevant keywords
5. Sounds professional and engaging

Keep it concise and impactful.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    });

    res.json({
      summary: completion.choices[0].message.content.trim()
    });
  } catch (error) {
    console.error('AI Summary Generation Error:', error);
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
});

module.exports = router;