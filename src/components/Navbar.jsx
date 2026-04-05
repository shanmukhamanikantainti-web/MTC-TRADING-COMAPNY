import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logoImg} alt="MTC Logo" className="nav-logo-img" />
          <div className="logo-text-group">
            <span className="logo-text">MTC</span>
            <span className="logo-sub">Trading Co.</span>
          </div>
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <div className="nav-dropdown">
            <button className="dropdown-trigger">
              {t('nav.ingredients')} <ChevronDown size={14} />
            </button>
            <div className="dropdown-content">
              <Link to="/products?cat=tamarind">Tamarind</Link>
              <Link to="/products?cat=chillies">Red Chillies</Link>
              <Link to="/products?cat=pulses">Pulses & Grains</Link>
            </div>
          </div>
          <Link to="/wholesale" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.wholesale')}</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.heritage')}</Link>
        </div>

        <div className="nav-actions">
          <button className="nav-icon-btn"><Search size={20} title={t('common.search')} /></button>
          <Link to="/profile" className="nav-icon-btn"><User size={20} title={t('nav.profile')} /></Link>
          <Link to="/cart" className="nav-icon-btn cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
