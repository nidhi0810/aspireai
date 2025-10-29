import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              AspireAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
                <Link to="/resume" className="hover:text-primary-500 transition-colors">
                  Resume
                </Link>
                <Link to="/jobs" className="hover:text-primary-500 transition-colors">
                  Jobs
                </Link>
                <Link to="/wellness" className="hover:text-primary-500 transition-colors">
                  Wellness
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user.profile?.firstName}</span>
                  </div>
                  
                  <Link to="/settings" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Settings className="h-5 w-5" />
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-red-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            {user ? (
              <div className="flex flex-col space-y-4">
                <Link to="/dashboard" className="hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
                <Link to="/resume" className="hover:text-primary-500 transition-colors">
                  Resume
                </Link>
                <Link to="/jobs" className="hover:text-primary-500 transition-colors">
                  Jobs
                </Link>
                <Link to="/wellness" className="hover:text-primary-500 transition-colors">
                  Wellness
                </Link>
                <Link to="/settings" className="hover:text-primary-500 transition-colors">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link to="/login" className="hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-center">
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;