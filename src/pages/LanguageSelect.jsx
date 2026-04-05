import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Loader2 } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './LanguageSelect.css';

const LanguageSelect = () => {
  const { setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'en', label: 'English', name: 'Global' },
    { code: 'te', label: 'తెలుగు', name: 'Telugu' },
    { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
    { code: 'ta', label: 'தமிழ்', name: 'Tamil' },
    { code: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada' },
    { code: 'ml', label: 'മലയാളം', name: 'Malayalam' },
  ];

  const handleLangSelect = (code) => {
    setLoading(true);
    // Tiny delay for visual feel
    setTimeout(() => {
      setLanguage(code);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="language-guardian">
      <div className="guardian-content glass">
        <div className="guardian-header">
          <img src={logoImg} alt="MTC Logo" className="guardian-logo" />
          <h1>Manikanta Trading Company</h1>
          <p className="heritage-tag">Quality Trading Since Generations</p>
        </div>

        <div className="step-container fade-in">
          <div className="step-title">
            <Globe size={24} />
            <h2>Choose Your Language</h2>
          </div>
          <p className="step-desc">Select your preferred language to enter the heritage portal.</p>
          
          <div className="language-grid">
            {languages.map((lang) => (
              <button 
                key={lang.code}
                className="lang-card"
                onClick={() => handleLangSelect(lang.code)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin opacity-50" size={24} />
                ) : (
                  <>
                    <span className="lang-label">{lang.label}</span>
                    <span className="lang-name">{lang.name}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="guardian-footer">
        <p>© 2026 Manikanta Trading Company. All heritage rights reserved.</p>
      </div>
    </div>
  );
};

export default LanguageSelect;
