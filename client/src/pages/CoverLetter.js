import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const CoverLetter = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    tone: 'professional'
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.companyName) {
      toast.error('Please fill in job title and company name');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With my background in software development and passion for innovative technology solutions, I am excited about the opportunity to contribute to your team.

In my previous role as a Software Engineer, I have developed expertise in full-stack development, working with modern technologies including React, Node.js, and cloud platforms. I have successfully led projects that improved system performance by 40% and reduced deployment time by 60%. These experiences have prepared me well for the challenges and opportunities at ${formData.companyName}.

What particularly attracts me to ${formData.companyName} is your commitment to innovation and excellence in technology. I am impressed by your recent initiatives in AI and machine learning, and I would love to contribute my skills to help drive these projects forward.

I am confident that my technical skills, problem-solving abilities, and passion for continuous learning make me an ideal candidate for this position. I would welcome the opportunity to discuss how I can contribute to ${formData.companyName}'s continued success.

Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
[Your Name]`;

      setGeneratedLetter(mockLetter);
      setIsGenerating(false);
      toast.success('Cover letter generated successfully!');
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Cover letter copied to clipboard!');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">AI Cover Letter Generator</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create personalized cover letters that match job requirements and company culture
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">Job Details</h2>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  placeholder="e.g., Senior Software Engineer"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="e.g., Google"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Description (Optional)
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                  placeholder="Paste the job description here for better personalization..."
                  rows={6}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="input-field"
                >
                  <option value="professional">Professional</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="confident">Confident</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </form>

            {/* Tips */}
            <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="font-medium text-blue-500 mb-2">💡 Tips for Better Results</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Include the full job description for better personalization</li>
                <li>• Choose a tone that matches the company culture</li>
                <li>• Review and customize the generated letter before sending</li>
                <li>• Add specific examples from your experience</li>
              </ul>
            </div>
          </motion.div>

          {/* Generated Cover Letter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Generated Cover Letter</h2>
              {generatedLetter && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Download as PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {generatedLetter ? (
              <div className="bg-white text-black p-6 rounded-lg shadow-lg min-h-[500px]">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {generatedLetter}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Your generated cover letter will appear here
                  </p>
                </div>
              </div>
            )}

            {generatedLetter && (
              <div className="mt-6 p-4 bg-success-500/10 rounded-lg border border-success-500/20">
                <h3 className="font-medium text-success-500 mb-2">✅ AI Analysis</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Tone: Professional and engaging</li>
                  <li>• Length: Optimal (3-4 paragraphs)</li>
                  <li>• Keywords: Well-matched to job description</li>
                  <li>• Personalization: High relevance to company</li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Cover Letters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass p-6 rounded-2xl"
        >
          <h2 className="text-xl font-semibold mb-6">Recent Cover Letters</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { company: 'Google', role: 'Software Engineer', date: '2 days ago' },
              { company: 'Microsoft', role: 'Product Manager', date: '1 week ago' },
              { company: 'Apple', role: 'UX Designer', date: '2 weeks ago' }
            ].map((letter, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <h3 className="font-medium">{letter.company}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{letter.role}</p>
                <p className="text-xs text-slate-500 mt-2">{letter.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CoverLetter;