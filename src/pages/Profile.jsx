import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import { 
  User, 
  Phone, 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin,
  ShoppingBag,
  Loader2,
  Calendar
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const { userProfile, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.phone) {
      fetchUserOrders();
    }
  }, [userProfile]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('phone', userProfile.phone)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <Clock size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <main className="profile-container">
        <header className="profile-header glass">
          <div className="user-avatar-large">
            {userProfile?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info-text">
            <h1>{t('nav.profile')}</h1>
            <div className="badge-group">
              <span className="user-badge"><User size={14} /> {userProfile?.name}</span>
              <span className="user-badge"><Phone size={14} /> {userProfile?.phone}</span>
            </div>
          </div>
        </header>

        <section className="orders-section">
          <div className="section-header">
            <ShoppingBag size={20} />
            <h2>{t('nav.heritage')} Orders</h2>
            <span className="order-count-chip">{orders.length} Total</span>
          </div>

          {loading ? (
            <div className="profile-loading">
              <Loader2 className="animate-spin" size={32} />
              <p>Fetching your MTC history...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="orders-grid-profile">
              {orders.map((order) => (
                <div key={order.id} className="order-card-profile glass active">
                  <div className="order-card-header">
                    <div className="order-meta">
                      <span className="order-number">#MTC-{order.id}</span>
                      <span className="order-date"><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`status-pill ${order.status}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items-summary">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="item-line">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="delivery-info">
                      <MapPin size={14} />
                      <span className="pincode-text">Delivering to {order.pincode}</span>
                    </div>
                    <div className="total-amount">
                      <span className="total-label">Total</span>
                      <span className="total-value">₹{order.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-orders glass">
              <Package size={48} className="empty-icon" />
              <h3>No Orders Found</h3>
              <p>Your heritage trading journey starts with your first order.</p>
              <button className="shop-now-btn" onClick={() => window.location.href='/products'}>
                Start Shopping <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
