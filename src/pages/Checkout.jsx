import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Truck, CreditCard, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, MapPin, User, Mail, Phone, Leaf, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../services/supabase';
import './Checkout.css';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        user_id: user?.id || null,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        pincode: formData.pincode,
        total_amount: cartTotal,
        items: cart, // JSONB column
        status: 'processing'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) throw error;
      
      const newOrderId = data[0]?.id || Math.floor(Math.random() * 1000000);
      setOrderNumber(`MTC-${newOrderId}`);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="checkout-page texture-bg">
        <Navbar />
        <div className="container success-container scroll-reveal visible">
          <div className="success-checkout-card glass">
            <div className="success-icon-bounce">
              <CheckCircle size={80} className="success-icon" />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Your heritage grains are being prepared for dispatch. Our quality team is performing final checks.</p>
            <div className="order-number-badge">Order #{orderNumber}</div>
            <Link to="/" className="home-btn-premium">
              Return Home <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page texture-bg">
      <Navbar />
      
      <div className="container checkout-container">
        {/* Progress Stepper */}
        <div className="checkout-stepper scroll-reveal visible">
          <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-num">1</div>
            <span>Shipping</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-num">2</div>
            <span>Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-num">3</div>
            <span>Review</span>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Main Form Area */}
          <div className="checkout-form-area scroll-reveal visible">
            {step === 1 && (
              <div className="form-card-premium glass">
                <h3><Truck size={24} /> Shipping Information</h3>
                <form className="checkout-form-refined" onSubmit={handleNext}>
                  <div className="form-row-premium">
                    <div className="form-group-premium">
                      <label><User size={16} /> Full Name</label>
                      <input 
                        type="text" 
                        name="full_name"
                        placeholder="Recipient's Name" 
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-row-premium">
                    <div className="form-group-premium">
                      <label><Mail size={16} /> Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Updates sent here" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="form-group-premium">
                      <label><Phone size={16} /> Contact Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder="For delivery coordination" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-group-premium">
                    <label><MapPin size={16} /> Delivery Address</label>
                    <textarea 
                      name="address"
                      placeholder="Street address, apartment, etc." 
                      rows="3" 
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="form-row-premium">
                    <div className="form-group-premium">
                      <label>City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="form-group-premium">
                      <label>Pincode</label>
                      <input 
                        type="text" 
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="next-btn-premium">
                    Continue to Payment <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="form-card-premium glass">
                <h3><CreditCard size={24} /> Secure Payment</h3>
                <div className="payment-options">
                  <div className="payment-method active">
                    <CreditCard size={20} />
                    <span>UPI / Cards / NetBanking</span>
                  </div>
                  <div className="payment-method disabled">
                    <span>Cash on Delivery (Wholesale Disabled)</span>
                  </div>
                </div>
                
                <div className="payment-notice glass">
                  <ShieldCheck size={24} />
                  <p>All transactions are secured with military-grade encryption and processed through certified domestic gateways.</p>
                </div>

                <div className="checkout-actions">
                  <button onClick={handleBack} className="back-btn-premium">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button onClick={handleNext} className="next-btn-premium">
                    Review Order <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-card-premium glass">
                <h3>Review Your Order</h3>
                <div className="review-summary">
                  <div className="review-item">
                    <h4>Shipping to:</h4>
                    <p>{formData.full_name}, {formData.address}, {formData.city} - {formData.pincode}</p>
                  </div>
                  <div className="review-item">
                    <h4>Payment:</h4>
                    <p>Standard Secure Checkout (UPI/Card)</p>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button onClick={handleBack} className="back-btn-premium" disabled={isProcessing}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    className={`place-order-btn ${isProcessing ? 'processing' : ''}`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Securely Pay & Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="checkout-sidebar scroll-reveal visible">
            <div className="summary-card-premium shadow-lg">
              <h4>Order Breakdown</h4>
              <div className="checkout-items-list">
                {cart.map(item => (
                  <div key={item.id} className="checkout-item-mini">
                    <div className="mini-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="mini-info">
                      <h5>{item.name}</h5>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="mini-price">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-line total">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
              
              <div className="guarantee-badge">
                <Leaf size={16} />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
