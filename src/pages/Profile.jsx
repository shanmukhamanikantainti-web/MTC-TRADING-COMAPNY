import React, { useEffect, useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  ChevronRight, 
  ShoppingBag, 
  Loader2, 
  Calendar, 
  Lock,
  ArrowRight,
  ShieldCheck,
  History
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import './Profile.css';

const Profile = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not loading and no user, we could redirect, but we have a guest UI below
    if (!authLoading && user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Prevent showing guest UI while verifying session
  if (authLoading) {
    return (
      <div className="profile-page texture-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader2 className="animate-spin" size={64} style={{ color: 'var(--primary-color)' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page texture-bg">
        <Navbar />
        <div className="container guest-profile-container fade-in">
          <div className="guest-card-neuromorphic scale-up">
            <div className="guest-icon-wrap float">
              <Lock size={64} className="guest-icon" />
            </div>
            <h1 className="guest-title">Heritage Account Access Required</h1>
            <p className="guest-desc">
              Identify your heritage account to access your curated order history, 
              personalized quotations, and global shipment tracking.
            </p>
            <Link to="/login" className="guest-signin-btn-neuromorphic">
              <span>{t('nav.signin')}</span>
              <ArrowRight size={20} />
            </Link>
            <div className="guest-footer">
              <ShieldCheck size={16} /> 256-bit Encrypted Identification
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page texture-bg">
      <Navbar />
      
      <div className="container profile-grid">
        {/* User Card */}
        <div className="user-profile-section scroll-reveal visible">
          <div className="user-card-glass shadow-lg">
            <div className="user-avatar-wrap">
              <div className="user-avatar">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="user-info-text">
              <h1 className="user-name">{user.user_metadata?.full_name || 'Trader'}</h1>
              <div className="user-meta">
                <span className="user-phone">
                  <Mail size={14} /> {user.email}
                </span>
                <span className="user-status-badge">Heritage Member</span>
              </div>
              <button onClick={handleSignOut} style={{ marginTop: '1rem', padding: '0.4rem 1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: '#333' }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="orders-section scroll-reveal visible">
          <div className="section-header">
            <h2 className="section-title"><History size={24} /> Recent Heritage Orders</h2>
            <span className="order-count">{orders.length} orders total</span>
          </div>

          {loading ? (
            <div className="orders-loading">
              <Loader2 className="animate-spin" size={32} />
              <p>Fetching your history...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-item-premium glass lift-glow">
                  <div className="order-header">
                    <div className="order-main-info">
                      <span className="order-number">Order #{order.id.slice(0, 8)}</span>
                      <span className="order-date">
                        <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`order-status ${order.status?.toLowerCase()}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                  
                  <div className="order-content">
                    <div className="order-items-summary">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="item-line">
                          <span className="item-name">{item?.name || "Premium Item"}</span>
                          <span className="item-qty">x{item?.quantity || "1"}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-footer">
                      <div className="shipping-info">
                        <MapPin size={14} /> {order.customer_city}
                      </div>
                      <div className="total-amount">
                        <span className="total-label">Total</span>
                        <span className="total-value">₹{order?.total_amount?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-orders-neuromorphic glass">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>Your heritage collection is starting to sprout</h3>
              <p>Start trading today and your order history will appear here.</p>
              <Link to="/products" className="browse-btn">Browse Wholesale Products</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
