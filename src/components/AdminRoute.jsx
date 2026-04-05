import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const SUPER_ADMIN_EMAIL = 'shanmukhamanikanta.inti@gmail.com';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <Loader2 className="animate-spin" size={48} />
        <p>Authenticating Master Access...</p>
      </div>
    );
  }

  // Check if authenticated AND matches super admin email
  if (!user || user.email !== SUPER_ADMIN_EMAIL) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
