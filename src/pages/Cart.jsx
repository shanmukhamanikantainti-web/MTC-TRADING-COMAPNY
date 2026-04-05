import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page texture-bg">
        <Navbar />
        <div className="container empty-cart-container scroll-reveal visible">
          <div className="empty-cart-card glass">
            <ShoppingBag size={64} className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any heritage grains to your collection yet.</p>
            <Link to="/products" className="continue-btn-premium">
              Explore Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page texture-bg">
      <Navbar />
      
      <div className="container cart-main-grid">
        <div className="cart-items-section scroll-reveal visible">
          <h1 className="cart-title">Your Selection <span>({cartCount} items)</span></h1>
          
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-premium glass">
                <div className="item-img-wrap">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <span className="item-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <div className="item-price">₹{item.price} <span>/ {item.isB2B ? 'quintal' : 'kg'}</span></div>
                </div>

                <div className="item-quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="item-total">
                  ₹{item.price * item.quantity}
                </div>

                <button onClick={() => removeFromCart(item.id)} className="remove-btn-premium">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary-section scroll-reveal visible">
          <div className="summary-card-glass shadow-lg">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">Calculated at checkout</span>
            </div>
            <div className="summary-row divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
            
            <Link to="/checkout" className="checkout-btn-premium">
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
            
            <div className="trust-badges-mini">
              <span>GST Invoicing</span>
              <span>•</span>
              <span>Direct Sourcing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
