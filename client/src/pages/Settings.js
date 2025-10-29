import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Globe, Shield, Palette, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const Settings = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    targetRole: user?.profile?.targetRole || '',
    experience: user?.profile?.experience || '',
    skills: user?.profile?.skills?.join(', ') || ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleSave = async () => {
    const result = await updateProfile({
      ...user.profile,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      location: formData.location,
      targetRole: formData.targetRole,
      experience: parseInt(formData.experience) || 0,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    });

    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.error);
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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account preferences and AI personalization
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-2xl h-fit"
          >
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-500'
                        : 'hover:bg-white/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 glass p-6 rounded-2xl"
          >
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="input-field opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="City, State/Country"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Role
                      </label>
                      <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                        placeholder="e.g., Software Engineer"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        min="0"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Skills (comma-separated)
                    </label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      placeholder="JavaScript, React, Node.js, Python..."
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>New job matches</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>Application status updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Weekly progress reports</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>Interview reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Daily wellness check-ins</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Follow-up reminders</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Language & Region</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Interface Language
                    </label>
                    <select className="input-field">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="hi">हिन्दी</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Resume/Cover Letter Language
                    </label>
                    <select className="input-field">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="hi">Hindi</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Time Zone
                    </label>
                    <select className="input-field">
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">GMT (UTC+0)</option>
                      <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-medium mb-4">Data Sharing</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Allow anonymous usage analytics</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Share data to improve AI recommendations</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-medium mb-4">Account Security</h3>
                    <div className="space-y-3">
                      <button className="btn-secondary">
                        Change Password
                      </button>
                      <button className="btn-secondary">
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h3 className="font-medium text-red-500 mb-4">Danger Zone</h3>
                    <div className="space-y-3">
                      <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors">
                        Export My Data
                      </button>
                      <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 bg-white border-2 border-primary-500 rounded-lg text-black">
                        <div className="w-full h-8 bg-slate-100 rounded mb-2"></div>
                        Light
                      </button>
                      <button className="p-4 bg-slate-800 border-2 border-transparent rounded-lg text-white">
                        <div className="w-full h-8 bg-slate-700 rounded mb-2"></div>
                        Dark
                      </button>
                      <button className="p-4 bg-gradient-to-br from-slate-100 to-slate-800 border-2 border-transparent rounded-lg">
                        <div className="w-full h-8 bg-gradient-to-r from-slate-200 to-slate-600 rounded mb-2"></div>
                        Auto
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Accent Color
                    </label>
                    <div className="flex space-x-3">
                      <button className="w-8 h-8 bg-indigo-500 rounded-full border-2 border-white"></button>
                      <button className="w-8 h-8 bg-blue-500 rounded-full"></button>
                      <button className="w-8 h-8 bg-green-500 rounded-full"></button>
                      <button className="w-8 h-8 bg-purple-500 rounded-full"></button>
                      <button className="w-8 h-8 bg-pink-500 rounded-full"></button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Font Size
                    </label>
                    <select className="input-field">
                      <option value="small">Small</option>
                      <option value="medium" selected>Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;