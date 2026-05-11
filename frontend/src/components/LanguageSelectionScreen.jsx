import './LanguageSelectionScreen.css';
import logo from '../assets/app_logo.jpeg';
import i18n from 'i18next';

const languages = [
  { id: 'en', label: 'English', nativeLabel: 'English', icon: 'A' },
  { id: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', icon: 'हि' },
  { id: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', icon: 'த' },
];

function LanguageSelectionScreen({ onSelectLanguage }) {
  return (
    <main className="language-screen">
      <section className="language-card">
        <div className="brand-badge">
          <img src={logo} alt="NyayaSetu AI" />
        </div>
        <h1>NyayaSetu AI</h1>
        <p>Choose your preferred language to get started.</p>

        <div className="language-list">
          {languages.map((language) => (
            <button
              key={language.id}
              className="language-option"
              type="button"
              onClick={() => {
                i18n.changeLanguage(language.id);
                onSelectLanguage(language.id);
              }}
            >
              <span className="language-icon">{language.icon}</span>
              <span className="language-copy">
                <strong>{language.label}</strong>
                <small>{language.nativeLabel}</small>
              </span>
              <span className="language-arrow">&gt;</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LanguageSelectionScreen;
