import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Building, Briefcase, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase } from '../services/supabase';
import './Wholesale.css';

const Wholesale = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: '',
    company_name: '',
    email: '',
    phone: '',
    details: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('wholesale_inquiries')
        .insert([formData]);
      
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wholesale-page texture-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="wholesale-hero">
        <div className="container">
          <div className="wholesale-hero-content scroll-reveal visible">
            <span className="subtitle">B2B Prime Solutions</span>
            <h1 className="title">Scale Your Business with <br /><span>MTC Heritage Grains</span></h1>
            <p className="description">
              Direct-from-source bulk supply chains for exporters, distributors, and large-scale retailers. 
              Verified quality, competitive quintal pricing, and worldwide logistics.
            </p>
          </div>
        </div>
      </section>

      <div className="container wholesale-grid">
        {/* Features / Why MTC */}
        <div className="wholesale-info scroll-reveal visible">
          <div className="info-card-premium glass">
            <h2>Why Partner with MTC?</h2>
            
            <div className="benefit-item">
              <CheckCircle className="benefit-icon" />
              <div>
                <h3>Direct Farm Sourcing</h3>
                <p>Eliminate middlemen. We source directly from major grain markets in Nalgonda and Guntur.</p>
              </div>
            </div>

            <div className="benefit-item">
              <CheckCircle className="benefit-icon" />
              <div>
                <h3>Custom Packaging</h3>
                <p>Bulk bags (25kg, 50kg, 100kg) or white-label retail packaging available for exporters.</p>
              </div>
            </div>

            <div className="benefit-item">
              <CheckCircle className="benefit-icon" />
              <div>
                <h3>Global Logistics</h3>
                <p>Expertise in exporting to UAE, Europe, and SE Asia with all required phytosanitary certificates.</p>
              </div>
            </div>

            <div className="wholesale-contact-info">
              <div className="contact-link">
                <MapPin size={18} /> 
                <span>Main Warehouse: Miryalaguda, Telangana, India</span>
              </div>
              <div className="contact-link">
                <Mail size={18} /> 
                <span>b2b@mtctrading.co.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="wholesale-form-section scroll-reveal visible">
          <div className="form-card-glass shadow-lg">
            {!submitted ? (
              <>
                <h3>Wholesale Inquiry Form</h3>
                <p>Submit your requirements and our trade officer will contact you within 4 business hours.</p>
                
                <form className="wholesale-form-refined" onSubmit={handleSubmit}>
                  <div className="form-row-premium">
                    <div className="form-group-premium">
                      <label><Briefcase size={16} /> Contact Name</label>
                      <input 
                        type="text" 
                        name="contact_name"
                        placeholder="John Doe" 
                        value={formData.contact_name}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="form-group-premium">
                      <label><Building size={16} /> Company Name</label>
                      <input 
                        type="text" 
                        name="company_name"
                        placeholder="Global Spices Ltd" 
                        value={formData.company_name}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group-premium">
                    <label><Mail size={16} /> Business Email</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="procurement@company.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group-premium">
                    <label><Phone size={16} /> Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group-premium">
                    <label>Inquiry Details (Product & Estimated Qty)</label>
                    <textarea 
                      name="details"
                      placeholder="e.g. 50 Quintals of S17 Teja Chillies for export to UAE..." 
                      rows="4" 
                      value={formData.details}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn-premium" disabled={loading}>
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Send Inquiry <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon-wrap">
                  <CheckCircle size={64} className="success-icon" />
                </div>
                <h3>Inquiry Received!</h3>
                <p>A senior trade consultant has been assigned to your request. You will receive a quotation on your email shortly.</p>
                <button onClick={() => setSubmitted(false)} className="reset-btn-premium">
                  Submit another inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wholesale;
