import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  MessageSquare, 
  LayoutDashboard, 
  Package, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const AdminSidebar = ({ subtitle = "Super Admin Access" }) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="admin-logo-link">
          <img src={logoImg} alt="MTC Logo" className="admin-sidebar-logo" />
        </Link>
        <h2 className="logo-text">MTC Admin</h2>
        <span>{subtitle}</span>
      </div>

      <nav className="sidebar-nav">
        <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/admin/products" className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}>
          <Package size={20} /> Inventory
        </Link>
        <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
          <ShoppingBag size={20} /> Orders
        </Link>
        <Link to="/admin/inquiries" className={`nav-item ${isActive('/admin/inquiries') ? 'active' : ''}`}>
          <MessageSquare size={20} /> B2B Leads
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={signOut} className="logout-btn">
          <LogOut size={18} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
