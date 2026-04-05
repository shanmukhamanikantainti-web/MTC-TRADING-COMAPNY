import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, User, Phone, ChevronRight, Loader2 } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './LanguageSelect.css';

const LanguageSelect = () => {
  const { setLanguage, identifyUser } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'te', label: 'తెలుగు', name: 'Telugu' },
    { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
    { code: 'ta', label: 'தமிழ்', name: 'Tamil' },
    { code: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada' },
    { code: 'ml', label: 'മലയാളം', name: 'Malayalam' },
  ];

  const handleLangSelect = (code) => {
    setSelectedLang(code);
    setStep(2);
  };

  const handleIdentify = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate identification logic
    setTimeout(() => {
      identifyUser(formData.name, formData.phone);
      setLanguage(selectedLang);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="language-guardian">
      <div className="guardian-content glass">
        <div className="guardian-header">
          <img src={logoImg} alt="MTC Logo" className="guardian-logo" />
          <h1>Manikanta Trading Company</h1>
          <p className="heritage-tag">Quality Trading Since Generations</p>
        </div>

        {step === 1 ? (
          <div className="step-container fade-in">
            <div className="step-title">
              <Globe size={24} />
              <h2>Choose Your Language</h2>
            </div>
            <div className="language-grid">
              {languages.map((lang) => (
                <button 
                  key={lang.code}
                  className="lang-card"
                  onClick={() => handleLangSelect(lang.code)}
                >
                  <span className="lang-label">{lang.label}</span>
                  <span className="lang-name">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="step-container fade-in">
            <div className="step-title">
              <User size={24} />
              <h2>Quick Identification</h2>
            </div>
            <p className="step-desc">Enter your details to track your heritage orders.</p>
            <form onSubmit={handleIdentify} className="id-form">
              <div className="input-group-guardian">
                <label>Full Name</label>
                <div className="input-icon-wrap">
                  <User size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Manikanta" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group-guardian">
                <label>Phone Number</label>
                <div className="input-icon-wrap">
                  <Phone size={18} />
                  <input 
                    type="tel" 
                    placeholder="Enter your mobile number" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="guardian-submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Enter Portal <ChevronRight size={18} /></>}
              </button>
              <button type="button" className="back-step" onClick={() => setStep(1)}>
                Change Language
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="guardian-footer">
        <p>© 2026 Manikanta Trading Company. All heritage rights reserved.</p>
      </div>
    </div>
  );
};

export default LanguageSelect;
