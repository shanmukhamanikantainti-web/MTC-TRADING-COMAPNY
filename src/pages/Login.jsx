import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login = () => {
  const { identifyUser, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate heritage identification
    setTimeout(() => {
      identifyUser(formData.name, formData.phone);
      setLoading(false);
      navigate('/profile');
    }, 800);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page texture-bg">
      <Navbar />

      <div className="auth-container-premium fade-in">
        <div className="auth-card-glass">
          {/* Form Side */}
          <div className="auth-form-side">
            <div className="auth-header">
              <span className="auth-subtitle">Quality Trading Since Generations</span>
              <h1 className="auth-title">Identify Your Heritage Account</h1>
              <p className="auth-desc">
                Enter your Name and Phone Number to access your order history and personalized global trading dashboard.
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
                <label><Phone size={16} /> Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Enter your mobile number" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>

              <button type="submit" className="auth-submit-btn-circular" disabled={loading}>
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>{t('common.submit')}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>MTC HERITAGE TRADING</span>
            </div>
            
            <p className="auth-footer-text">
              By entering, you agree to our <strong>Heritage Privacy Terms</strong>.
            </p>
          </div>

          {/* Info Side (Desktop only) */}
          <div className="auth-info-side">
            <div className="info-overlay-refined">
              <div className="info-content-refined">
                <ShieldCheck size={48} className="info-icon" />
                <h2>MTC Authenticity</h2>
                <ul className="info-points">
                  <li>Track orders worldwide seamlessly</li>
                  <li>Access personalized bulk discount quotes</li>
                  <li>Direct connection to heritage sourcing</li>
                </ul>
                <div className="info-footer-badges">
                  <span>Export Certified</span>
                  <span>Pure Grains</span>
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
