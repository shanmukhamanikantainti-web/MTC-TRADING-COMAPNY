import React from 'react';
import { ChevronRight, ArrowDown } from 'lucide-react';
import './Hero.css';

import { useLanguage } from '../context/LanguageContext';

// Import newly generated ingredient assets
import tamarindImg from '../assets/tamarind.png';
import chilliImg from '../assets/chillies.png';
import cowpeasImg from '../assets/cowpeas.png';
import horsegramImg from '../assets/horse_gram.png';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="hero texture-bg">
      <div className="hero-overlay"></div>
      
      {/* Floating Ingredients */}
      <div className="floating-elements">
        <img src={tamarindImg} alt="" className="floating-img float tamarind" />
        <img src={chilliImg} alt="" className="floating-img float-delay chilli" />
        <img src={cowpeasImg} alt="" className="floating-img float cowpeas" />
        <img src={horsegramImg} alt="" className="floating-img float-delay horsegram" />
      </div>

      <div className="hero-content fade-in">
        <span className="hero-subtitle">Premium Agricultural Trading</span>
        <h1 className="hero-title">{t('hero.title')} <br /><span>{t('hero.subtitle')}</span></h1>
        <p className="hero-description">
          {t('hero.description')}
        </p>
        <div className="hero-btns">
          <button className="hero-btn-primary">
            {t('hero.explore')} <ChevronRight size={18} />
          </button>
          <button className="hero-btn-secondary">
            {t('hero.quote')}
          </button>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <span>Scroll to Explore</span>
        <ArrowDown size={16} />
      </div>

      <div className="hero-stats-glass fade-in">
        <div className="stat-card">
          <span className="stat-num">100%</span>
          <span className="stat-label">Organic Path</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">Bulk</span>
          <span className="stat-label">Stock Ready</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
