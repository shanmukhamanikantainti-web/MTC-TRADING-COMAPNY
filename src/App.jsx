import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Wholesale from './pages/Wholesale';
import Heritage from './pages/Heritage';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import AdminInquiries from './pages/AdminInquiries';
import AdminPanel from './pages/AdminPanel';
import AdminProducts from './pages/AdminProducts';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminRoute from './components/AdminRoute';
import LanguageSelect from './pages/LanguageSelect';
import ErrorBoundary from './components/ErrorBoundary';
import { useLanguage } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + B shortcut
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        const code = prompt("ENTER ADMIN ACCESS CODE:");
        if (code === "MTCTRADINGCOMAPNY2026") {
          navigate('/admin');
        } else if (code !== null) {
          alert("INVALID ACCESS CODE");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const { language } = useLanguage();

  if (!language) {
    return <LanguageSelect />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<Heritage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiries /></AdminRoute>} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
