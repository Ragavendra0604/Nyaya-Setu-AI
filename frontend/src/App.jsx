import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import DashboardScreen from "./components/DashboardScreen";
import LanguageSelectionScreen from "./components/LanguageSelectionScreen";
import ChatPage from "./components/Chatpage";
import Login from "./components/Auth/Login";
import Profile from "./components/Profile/Profile";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getUser } from "./services/api";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("lang") || null
  );

  const [showDashboard, setShowDashboard] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // 🔥 NEW STATES
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // 🔥 Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);

        try {
          let response = await getUser(user.uid);

          // If not found, wait a bit and retry (handles race condition with syncProfile)
          if (!response.ok || !response.user) {
            console.log("Profile not found, retrying in 2 seconds...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            response = await getUser(user.uid);
          }

          if (response.ok && response.user) {
            setUserProfile(response.user);
          } else {
            console.log("User profile still not found in backend");
          }
        } catch (err) {
          console.error("Error fetching user from backend:", err);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🌐 Language screen
  if (!selectedLanguage) {
    return (
      <LanguageSelectionScreen
        onSelectLanguage={(lang) => {
          localStorage.setItem("lang", lang);
          setSelectedLanguage(lang);
        }}
      />
    );
  }

  // 🔐 Login screen
  if (showLogin && !isLoggedIn) {
    return (
      <Login
        setShowLogin={setShowLogin}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  // 👤 Profile screen
  if (showProfile && isLoggedIn) {
    return (
      <Profile
        userProfile={userProfile}
        currentUser={currentUser}
        onBack={() => setShowProfile(false)}
        onLanguageChange={(lang) => {
          localStorage.setItem("lang", lang);
          setSelectedLanguage(lang);
        }}
      />
    );
  }

  // 💬 Chat screen
  if (showChat) {
    return (
      <ChatPage
        selectedLanguage={selectedLanguage}
        isDemo={isDemo}
        setShowChat={setShowChat}
        setShowProfile={setShowProfile}
        currentUser={currentUser}     // 🔥 pass user
        userProfile={userProfile}     // 🔥 pass profile
      />
    );
  }

  // 🏠 Dashboard
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #2ecc71',
          },
          success: {
            iconTheme: {
              primary: '#2ecc71',
              secondary: '#fff',
            },
          },
        }}
      />
      <DashboardScreen
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          localStorage.setItem("lang", lang);
          setSelectedLanguage(lang);
        }}
        setShowDashboard={setShowDashboard}
        setShowChat={setShowChat}
        setShowLogin={setShowLogin}
        setShowProfile={setShowProfile}
        isLoggedIn={isLoggedIn}
        setIsDemo={setIsDemo}
      />
    </>
  );
}

export default App;