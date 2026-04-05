import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ChevronLeft, 
  Calendar, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Trash2, 
  Loader2,
  CheckCircle,
  FileText
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './Admin.css';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('wholesale_inquiries').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this inquiry from history?')) return;
    
    try {
      const { error } = await supabase.from('wholesale_inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar subtitle="B2B Lead Management" />

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-breadcrumbs">
            <Link to="/admin" className="back-link"><ChevronLeft size={16} /> Dashboard</Link>
            <h1>Wholesale & Export Inquiries</h1>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading-centered">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="inquiries-section">
            <div className="inquiries-grid">
              {inquiries.length > 0 ? inquiries.map(inquiry => (
                <div key={inquiry.id} className="inquiry-card-refined glass">
                  <div className="inquiry-card-header">
                    <div className="inquiry-date">
                      <Calendar size={14} /> {new Date(inquiry.created_at).toLocaleDateString()}
                    </div>
                    <button onClick={() => handleDelete(inquiry.id)} className="inquiry-delete-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="inquiry-main-info">
                    <div className="info-row">
                      <User size={18} className="info-icon" />
                      <div>
                        <span className="label">Contact Person</span>
                        <span className="value">{inquiry.contact_name}</span>
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <Building size={18} className="info-icon" />
                      <div>
                        <span className="label">Company Name</span>
                        <span className="value">{inquiry.company_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="inquiry-contact-details">
                    <a href={`mailto:${inquiry.email}`} className="contact-pill">
                      <Mail size={14} /> {inquiry.email}
                    </a>
                    <a href={`tel:${inquiry.phone}`} className="contact-pill">
                      <Phone size={14} /> {inquiry.phone}
                    </a>
                  </div>

                  <div className="inquiry-message-wrap glass">
                    <div className="message-header">
                      <FileText size={14} /> Requirement Details
                    </div>
                    <p className="message-content">{inquiry.details}</p>
                  </div>
                  
                  <div className="inquiry-actions-bottom">
                    <button className="mark-handled-btn">
                      <CheckCircle size={14} /> Mark as Handled
                    </button>
                  </div>
                </div>
              )) : (
                <div className="no-inquiries glass">
                  <MessageSquare size={64} />
                  <h3>No inquiries yet</h3>
                  <p>When B2B customers submit the wholesale form, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminInquiries;
