import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

export const SUPER_ADMIN_EMAIL = 'shanmukhamanikanta.inti@gmail.com';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkAdmin = async () => {
      if (user) {
        if (user.email === SUPER_ADMIN_EMAIL) {
          if (isMounted) {
            setIsAdmin(true);
            setCheckingRole(false);
          }
        } else {
          try {
            const { data, error } = await supabase
              .from('admin_users')
              .select('email')
              .eq('email', user.email)
              .single();
            if (data && isMounted) {
              setIsAdmin(true);
            }
          } catch (error) {
            console.error("Error checking role:", error);
          } finally {
            if (isMounted) setCheckingRole(false);
          }
        }
      } else {
        if (isMounted) setCheckingRole(false);
      }
    };
    
    checkAdmin();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading || checkingRole) {
    return (
      <div className="admin-loading-screen">
        <Loader2 className="animate-spin" size={48} />
        <p>Authenticating Admin Access...</p>
      </div>
    );
  }

  // Check if authenticated AND isAdmin is true
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
