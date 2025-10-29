import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, MapPin, DollarSign, Briefcase, ExternalLink } from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';

const AddJobModal = ({ isOpen, onClose, onJobAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    url: '',
    status: 'saved'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company) {
      toast.error('Please fill in job title and company');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        salary: {
          min: formData.salary.min ? parseInt(formData.salary.min) : null,
          max: formData.salary.max ? parseInt(formData.salary.max) : null,
          currency: formData.salary.currency
        }
      };

      const response = await api.post('/api/jobs/add', jobData);
      
      toast.success('Job added successfully!');
      onJobAdded(response.data);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salary: { min: '', max: '', currency: 'USD' },
        url: '',
        status: 'saved'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass p-6 rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold">Add New Job</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title & Company */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Title *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Senior Software Engineer"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Google"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Location & Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., San Francisco, CA or Remote"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Salary Range
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      name="salary.min"
                      value={formData.salary.min}
                      onChange={handleChange}
                      placeholder="Min"
                      className="input-field pl-10"
                    />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      name="salary.max"
                      value={formData.salary.max}
                      onChange={handleChange}
                      placeholder="Max"
                      className="input-field pl-10"
                    />
                  </div>
                  <select
                    name="salary.currency"
                    value={formData.salary.currency}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

              {/* Job URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job URL
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://company.com/careers/job-id"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the role and responsibilities..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Proficiency in React and Node.js"
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Job
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddJobModal;