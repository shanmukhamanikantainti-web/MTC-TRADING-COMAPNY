import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, ArrowRight, Lock, Eye, EyeOff, Loader2, Landmark, LogIn, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import './Login.css';

const Login = () => {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '', // Strictly Email for Supabase
    password: '',
    confirmPassword: '',
    company: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error: signInError } = await signIn(formData.email, formData.password);
        if (signInError) throw signInError;
        // On success, redirect to profile
        navigate('/profile');
      } else {
        const metadata = { full_name: formData.name, company: formData.company };
        const { error: signUpError } = await signUp(formData.email, formData.password, metadata);
        if (signUpError) throw signUpError;
        // On success, redirect to profile
        navigate('/profile');
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setError(null); // Clear error on typing
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
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="auth-desc">
                {mode === 'login'
                  ? 'Sign in to access your heritage trading account.'
                  : 'Join our network of premium traders and global distributors.'}
              </p>
            </div>

            <form className="auth-form-refined" onSubmit={handleSubmit}>
              {error && (
                <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', border: '1px solid #ffcdd2', fontWeight: 500 }}>
                  {error}
                </div>
              )}

              {/* Name — shown in register mode only */}
              {mode === 'register' && (
                <div className="form-group-premium fade-in">
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
              )}

              {/* Email — shown in both modes */}
              <div className="form-group-premium">
                <label>
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. trader@mtc.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password — shown in both modes */}
              <div className="form-group-premium">
                <label><Lock size={16} /> Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password — register mode only */}
              {mode === 'register' && (
                <div className="form-group-premium fade-in">
                  <label><Lock size={16} /> Confirm Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Company — register mode only */}
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
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mode-toggle-hint">
              {mode === 'login' ? "New to the MTC network?" : "Already have an account?"}
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
                <h2>{mode === 'login' ? 'Heritage Trade\nPlatform' : 'Join the Legacy'}</h2>
                <p>Ensuring authenticity in every grain since generations. Your path to premium trading starts here.</p>
                <div className="auth-footer-badges">
                  {mode === 'login' ? <LogIn size={40} /> : <UserPlus size={40} />}
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
