import React from 'react';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page texture-bg">
      <Navbar />
      <div className="container not-found-container scroll-reveal visible">
        <div className="not-found-card glass fade-in">
          <div className="not-found-icon-wrap">
            <Search size={64} className="not-found-icon" />
          </div>
          <h1>Heritage Path Not Found</h1>
          <p>
            The grain you are looking for has either been moved to another warehouse 
            or isn't currently in our inventory.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn-primary-heritage">
              <Home size={18} /> Return Home
            </Link>
            <Link to="/products" className="btn-secondary-heritage">
              <Search size={18} /> Search Products
            </Link>
          </div>
          <div className="heritage-footer-hint">
            <HelpCircle size={14} /> Need assistance? <strong>Contact our Trade Officer at +91 9170707767</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
