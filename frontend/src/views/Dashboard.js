import React from 'react';
import { Scale, Languages, HelpCircle, MessageSquare, Mic, Paperclip, History, ArrowRight } from 'lucide-react';

const Dashboard = ({ language, navigate, setInput }) => {
  return (
    <div className="app-container">
      {/* Simple Top Nav for Dashboard */}
      <div className="dashboard-nav">
        <div className="logo-container" style={{ marginBottom: 0 }}>
          <div className="logo-icon"><Scale size={24} /></div>
          <div className="logo-text">
            <h1 style={{fontSize: '1.2rem', margin: 0}}>NyayaSetu AI</h1>
          </div>
        </div>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => navigate('language-selection')}><Languages size={20} /></button>
          <button className="icon-btn"><HelpCircle size={20} /></button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-hero">
          <div className="hero-text">
            <span className="trust-badge"><Scale size={14} /> Your Trustworthy Legal Guide</span>
            <h1 className="hero-title">AI Legal Help for Every Indian</h1>
            <p className="hero-description">
              Navigate the complexities of Indian law with clarity and confidence. Get instant, easy-to-understand legal guidance in {language}.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('chat')}>
                <MessageSquare size={18} /> Start Chat
              </button>
              <button className="btn-secondary">Try Demo</button>
            </div>
          </div>
          <div className="hero-image-placeholder">
            <Scale size={80} color="#0a4d2e" opacity={0.2} />
            <span>Justice for All</span>
          </div>
        </div>

        <div className="dashboard-features">
          <h2 className="features-title">Designed for Empathetic Clarity</h2>
          <p className="features-subtitle">Breaking down barriers to legal understanding.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#dcfce7', color: '#0a4d2e'}}><Languages size={20} /></div>
              <h3>Multilingual Support</h3>
              <p>Interact seamlessly in English, Hindi, Tamil, and other regional languages without losing context.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#dbeafe', color: '#1e40af'}}><Mic size={20} /></div>
              <h3>Voice Interaction</h3>
              <p>Speak your queries directly. A conversational experience that removes the need for typing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#fef3c7', color: '#b45309'}}><Scale size={20} /></div>
              <h3>Simple Explanations</h3>
              <p>Complex Indian Penal Code sections and legal jargon translated into straightforward, everyday language.</p>
            </div>
          </div>

          <div className="practical-assistance">
            <h3 className="section-heading">Practical Legal Assistance</h3>
            <p className="section-sub">Explore common scenarios where NyayaSetu provides immediate, structured guidance.</p>
            
            <div className="assistance-list">
              <div className="assistance-item" onClick={() => { setInput('How to file FIR?'); navigate('chat'); }}>
                <div className="icon-wrapper"><Paperclip size={18} /></div>
                <div className="item-content">
                  <h4>FIR Filing Guidance</h4>
                  <p>Understand the required documents, jurisdiction, and step-by-step procedures to file an FIR.</p>
                </div>
                <ArrowRight size={16} className="arrow" />
              </div>
              <div className="assistance-item" onClick={() => { setInput('How to get free legal aid?'); navigate('chat'); }}>
                <div className="icon-wrapper"><History size={18} /></div>
                <div className="item-content">
                  <h4>Accessing Legal Aid</h4>
                  <p>Find resources and eligibility criteria for free legal representation under NALSA.</p>
                </div>
                <ArrowRight size={16} className="arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
