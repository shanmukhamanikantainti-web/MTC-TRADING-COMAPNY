import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Trash2, 
  Edit,
  TrendingUp,
  Package,
  LogOut,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './Admin.css';

const AdminPanel = () => {
  const { signOut } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    inquiries: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [
        { count: productCount },
        { count: orderCount },
        { count: inquiryCount },
        { data: orderData }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('wholesale_inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount')
      ]);

      const rev = orderData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

      setStats({
        products: productCount || 0,
        orders: orderCount || 0,
        inquiries: inquiryCount || 0,
        totalRevenue: rev
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard Overview</h1>
          <div className="admin-user-info">
            <span>Welcome, Master Admin</span>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading-centered">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="admin-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card glass">
                <div className="stat-icon-wrap products">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Products</span>
                  <span className="stat-value">{stats.products}</span>
                </div>
              </div>

              <div className="stat-card glass">
                <div className="stat-icon-wrap orders">
                  <ShoppingBag size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">{stats.orders}</span>
                </div>
              </div>

              <div className="stat-card glass">
                <div className="stat-icon-wrap revenue">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-card glass">
                <div className="stat-icon-wrap inquiries">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">B2B Inquiries</span>
                  <span className="stat-value">{stats.inquiries}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="admin-sections-grid">
              <section className="admin-card glass">
                <h3>Quick Management</h3>
                <div className="quick-actions">
                  <Link to="/admin/products" className="action-btn-refined">
                    Manage Inventory <ChevronRight size={18} />
                  </Link>
                  <Link to="/admin/orders" className="action-btn-refined">
                    Recent Orders <ChevronRight size={18} />
                  </Link>
                  <Link to="/admin/inquiries" className="action-btn-refined">
                    Review Inquiries <ChevronRight size={18} />
                  </Link>
                </div>
              </section>

              <section className="admin-card glass">
                <h3>System Health</h3>
                <div className="health-status">
                  <div className="status-item">
                    <span>Database Connection</span>
                    <span className="status-badge stable">Stable</span>
                  </div>
                  <div className="status-item">
                    <span>Export Pipelines</span>
                    <span className="status-badge active">Active</span>
                  </div>
                  <div className="status-item">
                    <span>Auth Service</span>
                    <span className="status-badge online">Online</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
