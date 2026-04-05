import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, ArrowRight, ShieldCheck, Loader2, Landmark, LogIn, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';
import './Login.css';

const Login = () => {
  const { identifyUser, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    identifier: '', // Email or Phone
    company: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate heritage identification
    setTimeout(() => {
      identifyUser(formData.name, formData.identifier);
      setLoading(false);
      navigate('/profile');
    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page texture-bg">
      <Navbar />

      <div className="auth-container-premium fade-in">
        <div className={`auth-card-neuromorphic scale-up ${mode === 'register' ? 'mode-register' : ''}`}>
          {/* Form Side */}
          <div className="auth-form-side">
            <div className="auth-header">
              <span className="auth-subtitle">MTC HERITAGE PORTAL</span>
              <h1 className="auth-title">
                {mode === 'login' ? 'Identify Your Account' : 'Create Account'}
              </h1>
              <p className="auth-desc">
                {mode === 'login' 
                  ? 'Access your history and personalized quotes seamlessly.' 
                  : 'Join our network of premium traders and global distributors.'}
              </p>
            </div>

            <form className="auth-form-refined" onSubmit={handleSubmit}>
              <div className="form-group-premium">
                <label><User size={16} /> Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="e.g. Manikanta" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group-premium">
                <label>
                  {formData.identifier.includes('@') ? <Mail size={16} /> : <Phone size={16} />}
                  Email or Phone Number
                </label>
                <input 
                  type="text" 
                  name="identifier"
                  placeholder="e.g. +91 9170707767 or trader@mtc.com" 
                  value={formData.identifier}
                  onChange={handleChange}
                  required 
                />
              </div>

              {mode === 'register' && (
                <div className="form-group-premium fade-in">
                  <label><Landmark size={16} /> Company Name (Optional)</label>
                  <input 
                    type="text" 
                    name="company"
                    placeholder="e.g. Global Exports Ltd" 
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              )}

              <button type="submit" className="auth-submit-btn-neuromorphic" disabled={loading}>
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Confirm Identity' : 'Create Account'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mode-toggle-hint">
              {mode === 'login' ? "New to the MTC network?" : "Already have a heritage ID?"}
              <button 
                className="mode-btn-inline" 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Join Now' : 'Sign In'}
              </button>
            </div>
          </div>

          {/* Info Side (Heritage Splash) */}
          <div className="auth-info-side">
            <div className="info-overlay-refined">
              <div className="info-content-refined">
                <img src={logoImg} alt="MTC Logo" className="auth-logo-panel" />
                <h2>{mode === 'login' ? 'Welcome Back' : 'Join the Legacy'}</h2>
                <p>Ensuring authenticity in every grain since generations. Your path to premium trading starts here.</p>
                <div className="auth-footer-badges">
                  {mode === 'login' ? <LogIn size={48} /> : <UserPlus size={48} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
