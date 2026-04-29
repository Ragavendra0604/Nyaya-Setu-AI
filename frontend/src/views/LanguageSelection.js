import React from 'react';
import { Scale, ChevronRight } from 'lucide-react';
import { LANGUAGES } from '../constants';

const LanguageSelection = ({ setLanguage, navigate }) => {
  return (
    <div className="landing-container center-content">
      <div className="language-selector-box">
        <div className="logo-icon large-icon"><Scale size={40} /></div>
        <h1 className="landing-title">NyayaSetu AI</h1>
        <p className="landing-subtitle">Choose your preferred language to get started.</p>
        <div className="language-cards">
          {LANGUAGES.map(lang => (
            <div 
              key={lang.id} 
              className="language-card"
              onClick={() => {
                setLanguage(lang.id);
                navigate('dashboard');
              }}
            >
              <div className="lang-icon">
                {lang.id === 'English' ? 'A' : lang.id === 'Hindi' ? 'अ' : 'அ'}
              </div>
              <span className="lang-label">{lang.label}</span>
              <ChevronRight size={20} className="chevron" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
