import React, { useEffect } from 'react';
import { Leaf, Globe, ShieldCheck, History, Award, Users, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Heritage.css';

const Heritage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="heritage-page texture-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="heritage-hero">
        <div className="container">
          <div className="heritage-hero-content scroll-reveal">
            <span className="subtitle">Established 2001</span>
            <h1 className="title">A Legacy of <br /><span>Authentic Trading</span></h1>
            <p className="description">
              Rooted in the fertile soils of Telangana, ManiKanta Trading Company (MTC) has been a pioneer in 
              sourcing and supplying the finest Tamarind, Chillies, and Pulses for over two decades.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section section-padding">
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2 className="section-title">Our Journey</h2>
            <div className="title-underline"></div>
          </div>

          <div className="timeline">
            <div className="timeline-item scroll-reveal">
              <div className="timeline-dot"></div>
              <div className="timeline-content glass">
                <span className="year">2001</span>
                <h3>The Foundation</h3>
                <p>Started as a small local grain trading house in Miryalaguda, focusing on high-quality pulses from local farmers.</p>
              </div>
            </div>

            <div className="timeline-item scroll-reveal alt">
              <div className="timeline-dot"></div>
              <div className="timeline-content glass">
                <span className="year">2008</span>
                <h3>Specialty Expansion</h3>
                <p>Recognizing the global demand, we expanded into processed Tamarind and Guntur S17 Red Chillies.</p>
              </div>
            </div>

            <div className="timeline-item scroll-reveal">
              <div className="timeline-dot"></div>
              <div className="timeline-content glass">
                <span className="year">2015</span>
                <h3>Global Footprint</h3>
                <p>MTC officially entered the export market, shipping premium agricultural products to the UAE and Middle East.</p>
              </div>
            </div>

            <div className="timeline-item scroll-reveal alt">
              <div className="timeline-dot"></div>
              <div className="timeline-content glass">
                <span className="year">2023</span>
                <h3>Digital Transformation</h3>
                <p>Launched our B2B portal to provide real-time pricing and transparent logistics tracking for global partners.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section section-padding glass">
        <div className="container">
          <div className="values-grid">
            <div className="value-card scroll-reveal">
              <ShieldCheck size={40} className="value-icon" />
              <h3>Uncompromised Purity</h3>
              <p>We believe in the sanctity of natural grains. No additives, no synthetic preservatives—just pure harvest.</p>
            </div>
            <div className="value-card scroll-reveal">
              <Users size={40} className="value-icon" />
              <h3>Farmer Empowerment</h3>
              <p>By shortening the supply chain, we ensure farmers receive fair market value for their tireless work.</p>
            </div>
            <div className="value-card scroll-reveal">
              <Globe size={40} className="value-icon" />
              <h3>Global Standard</h3>
              <p>Adhering to international safety standards (ISO/FSSAI) to bring Indian heritage to the world stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="heritage-cta section-padding">
        <div className="container text-center scroll-reveal">
          <h2>Be Part of Our Next Chapter</h2>
          <p>Join over 500+ businesses worldwide sourcing from MTC.</p>
          <div className="cta-btns">
            <button className="primary-btn-premium">View Products <ArrowRight size={18} /></button>
            <button className="secondary-btn-premium">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Heritage;
