import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Edit, Zap, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

const Resume = () => {

  
  // Resume form data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    }],
    education: [{
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: ''
    }],
    skills: {
      technical: [''],
      soft: ['']
    },
    projects: [{
      name: '',
      description: '',
      technologies: [''],
      url: ''
    }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      url: ''
    }],
    customFields: []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Helper functions for managing form data
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ['']
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: ''
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [''],
        url: ''
      }]
    }));
  };

  const updateProject = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: '',
        issuer: '',
        date: '',
        url: ''
      }]
    }));
  };

  const updateCertification = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const updateSkills = (type, value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [type]: skillsArray }
    }));
  };

  const addCustomField = () => {
    setResumeData(prev => ({
      ...prev,
      customFields: [...prev.customFields, {
        id: Date.now(),
        title: '',
        type: 'text', // text, list, date
        content: ''
      }]
    }));
  };

  const updateCustomField = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      customFields: prev.customFields.map(customField => 
        customField.id === id ? { ...customField, [field]: value } : customField
      )
    }));
  };

  const removeCustomField = (id) => {
    setResumeData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== id)
    }));
  };

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      const response = await api.post('/api/resume/create', {
        name: `Resume - ${new Date().toLocaleDateString()}`,
        content: resumeData
      });
      
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewResume = () => {
    if (!resumeData.personalInfo.firstName && !resumeData.personalInfo.lastName) {
      toast.error('Please fill in at least your name to preview the resume');
      return;
    }
    setShowPreviewModal(true);
  };

  const handleDownloadPDF = async () => {
    if (!resumeData.personalInfo.firstName && !resumeData.personalInfo.lastName) {
      toast.error('Please fill in at least your name to download the resume');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Create a temporary element with the resume content
      const resumeElement = document.createElement('div');
      resumeElement.innerHTML = generateResumeHTML();
      resumeElement.style.cssText = `
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        line-height: 1.6;
        color: #333;
      `;

      // Use browser's print functionality to generate PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume - ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 5px 20px; 
              line-height: 1.6; 
              color: #333;
            }
            .header { text-align: center; margin-bottom: 15px; margin-top: 0; }
            .header h1 { margin-bottom: 8px; margin-top: 0; font-size: 24px; }
            .header div { font-size: 14px; color: #666; line-height: 1.4; }
            .section { margin-bottom: 20px; }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              border-bottom: 1px solid #333; 
              padding-bottom: 3px; 
              margin-bottom: 12px; 
            }
            .experience-item, .education-item, .project-item, .cert-item { 
              margin-bottom: 15px; 
            }
            .item-title { font-weight: bold; }
            .item-subtitle { color: #666; font-size: 14px; }
            .item-date { float: right; color: #666; font-size: 14px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${generateResumeHTML()}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      toast.success('PDF generation started! Check your downloads folder.');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateResumeHTML = () => {
    return `
      <div class="header">
        <h1 style="margin-bottom: 8px;">${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</h1>
        <div style="font-size: 14px; color: #666; line-height: 1.4;">
          ${[
            resumeData.personalInfo.email,
            resumeData.personalInfo.phone,
            resumeData.personalInfo.location
          ].filter(Boolean).join(' | ')}
          ${(resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) ? 
            `<br>${[resumeData.personalInfo.linkedin, resumeData.personalInfo.portfolio].filter(Boolean).join(' | ')}` : ''}
        </div>
      </div>

      ${resumeData.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${resumeData.summary}</p>
        </div>
      ` : ''}

      ${resumeData.experience.some(exp => exp.title || exp.company) ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${resumeData.experience.map(exp => (exp.title || exp.company) ? `
            <div class="experience-item">
              <div class="item-title">${exp.title}</div>
              <div class="item-subtitle">
                ${exp.company} ${exp.location ? `• ${exp.location}` : ''}
                <span class="item-date">
                  ${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - 
                  ${exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                </span>
              </div>
              ${exp.description[0] ? `<div>${exp.description[0].split('\n').map(line => `<p>${line}</p>`).join('')}</div>` : ''}
            </div>
          ` : '').join('')}
        </div>
      ` : ''}

      ${resumeData.education.some(edu => edu.degree || edu.institution) ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${resumeData.education.map(edu => (edu.degree || edu.institution) ? `
            <div class="education-item">
              <div class="item-title">${edu.degree}</div>
              <div class="item-subtitle">
                ${edu.institution} ${edu.location ? `• ${edu.location}` : ''}
                ${edu.graduationDate ? `<span class="item-date">${new Date(edu.graduationDate).getFullYear()}</span>` : ''}
              </div>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          ` : '').join('')}
        </div>
      ` : ''}

      ${(resumeData.skills.technical.some(s => s) || resumeData.skills.soft.some(s => s)) ? `
        <div class="section">
          <div class="section-title">Skills</div>
          ${resumeData.skills.technical.some(s => s) ? `
            <p><strong>Technical:</strong> ${resumeData.skills.technical.filter(s => s).join(', ')}</p>
          ` : ''}
          ${resumeData.skills.soft.some(s => s) ? `
            <p><strong>Soft Skills:</strong> ${resumeData.skills.soft.filter(s => s).join(', ')}</p>
          ` : ''}
        </div>
      ` : ''}

      ${resumeData.projects.some(proj => proj.name) ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${resumeData.projects.map(project => project.name ? `
            <div class="project-item">
              <div class="item-title">${project.name}</div>
              ${project.description ? `<p>${project.description}</p>` : ''}
              ${project.technologies.some(t => t) ? `
                <p><strong>Technologies:</strong> ${project.technologies.filter(t => t).join(', ')}</p>
              ` : ''}
            </div>
          ` : '').join('')}
        </div>
      ` : ''}

      ${resumeData.certifications.some(cert => cert.name) ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${resumeData.certifications.map(cert => cert.name ? `
            <div class="cert-item">
              <div class="item-title">${cert.name}</div>
              <div class="item-subtitle">
                ${cert.issuer} ${cert.date ? `• ${new Date(cert.date).getFullYear()}` : ''}
              </div>
            </div>
          ` : '').join('')}
        </div>
      ` : ''}

      ${resumeData.customFields.some(field => field.title && field.content) ? 
        resumeData.customFields.map(field => field.title && field.content ? `
          <div class="section">
            <div class="section-title">${field.title}</div>
            ${field.type === 'list' ? 
              `<p>${field.content.split(',').map(item => item.trim()).join(', ')}</p>` :
              field.type === 'date' ?
              `<p>${new Date(field.content).toLocaleDateString()}</p>` :
              `<p>${field.content}</p>`
            }
          </div>
        ` : '').join('') : ''}
    `;
  };

  const generateSummaryWithAI = async () => {
    try {
      const userInfo = {
        name: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`,
        experience: resumeData.experience.filter(exp => exp.title && exp.company),
        skills: [...resumeData.skills.technical, ...resumeData.skills.soft].filter(skill => skill),
        education: resumeData.education.filter(edu => edu.degree && edu.institution)
      };

      if (!userInfo.name.trim() || userInfo.experience.length === 0) {
        toast.error('Please fill in your name and at least one work experience to generate AI summary');
        return;
      }

      const response = await api.post('/api/ai/generate-summary', {
        userProfile: userInfo
      });

      if (response.data.summary) {
        updateSummary(response.data.summary);
        toast.success('AI summary generated successfully!');
      }
    } catch (error) {
      // Fallback to a simple generated summary if API fails
      const fallbackSummary = generateFallbackSummary();
      updateSummary(fallbackSummary);
      toast.success('Summary generated successfully!');
    }
  };

  const generateFallbackSummary = () => {
    const name = resumeData.personalInfo.firstName;
    const experiences = resumeData.experience.filter(exp => exp.title && exp.company);
    const skills = [...resumeData.skills.technical, ...resumeData.skills.soft].filter(skill => skill);
    
    if (experiences.length === 0) return '';
    
    const latestJob = experiences[0];
    const yearsExp = experiences.length > 1 ? `${experiences.length}+` : '1+';
    const topSkills = skills.slice(0, 3).join(', ');
    
    return `Experienced ${latestJob.title} with ${yearsExp} years of professional experience at ${latestJob.company}. Skilled in ${topSkills} with a proven track record of delivering high-quality solutions and driving business results. Passionate about leveraging technology to solve complex problems and contribute to team success.`;
  };



  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create ATS-optimized resumes tailored for each job application
          </p>
        </motion.div>

        {/* Resume Builder - Single Tab */}

        <div className="grid lg:grid-cols-2 gap-8">
            {/* Resume Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-2xl"
            >
              <h2 className="text-xl font-semibold mb-6">Build Your Resume</h2>
              
              <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-4">
                {/* Personal Information */}
                <div>
                  <h3 className="font-medium mb-4 text-primary-500">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={resumeData.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={resumeData.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="mt-4 space-y-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Location (City, State)"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn Profile URL"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="url"
                      placeholder="Portfolio/Website URL"
                      value={resumeData.personalInfo.portfolio}
                      onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h3 className="font-medium mb-4 text-primary-500">Professional Summary</h3>
                  <textarea
                    placeholder="Write a compelling 2-3 sentence summary of your experience and skills..."
                    rows={4}
                    value={resumeData.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    className="input-field resize-none"
                  />
                  <button 
                    type="button" 
                    onClick={generateSummaryWithAI}
                    className="mt-2 text-sm text-primary-500 hover:text-primary-600 inline-flex items-center"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Generate with AI
                  </button>
                </div>

                {/* Work Experience */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-primary-500">Work Experience</h3>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="btn-secondary text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Experience
                    </button>
                  </div>
                  
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-6 p-4 bg-white/5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Experience {index + 1}</h4>
                        {resumeData.experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            className="input-field"
                          />
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => updateExperience(index, 'location', e.target.value)}
                          className="input-field"
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            className="input-field"
                          />
                          <div className="space-y-2">
                            <input
                              type="date"
                              placeholder="End Date"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                              className="input-field"
                              disabled={exp.current}
                            />
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              Currently working here
                            </label>
                          </div>
                        </div>
                        
                        <textarea
                          placeholder="Describe your responsibilities and achievements (use bullet points)..."
                          rows={4}
                          value={exp.description[0] || ''}
                          onChange={(e) => updateExperience(index, 'description', [e.target.value])}
                          className="input-field resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-primary-500">Education</h3>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="btn-secondary text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Education
                    </button>
                  </div>
                  
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-6 p-4 bg-white/5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Education {index + 1}</h4>
                        {resumeData.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Institution Name"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          className="input-field"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => updateEducation(index, 'location', e.target.value)}
                            className="input-field"
                          />
                          <input
                            type="date"
                            placeholder="Graduation Date"
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-medium mb-4 text-primary-500">Skills</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Technical Skills</label>
                      <input
                        type="text"
                        placeholder="JavaScript, Python, React, Node.js, SQL, AWS..."
                        value={resumeData.skills.technical.join(', ')}
                        onChange={(e) => updateSkills('technical', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Soft Skills</label>
                      <input
                        type="text"
                        placeholder="Leadership, Communication, Problem Solving, Teamwork..."
                        value={resumeData.skills.soft.join(', ')}
                        onChange={(e) => updateSkills('soft', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-primary-500">Projects</h3>
                    <button
                      type="button"
                      onClick={addProject}
                      className="btn-secondary text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Project
                    </button>
                  </div>
                  
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="mb-6 p-4 bg-white/5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Project {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={project.name}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                          className="input-field"
                        />
                        <textarea
                          placeholder="Project description and your role..."
                          rows={3}
                          value={project.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                          className="input-field resize-none"
                        />
                        <input
                          type="text"
                          placeholder="Technologies used (comma-separated)"
                          value={project.technologies.join(', ')}
                          onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                          className="input-field"
                        />
                        <input
                          type="url"
                          placeholder="Project URL (optional)"
                          value={project.url}
                          onChange={(e) => updateProject(index, 'url', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-primary-500">Certifications</h3>
                    <button
                      type="button"
                      onClick={addCertification}
                      className="btn-secondary text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Certification
                    </button>
                  </div>
                  
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="mb-6 p-4 bg-white/5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Certification {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Certification Name"
                          value={cert.name}
                          onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          className="input-field"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Issuing Organization"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                            className="input-field"
                          />
                          <input
                            type="date"
                            placeholder="Date Obtained"
                            value={cert.date}
                            onChange={(e) => updateCertification(index, 'date', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <input
                          type="url"
                          placeholder="Certification URL (optional)"
                          value={cert.url}
                          onChange={(e) => updateCertification(index, 'url', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Fields */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-primary-500">Custom Fields</h3>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="btn-secondary text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Custom Field
                    </button>
                  </div>
                  
                  {resumeData.customFields.map((field) => (
                    <div key={field.id} className="mb-6 p-4 bg-white/5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Custom Field</h4>
                        <button
                          type="button"
                          onClick={() => removeCustomField(field.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Field Title (e.g., Languages, Volunteer Work, Awards)"
                          value={field.title}
                          onChange={(e) => updateCustomField(field.id, 'title', e.target.value)}
                          className="input-field"
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            value={field.type}
                            onChange={(e) => updateCustomField(field.id, 'type', e.target.value)}
                            className="input-field"
                          >
                            <option value="text">Text</option>
                            <option value="list">List (comma-separated)</option>
                            <option value="date">Date</option>
                          </select>
                          
                          {field.type === 'date' ? (
                            <input
                              type="date"
                              value={field.content}
                              onChange={(e) => updateCustomField(field.id, 'content', e.target.value)}
                              className="input-field"
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder={
                                field.type === 'list' 
                                  ? "Item 1, Item 2, Item 3..." 
                                  : "Enter content..."
                              }
                              value={field.content}
                              onChange={(e) => updateCustomField(field.id, 'content', e.target.value)}
                              className="input-field"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {resumeData.customFields.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Add custom fields like Languages, Awards, or Volunteer Work</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleSaveResume}
                    disabled={isSaving}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Resume'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePreviewResume}
                    className="btn-secondary"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Preview Resume
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="btn-secondary disabled:opacity-50"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Resume Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Resume Preview</h2>
              </div>

              <div className="bg-white text-black p-8 rounded-lg shadow-lg min-h-[600px] max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold mb-1">
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                  </h1>
                  <div className="text-sm text-gray-500">
                    {resumeData.personalInfo.email && (
                      <span>{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.email && (resumeData.personalInfo.phone || resumeData.personalInfo.location) && (
                      <span> | </span>
                    )}
                    {[resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(' | ')}
                    {(resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) && (
                      <>
                        <br />
                        {[resumeData.personalInfo.linkedin, resumeData.personalInfo.portfolio].filter(Boolean).join(' | ')}
                      </>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {resumeData.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                      Professional Summary
                    </h2>
                    <p className="text-sm text-gray-700">
                      {resumeData.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {resumeData.experience.some(exp => exp.title || exp.company) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                      Work Experience
                    </h2>
                    {resumeData.experience.map((exp, index) => (
                      (exp.title || exp.company) && (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium">{exp.title}</h3>
                            <span className="text-sm text-gray-500">
                              {exp.startDate && new Date(exp.startDate).getFullYear()} - {
                                exp.current ? 'Present' : 
                                exp.endDate ? new Date(exp.endDate).getFullYear() : ''
                              }
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {exp.company} {exp.location && `• ${exp.location}`}
                          </p>
                          {exp.description[0] && (
                            <div className="text-sm text-gray-700">
                              {exp.description[0].split('\n').map((line, i) => (
                                <p key={i} className="mb-1">{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Education */}
                {resumeData.education.some(edu => edu.degree || edu.institution) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                      Education
                    </h2>
                    {resumeData.education.map((edu, index) => (
                      (edu.degree || edu.institution) && (
                        <div key={index} className="mb-3">
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-gray-600">
                            {edu.institution} {edu.location && `• ${edu.location}`}
                          </p>
                          {edu.graduationDate && (
                            <p className="text-sm text-gray-500">
                              Graduated: {new Date(edu.graduationDate).getFullYear()}
                            </p>
                          )}
                          {edu.gpa && (
                            <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Skills */}
                {(resumeData.skills.technical.some(s => s) || resumeData.skills.soft.some(s => s)) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                      Skills
                    </h2>
                    {resumeData.skills.technical.some(s => s) && (
                      <div className="mb-2">
                        <span className="font-medium text-sm">Technical: </span>
                        <span className="text-sm text-gray-700">
                          {resumeData.skills.technical.filter(s => s).join(', ')}
                        </span>
                      </div>
                    )}
                    {resumeData.skills.soft.some(s => s) && (
                      <div>
                        <span className="font-medium text-sm">Soft Skills: </span>
                        <span className="text-sm text-gray-700">
                          {resumeData.skills.soft.filter(s => s).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Projects */}
                {resumeData.projects.some(proj => proj.name) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                      Projects
                    </h2>
                    {resumeData.projects.map((project, index) => (
                      project.name && (
                        <div key={index} className="mb-3">
                          <h3 className="font-medium">{project.name}</h3>
                          {project.description && (
                            <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                          )}
                          {project.technologies.some(t => t) && (
                            <p className="text-sm text-gray-600">
                              Technologies: {project.technologies.filter(t => t).join(', ')}
                            </p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.some(cert => cert.name) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                      Certifications
                    </h2>
                    {resumeData.certifications.map((cert, index) => (
                      cert.name && (
                        <div key={index} className="mb-2">
                          <h3 className="font-medium text-sm">{cert.name}</h3>
                          <p className="text-sm text-gray-600">
                            {cert.issuer} {cert.date && `• ${new Date(cert.date).getFullYear()}`}
                          </p>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Custom Fields */}
                {resumeData.customFields.some(field => field.title && field.content) && (
                  <div className="mb-6">
                    {resumeData.customFields.map((field) => (
                      field.title && field.content && (
                        <div key={field.id} className="mb-4">
                          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                            {field.title}
                          </h2>
                          {field.type === 'list' ? (
                            <div className="text-sm text-gray-700">
                              {field.content.split(',').map((item, index) => (
                                <span key={index}>
                                  {item.trim()}
                                  {index < field.content.split(',').length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          ) : field.type === 'date' ? (
                            <p className="text-sm text-gray-700">
                              {new Date(field.content).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-700">{field.content}</p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!resumeData.personalInfo.firstName && !resumeData.personalInfo.lastName && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Fill out the form to see your resume preview
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>




        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Resume Preview</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="bg-white text-black p-8 rounded-lg shadow-lg">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </h1>
                    <div className="text-sm text-gray-500 mt-2 space-y-1">
                      {resumeData.personalInfo.email && (
                        <p>{resumeData.personalInfo.email}</p>
                      )}
                      <p>
                        {[resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(' | ')}
                      </p>
                      {(resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) && (
                        <p>
                          {[resumeData.personalInfo.linkedin, resumeData.personalInfo.portfolio].filter(Boolean).join(' | ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  {resumeData.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                        Professional Summary
                      </h2>
                      <p className="text-sm text-gray-700">
                        {resumeData.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.some(exp => exp.title || exp.company) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                        Work Experience
                      </h2>
                      {resumeData.experience.map((exp, index) => (
                        (exp.title || exp.company) && (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{exp.title}</h3>
                              <span className="text-sm text-gray-500">
                                {exp.startDate && new Date(exp.startDate).getFullYear()} - {
                                  exp.current ? 'Present' : 
                                  exp.endDate ? new Date(exp.endDate).getFullYear() : ''
                                }
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {exp.company} {exp.location && `• ${exp.location}`}
                            </p>
                            {exp.description[0] && (
                              <div className="text-sm text-gray-700">
                                {exp.description[0].split('\n').map((line, i) => (
                                  <p key={i} className="mb-1">{line}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.some(edu => edu.degree || edu.institution) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                        Education
                      </h2>
                      {resumeData.education.map((edu, index) => (
                        (edu.degree || edu.institution) && (
                          <div key={index} className="mb-3">
                            <h3 className="font-medium">{edu.degree}</h3>
                            <p className="text-sm text-gray-600">
                              {edu.institution} {edu.location && `• ${edu.location}`}
                            </p>
                            {edu.graduationDate && (
                              <p className="text-sm text-gray-500">
                                Graduated: {new Date(edu.graduationDate).getFullYear()}
                              </p>
                            )}
                            {edu.gpa && (
                              <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {(resumeData.skills.technical.some(s => s) || resumeData.skills.soft.some(s => s)) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                        Skills
                      </h2>
                      {resumeData.skills.technical.some(s => s) && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Technical: </span>
                          <span className="text-sm text-gray-700">
                            {resumeData.skills.technical.filter(s => s).join(', ')}
                          </span>
                        </div>
                      )}
                      {resumeData.skills.soft.some(s => s) && (
                        <div>
                          <span className="font-medium text-sm">Soft Skills: </span>
                          <span className="text-sm text-gray-700">
                            {resumeData.skills.soft.filter(s => s).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.some(proj => proj.name) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                        Projects
                      </h2>
                      {resumeData.projects.map((project, index) => (
                        project.name && (
                          <div key={index} className="mb-3">
                            <h3 className="font-medium">{project.name}</h3>
                            {project.description && (
                              <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                            )}
                            {project.technologies.some(t => t) && (
                              <p className="text-sm text-gray-600">
                                Technologies: {project.technologies.filter(t => t).join(', ')}
                              </p>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {resumeData.certifications.some(cert => cert.name) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                        Certifications
                      </h2>
                      {resumeData.certifications.map((cert, index) => (
                        cert.name && (
                          <div key={index} className="mb-2">
                            <h3 className="font-medium text-sm">{cert.name}</h3>
                            <p className="text-sm text-gray-600">
                              {cert.issuer} {cert.date && `• ${new Date(cert.date).getFullYear()}`}
                            </p>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Custom Fields */}
                  {resumeData.customFields.some(field => field.title && field.content) && (
                    <>
                      {resumeData.customFields.map((field) => (
                        field.title && field.content && (
                          <div key={field.id} className="mb-6">
                            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                              {field.title}
                            </h2>
                            {field.type === 'list' ? (
                              <div className="text-sm text-gray-700">
                                {field.content.split(',').map((item, index) => (
                                  <span key={index}>
                                    {item.trim()}
                                    {index < field.content.split(',').length - 1 && ', '}
                                  </span>
                                ))}
                              </div>
                            ) : field.type === 'date' ? (
                              <p className="text-sm text-gray-700">
                                {new Date(field.content).toLocaleDateString()}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-700">{field.content}</p>
                            )}
                          </div>
                        )
                      ))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;