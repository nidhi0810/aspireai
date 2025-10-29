const pdfParse = require('pdf-parse');

class ATSAnalyzer {
  constructor() {
    // Common ATS-friendly keywords by category
    this.keywordCategories = {
      technical: [
        'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
        'kubernetes', 'git', 'api', 'database', 'html', 'css', 'mongodb', 'postgresql',
        'machine learning', 'ai', 'data analysis', 'cloud computing', 'devops'
      ],
      soft: [
        'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
        'creative', 'adaptable', 'organized', 'detail-oriented', 'collaborative'
      ],
      action: [
        'developed', 'implemented', 'managed', 'led', 'created', 'designed', 'optimized',
        'improved', 'increased', 'reduced', 'achieved', 'delivered', 'coordinated'
      ],
      business: [
        'agile', 'scrum', 'project management', 'stakeholder', 'requirements',
        'strategy', 'process improvement', 'cost reduction', 'revenue growth'
      ]
    };

    // ATS-unfriendly elements
    this.atsUnfriendly = {
      headers: ['header', 'footer', 'textbox', 'image'],
      formatting: ['tables', 'columns', 'graphics', 'special characters'],
      fonts: ['fancy fonts', 'decorative elements']
    };
  }

  async analyzePDF(pdfBuffer, jobDescription = '') {
    try {
      // Extract text from PDF
      const pdfData = await pdfParse(pdfBuffer);
      const resumeText = pdfData.text.toLowerCase();
      
      // Perform comprehensive analysis
      const analysis = {
        // Basic metrics
        wordCount: resumeText.split(/\s+/).length,
        pageCount: pdfData.numpages,
        
        // Core scoring components
        formatScore: this.calculateFormatScore(resumeText, pdfData),
        keywordScore: this.calculateKeywordScore(resumeText, jobDescription),
        structureScore: this.calculateStructureScore(resumeText),
        contentScore: this.calculateContentScore(resumeText),
        
        // Detailed analysis
        foundKeywords: this.findKeywords(resumeText),
        missingKeywords: this.findMissingKeywords(resumeText, jobDescription),
        actionVerbs: this.findActionVerbs(resumeText),
        quantifiedAchievements: this.findQuantifiedAchievements(resumeText),
        
        // Issues and recommendations
        issues: this.findIssues(resumeText),
        recommendations: this.generateRecommendations(resumeText, jobDescription),
        strengths: this.findStrengths(resumeText)
      };

      // Calculate overall ATS score
      analysis.atsScore = this.calculateOverallScore(analysis);
      
      return analysis;
    } catch (error) {
      throw new Error(`PDF analysis failed: ${error.message}`);
    }
  }

  calculateFormatScore(text, pdfData) {
    let score = 100;
    
    // Penalize for potential formatting issues
    if (text.includes('�') || text.includes('□')) score -= 20; // Encoding issues
    if (pdfData.numpages > 2) score -= 10; // Too long
    if (text.length < 500) score -= 30; // Too short
    if (text.split(/\s+/).length < 200) score -= 20; // Too few words
    
    // Check for proper sections
    const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
    const foundSections = sections.filter(section => text.includes(section));
    if (foundSections.length < 3) score -= 15;
    
    return Math.max(score, 0);
  }

  calculateKeywordScore(resumeText, jobDescription) {
    if (!jobDescription) return 70; // Default score without job description
    
    const jobKeywords = this.extractKeywords(jobDescription.toLowerCase());
    const resumeKeywords = this.extractKeywords(resumeText);
    
    if (jobKeywords.length === 0) return 70;
    
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(resumeKeyword => 
        resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword)
      )
    );
    
    const matchPercentage = (matchedKeywords.length / jobKeywords.length) * 100;
    return Math.min(matchPercentage, 100);
  }

  calculateStructureScore(text) {
    let score = 100;
    
    // Check for proper resume structure
    const requiredSections = [
      { name: 'contact', keywords: ['email', 'phone', '@'] },
      { name: 'experience', keywords: ['experience', 'work', 'employment'] },
      { name: 'education', keywords: ['education', 'degree', 'university', 'college'] },
      { name: 'skills', keywords: ['skills', 'technical', 'proficient'] }
    ];
    
    requiredSections.forEach(section => {
      const hasSection = section.keywords.some(keyword => text.includes(keyword));
      if (!hasSection) score -= 20;
    });
    
    // Check for chronological order indicators
    const datePattern = /\d{4}|\d{1,2}\/\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/g;
    const dates = text.match(datePattern);
    if (!dates || dates.length < 2) score -= 10;
    
    return Math.max(score, 0);
  }

  calculateContentScore(text) {
    let score = 70; // Base score
    
    // Bonus for action verbs
    const actionVerbCount = this.findActionVerbs(text).length;
    score += Math.min(actionVerbCount * 2, 20);
    
    // Bonus for quantified achievements
    const quantifiedCount = this.findQuantifiedAchievements(text).length;
    score += Math.min(quantifiedCount * 3, 15);
    
    // Bonus for relevant keywords
    const keywordCount = this.findKeywords(text).length;
    score += Math.min(keywordCount, 15);
    
    return Math.min(score, 100);
  }

  findKeywords(text) {
    const allKeywords = [
      ...this.keywordCategories.technical,
      ...this.keywordCategories.soft,
      ...this.keywordCategories.business
    ];
    
    return allKeywords.filter(keyword => text.includes(keyword));
  }

  findMissingKeywords(resumeText, jobDescription) {
    if (!jobDescription) {
      // Return common missing keywords if no job description
      return ['project management', 'team collaboration', 'problem solving', 'analytical thinking'];
    }
    
    const jobKeywords = this.extractKeywords(jobDescription.toLowerCase());
    const resumeKeywords = this.extractKeywords(resumeText);
    
    return jobKeywords.filter(keyword => 
      !resumeKeywords.some(resumeKeyword => 
        resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword)
      )
    ).slice(0, 8); // Limit to top 8 missing keywords
  }

  findActionVerbs(text) {
    return this.keywordCategories.action.filter(verb => text.includes(verb));
  }

  findQuantifiedAchievements(text) {
    // Look for numbers followed by relevant terms
    const patterns = [
      /\d+%/g, // Percentages
      /\$\d+/g, // Dollar amounts
      /\d+\s*(million|thousand|k|m)/gi, // Large numbers
      /\d+\s*(years?|months?)/gi, // Time periods
      /\d+\s*(projects?|teams?|people|clients?|customers?)/gi // Quantities
    ];
    
    const achievements = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) achievements.push(...matches);
    });
    
    return achievements;
  }

  findIssues(text) {
    const issues = [];
    
    if (text.length < 800) issues.push('Resume appears too short');
    if (text.length > 4000) issues.push('Resume appears too long');
    if (!text.includes('@')) issues.push('Missing email address');
    if (!text.includes('phone') && !/\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text)) {
      issues.push('Missing phone number');
    }
    if (this.findActionVerbs(text).length < 3) {
      issues.push('Insufficient action verbs');
    }
    if (this.findQuantifiedAchievements(text).length < 2) {
      issues.push('Lack of quantified achievements');
    }
    
    return issues;
  }

  generateRecommendations(resumeText, jobDescription) {
    const recommendations = [];
    const issues = this.findIssues(resumeText);
    
    if (issues.includes('Insufficient action verbs')) {
      recommendations.push('Start bullet points with strong action verbs like "developed", "implemented", "managed"');
    }
    
    if (issues.includes('Lack of quantified achievements')) {
      recommendations.push('Add specific numbers and percentages to quantify your achievements');
    }
    
    if (this.findKeywords(resumeText).length < 10) {
      recommendations.push('Include more industry-relevant keywords and technical skills');
    }
    
    if (jobDescription && this.findMissingKeywords(resumeText, jobDescription).length > 5) {
      recommendations.push('Incorporate more keywords from the job description');
    }
    
    recommendations.push('Use consistent formatting and clear section headers');
    recommendations.push('Ensure your resume is saved as a simple PDF without complex formatting');
    
    return recommendations;
  }

  findStrengths(text) {
    const strengths = [];
    
    if (this.findActionVerbs(text).length >= 5) {
      strengths.push('Good use of action verbs');
    }
    
    if (this.findQuantifiedAchievements(text).length >= 3) {
      strengths.push('Well-quantified achievements');
    }
    
    if (this.findKeywords(text).length >= 10) {
      strengths.push('Rich in relevant keywords');
    }
    
    if (text.includes('education') && text.includes('experience')) {
      strengths.push('Complete resume structure');
    }
    
    return strengths;
  }

  extractKeywords(text) {
    // Simple keyword extraction - in production, use more sophisticated NLP
    const words = text.split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !/^\d+$/.test(word)) // Remove pure numbers
      .map(word => word.replace(/[^\w]/g, '').toLowerCase())
      .filter(word => word.length > 0);
    
    // Remove duplicates and common stop words
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'her', 'now', 'air', 'any', 'may', 'say', 'she', 'use', 'way', 'who', 'oil', 'sit', 'set'];
    
    return [...new Set(words)].filter(word => !stopWords.includes(word));
  }

  calculateOverallScore(analysis) {
    // Weighted average of different components
    const weights = {
      format: 0.25,
      keyword: 0.30,
      structure: 0.25,
      content: 0.20
    };
    
    const weightedScore = 
      (analysis.formatScore * weights.format) +
      (analysis.keywordScore * weights.keyword) +
      (analysis.structureScore * weights.structure) +
      (analysis.contentScore * weights.content);
    
    return Math.round(weightedScore);
  }
}

module.exports = ATSAnalyzer;