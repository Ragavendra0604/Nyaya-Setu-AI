import { useState } from 'react';
import DashboardScreen from './components/DashboardScreen';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import ChatPage from './components/Chatpage';
import Login from './components/Auth/Login';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('lang') || null
  );

  const [showDashboard, setShowDashboard] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  if (!selectedLanguage) {
    return (
      <LanguageSelectionScreen
        onSelectLanguage={(lang) => {
          localStorage.setItem('lang', lang);
          setSelectedLanguage(lang);
        }}
      />
    );
  }

  if (showLogin && !isLoggedIn) {
    return <Login 
      setShowLogin={setShowLogin} 
      setIsLoggedIn={setIsLoggedIn} 
    />;
  }

  if (showChat) {
    return (
      <ChatPage
        selectedLanguage={selectedLanguage}
        isDemo={isDemo}
        setShowChat={setShowChat}
      />
    );
  }

  return (
    <DashboardScreen
      selectedLanguage={selectedLanguage}
      onSelectLanguage={(lang) => {
        localStorage.setItem('lang', lang);
        setSelectedLanguage(lang);
      }}
      setShowDashboard={setShowDashboard}
      setShowChat={setShowChat}
      setShowLogin={setShowLogin}
      isLoggedIn={isLoggedIn}
      setIsDemo={setIsDemo}
    />
  );

}

export default App;