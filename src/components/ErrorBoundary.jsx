import React, { Component } from 'react';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MTC Heritage Recovery Audit:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-recovery-page texture-bg">
          <div className="recovery-card glass fade-in">
            <div className="recovery-icon-wrap">
              <ShieldAlert size={48} className="recovery-icon" />
            </div>
            <h1>Heritage Recovery Mode</h1>
            <p>
              We encountered a minor disturbance in the heritage portal. 
              Our quality team has been notified.
            </p>
            <div className="recovery-actions">
              <button 
                className="btn-primary-heritage" 
                onClick={() => window.location.reload()}
              >
                <RefreshCcw size={18} /> Refresh Portal
              </button>
              <button 
                className="btn-secondary-heritage" 
                onClick={() => window.location.href = '/'}
              >
                <Home size={18} /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
