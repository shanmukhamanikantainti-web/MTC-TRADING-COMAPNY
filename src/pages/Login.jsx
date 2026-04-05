import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase } from '../services/supabase';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'retail' // retail or dealer
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              role: formData.role,
            }
          }
        });
        if (error) throw error;
        alert('Registration successful! Please check your email for verification.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`auth-page texture-bg ${isLogin ? 'is-login' : 'is-register'}`}>
      <Navbar />

      <div className="auth-container-premium scroll-reveal visible">
        <div className="auth-card-glass">
          {/* Form Side */}
          <div className="auth-form-side">
            <div className="auth-header">
              <span className="auth-subtitle">Authentic Grains & Spices</span>
              <h1 className="auth-title">
                {isLogin ? 'Welcome Back' : 'Join Our Legacy'}
              </h1>
              <p className="auth-desc">
                {isLogin 
                  ? 'Access your MTC orders and personalized price quotes.' 
                  : 'Start your trading journey with the finest agricultural source.'}
              </p>
            </div>
            {error && <div className="auth-error-message">{error}</div>}

            <form className="auth-form-refined" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group-premium">
                  <label><User size={16} /> Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
              )}
              
              <div className="form-group-premium">
                <label><Mail size={16} /> Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group-premium">
                <label><Lock size={16} /> Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>

              {isLogin && (
                <div className="form-meta">
                  <label className="checkbox-wrap">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="auth-submit-btn-circular" disabled={loading}>
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="social-auth-btns">
              <button className="social-btn-premium"><Chrome size={20} /> Google</button>
              <button className="social-btn-premium"><Github size={20} /> GitHub</button>
            </div>
            
            <p className="auth-footer-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={toggleMode} className="toggle-auth-btn">
                {isLogin ? 'Sign up for free' : 'Sign in now'}
              </button>
            </p>
          </div>

          {/* Info Side (Desktop only) */}
          <div className="auth-info-side">
            <div className="info-overlay-refined">
              <div className="info-content-refined">
                <ShieldCheck size={48} className="info-icon" />
                <h2>Verified Trading Portal</h2>
                <ul className="info-points">
                  <li>Real-time bulk pricing updates</li>
                  <li>Track worldwide logistics seamlessly</li>
                  <li>Exclusive wholesale dealer dashboards</li>
                </ul>
                <div className="info-footer-badges">
                  <span>GST Registered</span>
                  <span>Export Certified</span>
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
