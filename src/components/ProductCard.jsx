import React, { useState } from 'react';
import { ShoppingCart, Eye, Star, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { name, price, category, image, rating, isB2B } = product;
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card lift-glow fade-in">
      <div className="product-badge-premium">
        {isB2B ? 'Warehouse' : 'Selected'}
      </div>
      <div className="product-image-container-refined">
        <img src={image} alt={name} className="product-image" />
        <div className="product-overlay-glass">
          <button className="overlay-btn-premium" onClick={handleAddToCart}>
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
          <button className="overlay-btn-premium"><Eye size={18} /></button>
        </div>
      </div>
      <div className="product-info-refined">
        <div className="product-meta">
          <span className="product-category-premium">{category}</span>
          <div className="product-rating-dots">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`rating-dot ${i < rating ? 'active' : ''}`} />
            ))}
          </div>
        </div>
        <h3 className="product-name-premium">{name}</h3>
        <div className="product-footer-refined">
          <div className="product-pricing">
            <span className="currency-symbol">₹</span>
            <span className="price-value">{price}</span>
            <span className="price-unit">{isB2B ? '/quintal' : '/kg'}</span>
          </div>
          <button 
            className={`add-btn-circular ${added ? 'added' : ''}`} 
            onClick={handleAddToCart}
          >
            {added ? <Check size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
