import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, Trash2, Mail, Plus } from 'lucide-react';
import { SUPER_ADMIN_EMAIL } from '../components/AdminRoute';
import './Admin.css';

const AdminUsers = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingError, setAddingError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== '42P01') throw error; // Ignore table not found if they haven't made it yet
      setAdmins(data || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddingError('');

    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      setAddingError('Please enter a valid email address.');
      return;
    }

    if (!isSuperAdmin) {
      setAddingError('Only the Super Admin can add new administrators.');
      return;
    }

    try {
      setIsAdding(true);
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{ email: newAdminEmail.trim() }])
        .select();

      if (error) {
        if (error.code === '23505') {
          throw new Error('This user is already an admin.');
        } else if (error.code === '42P01') {
          throw new Error('The admin_users table does not exist. Please run the SQL setup in Supabase.');
        }
        throw error;
      }

      setNewAdminEmail('');
      setAdmins(prev => [data[0], ...prev]);
    } catch (err) {
      console.error('Error adding admin:', err);
      setAddingError(err.message || 'Failed to add admin');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAdmin = async (id, email) => {
    if (!isSuperAdmin) {
      alert('Only the Super Admin can remove administrators.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove admin privileges for ${email}?`)) {
      try {
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setAdmins(prev => prev.filter(admin => admin.id !== id));
      } catch (err) {
        console.error('Error deleting admin:', err);
        alert('Failed to remove admin privileges.');
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar subtitle="User Management" />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Users Management</h1>
          <div className="admin-user-info">
            <span>Logged in as: {user?.email}</span>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-section glass">
            <div className="section-header-row">
              <h2>Add New Admin User</h2>
            </div>
            
            <form onSubmit={handleAddAdmin} className="add-admin-form">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="input-wrap" style={{ flex: 1, margin: 0 }}>
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    placeholder="Enter user email address..."
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    disabled={!isSuperAdmin || isAdding}
                    style={{ width: '100%' }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="action-btn-refined"
                  disabled={!isSuperAdmin || isAdding}
                  style={{ height: '42px', padding: '0 1.5rem', whiteSpace: 'nowrap' }}
                >
                  {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Add Admin
                </button>
              </div>
              {addingError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{addingError}</p>}
              {!isSuperAdmin && (
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Only the Super Admin ({SUPER_ADMIN_EMAIL}) can add or remove admin privileges.
                </p>
              )}
            </form>
          </section>

          <section className="admin-section glass" style={{ marginTop: '2rem' }}>
            <div className="section-header-row">
              <h2>Current Administrators</h2>
            </div>

            {loading ? (
              <div className="admin-loading-centered" style={{ padding: '3rem 0' }}>
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>EMAIL</th>
                      <th>DATE ADDED</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{SUPER_ADMIN_EMAIL}</strong>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          background: 'rgba(234, 179, 8, 0.2)', 
                          color: '#facc15',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          marginLeft: '0.5rem'
                        }}>Super</span>
                      </td>
                      <td>System Creator</td>
                      <td>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Cannot be removed</span>
                      </td>
                    </tr>
                    {admins.map((admin) => (
                      <tr key={admin.id}>
                        <td>{admin.email}</td>
                        <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                            className="action-icon"
                            style={{ color: '#ef4444' }}
                            disabled={!isSuperAdmin}
                            title={isSuperAdmin ? "Remove Admin" : "Only Super Admin can remove"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {admins.length === 0 && (
                      <tr className="empty-row">
                        <td colSpan="3">No additional admins assigned yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
