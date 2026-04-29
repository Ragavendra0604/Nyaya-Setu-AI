import React from 'react';
import { Scale, Languages, MessageSquare, History, AlertCircle, HelpCircle } from 'lucide-react';
import { LANGUAGES } from '../constants';

const Sidebar = ({ language, setLanguage, mode, setMode, navigate, clearChat }) => {
  return (
    <div className="sidebar">
      <div className="logo-container" onClick={() => navigate('dashboard')} style={{cursor: 'pointer'}}>
        <div className="logo-icon">
          <Scale size={24} />
        </div>
        <div className="logo-text">
          <h1>NyayaSetu AI</h1>
          <p>Your Trustworthy Legal Guide</p>
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="section-title">Language</h2>
        {LANGUAGES.map(lang => (
          <div 
            key={lang.id}
            className={`nav-item ${language === lang.id ? 'active' : ''}`}
            onClick={() => setLanguage(lang.id)}
          >
            <Languages size={18} />
            <span>{lang.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <h2 className="section-title">Mode</h2>
        <div 
          className={`nav-item ${mode === 'simple' ? 'active' : ''}`}
          onClick={() => setMode('simple')}
        >
          <MessageSquare size={18} />
          <span>Simple</span>
        </div>
        <div 
          className={`nav-item ${mode === 'detailed' ? 'active' : ''}`}
          onClick={() => setMode('detailed')}
        >
          <Scale size={18} />
          <span>Detailed</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="section-title">Recent Chats</h2>
        <div className="nav-item">
          <MessageSquare size={18} />
          <span>FIR Process Help</span>
        </div>
        <div className="nav-item">
          <History size={18} />
          <span>Legal Aid Query</span>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="nav-item" onClick={clearChat}>
          <AlertCircle size={18} />
          <span>Clear Conversation</span>
        </div>
        <div className="nav-item">
          <HelpCircle size={18} />
          <span>How to use?</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
