import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Leaf, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { getProductImage } from '../services/imageMap';
import './Home.css';

// Local fallbacks if DB is empty
import tamarindImg from '../assets/tamarind.png';
import chilliImg from '../assets/chillies.png';
import cowpeasImg from '../assets/cowpeas.png';
import horsegramImg from '../assets/horse_gram.png';
import logoImg from '../assets/logo.png';

const Home = () => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Map database image strings to local imported assets
        const mappedData = data.map(p => ({
          ...p,
          image: getProductImage(p.image)
        }));
        setProducts(mappedData);
      } else {
        // Fallback to static if no DB data
        setProducts([
          { id: 1, name: 'Seedless Tamarind (Premium)', price: 180, category: 'Selected', image: tamarindImg, rating: 5, isB2B: false },
          { id: 2, name: 'Teja S17 Dried Red Chillies', price: 320, category: 'Selected', image: chilliImg, rating: 5, isB2B: false },
          { id: 3, name: 'Cowpeas (Grade A) Bulk', price: 8500, category: 'Warehouse', image: cowpeasImg, rating: 5, isB2B: true },
          { id: 4, name: 'Horse Gram (Natural)', price: 75, category: 'Selected', image: horsegramImg, rating: 4, isB2B: false }
        ]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading]);

  return (
    <div className="home-page texture-bg">
      <Navbar />
      <Hero />
      
      {/* Category Section */}
      <section className="categories-section section-padding">
        <div className="container">
          <div className="section-header scroll-reveal">
            <span className="subtitle">Heritage Grains & Spices</span>
            <h2 className="title">Select Your Specialty</h2>
          </div>
          
          <div className="category-grid">
            <div className="category-card scroll-reveal">
              <img src={tamarindImg} alt="Tamarind" />
              <div className="category-info">
                <h3>Tamarind</h3>
                <p>Pure, tangy, selected pods from the heartlands of India.</p>
                <button>View Collection <ArrowRight size={14} /></button>
              </div>
            </div>
            <div className="category-card scroll-reveal">
              <img src={chilliImg} alt="Chillies" />
              <div className="category-info">
                <h3>Red Chillies</h3>
                <p>Fiery, vibrant, sun-dried chillies with intense aroma.</p>
                <button>View Collection <ArrowRight size={14} /></button>
              </div>
            </div>
            <div className="category-card scroll-reveal">
              <img src={cowpeasImg} alt="Pulses" />
              <div className="category-info">
                <h3>Pulses & Grains</h3>
                <p>Protein-rich Cowpeas and Horse Gram for healthy living.</p>
                <button>View Collection <ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="section-header scroll-reveal">
            <span className="subtitle">Premium Quality</span>
            <h2 className="title">Our Signature Range</h2>
          </div>
          
          <div className="product-grid">
            {loading ? (
              <div className="loading-state-centered">
                <Loader2 className="animate-spin" size={40} />
                <p>Loading Signature Grains...</p>
              </div>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Heritage / Trust Section */}
      <section className="heritage-section section-padding glass scroll-reveal">
        <div className="hero-content scroll-reveal">
          <div className="hero-badge">{t('hero.title')}</div>
          <h1>{t('hero.subtitle')}</h1>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary-heritage">
              {t('hero.explore')} <ArrowRight size={20} />
            </Link>
            <Link to="/wholesale" className="btn-secondary-heritage">
              {t('hero.quote')}
            </Link>
          </div>
        </div>
        <div className="container heritage-grid">
          <div className="heritage-item">
            <Leaf className="heritage-icon" />
            <h3>100% Organic Path</h3>
            <p>From sustainable farms to your warehouse.</p>
          </div>
          <div className="heritage-item">
            <ShieldCheck className="heritage-icon" />
            <h3>Quality Certified</h3>
            <p>Rigorous multi-stage quality control checks.</p>
          </div>
          <div className="heritage-item">
            <Globe className="heritage-icon" />
            <h3>Global Export</h3>
            <p>Serving markets across Europe, Asia, and UAE.</p>
          </div>
        </div>
      </section>

      <footer className="main-footer-refined section-padding">
        <div className="container footer-grid-refined">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <img src={logoImg} alt="MTC Logo" className="footer-logo-img" />
              <h2 className="logo-text">MTC</h2>
            </div>
            <p>Providing premium trading solutions for over 25 years. Authenticity in every grain.</p>
          </div>
          <div className="footer-links-refined">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Our Heritage</a></li>
              <li><a href="#">Export Services</a></li>
              <li><a href="#">Wholesale Enquiry</a></li>
            </ul>
          </div>
          <div className="footer-links-refined">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Trade Policies</a></li>
              <li><a href="#">Quality Reports</a></li>
            <li><a href="#">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom-refined">
          <p>&copy; 2026 ManiKanta Trading Company. Heritage in Motion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
