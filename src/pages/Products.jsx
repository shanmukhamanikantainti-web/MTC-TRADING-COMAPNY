import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { supabase } from '../services/supabase';
import { getProductImage } from '../services/imageMap';
import './Products.css';

// Local fallbacks
import tamarindImg from '../assets/tamarind.png';
import chilliImg from '../assets/chillies.png';
import cowpeasImg from '../assets/cowpeas.png';
import horsegramImg from '../assets/horse_gram.png';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Seedless Tamarind (Premium)', price: 180, category: 'tamarind', image: tamarindImg, rating: 5, isB2B: false, description: 'Hand-selected, stone-free tamarind pods from Nalgonda. Deep amber pulp with balanced sweet-sour flavour.' },
  { id: 2, name: 'Tamarind Block (Export Grade)', price: 140, category: 'tamarind', image: tamarindImg, rating: 4, isB2B: false, description: 'Premium block tamarind packed for international markets. Consistent flavour and moisture profile.' },
  { id: 3, name: 'Teja S17 Dried Red Chillies', price: 320, category: 'chillies', image: chilliImg, rating: 5, isB2B: false, description: 'Famous Teja variety with powerful heat (3–6% capsaicin). Bright red with natural oil content.' },
  { id: 4, name: 'Byadgi Chillies (Dark Red)', price: 280, category: 'chillies', image: chilliImg, rating: 5, isB2B: false, description: 'Low heat, high colour Byadgi variety. Preferred for colour extraction and premium dishes.' },
  { id: 5, name: 'Cowpeas (Grade A) Bulk', price: 8500, category: 'pulses', image: cowpeasImg, rating: 5, isB2B: true, description: 'High protein cowpeas sorted to Grade A standards. Suitable for domestic and export markets.' },
  { id: 6, name: 'Cowpeas (Grade B) Retail', price: 95, category: 'pulses', image: cowpeasImg, rating: 4, isB2B: false, description: 'Retail-packed cowpeas, clean and naturally dried. Perfect for daily cooking.' },
  { id: 7, name: 'Horse Gram (Natural)', price: 75, category: 'grains', image: horsegramImg, rating: 4, isB2B: false, description: 'Earthy, mineral-rich horse gram. Known for its high protein content and medicinal properties.' },
  { id: 8, name: 'Horse Gram Bulk (Quintal)', price: 6800, category: 'grains', image: horsegramImg, rating: 5, isB2B: true, description: 'Quintal-packed horse gram for dealers and distributors. Consistent quality, moisture-controlled.' },
];

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'tamarind', label: 'Tamarind' },
  { value: 'chillies', label: 'Red Chillies' },
  { value: 'pulses', label: 'Pulses' },
  { value: 'grains', label: 'Grains' },
];

const SORTS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      
      if (data && data.length > 0) {
        const mappedData = data.map(p => ({
          ...p,
          image: getProductImage(p.image)
        }));
        setAllProducts(mappedData);
      } else {
        setAllProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setAllProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
        { threshold: 0.1 }
      );
      document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [filtered, loading]);

  useEffect(() => {
    if (loading) return;

    let result = [...allProducts];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    setFiltered(result);
  }, [searchQuery, activeCategory, sortBy, allProducts, loading]);

  return (
    <div className="products-page texture-bg">
      <Navbar />

      {/* Page Header */}
      <section className="products-header">
        <div className="container">
          <span className="header-subtitle">Direct from Source</span>
          <h1 className="header-title">Our Product Range</h1>
          <p className="header-desc">
            Traceable, premium quality agricultural goods — sourced from certified farms across Telangana and Andhra Pradesh.
          </p>
        </div>
      </section>

      {/* Controls Bar */}
      <div className="products-controls-bar">
        <div className="container controls-inner">
          {/* Search */}
          <div className="search-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`pill ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="sort-wrap">
            <label>Sort:</label>
            <div className="select-wrap">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="products-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-state-centered">
              <Loader2 className="animate-spin" size={48} />
              <p>Fetching Heritage Selection...</p>
            </div>
          ) : (
            <>
              <div className="results-count scroll-reveal">
                <span>{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''} found
              </div>

              {filtered.length > 0 ? (
                <div className="product-grid">
                  {filtered.map(product => (
                    <div key={product.id} className="scroll-reveal">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🌿</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters.</p>
                  <button className="reset-btn" onClick={() => { setSearchQuery(''); setActiveCategory('all'); setSortBy('default'); }}>
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer-refined section-padding">
        <div className="container footer-grid-refined">
          <div className="footer-brand">
            <h2 className="logo-text">MTC</h2>
            <p>Providing premium trading solutions for over 25 years. Authenticity in every grain.</p>
          </div>
          <div className="footer-links-refined">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Our Heritage</a></li>
              <li><a href="#">Export Services</a></li>
              <li><a href="/wholesale">Wholesale Enquiry</a></li>
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

export default Products;
