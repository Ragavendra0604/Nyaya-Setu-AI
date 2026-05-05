import { useState, useEffect } from "react";
import DashboardScreen from "./components/DashboardScreen";
import LanguageSelectionScreen from "./components/LanguageSelectionScreen";
import ChatPage from "./components/Chatpage";
import Login from "./components/Auth/Login";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("lang") || null
  );

  const [showDashboard, setShowDashboard] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (err) {
          console.log("Error fetching user:", err);
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

  // 💬 Chat screen
  if (showChat) {
    return (
      <ChatPage
        selectedLanguage={selectedLanguage}
        isDemo={isDemo}
        setShowChat={setShowChat}
        currentUser={currentUser}     // 🔥 pass user
        userProfile={userProfile}     // 🔥 pass profile
      />
    );
  }

  // 🏠 Dashboard
  return (
    <DashboardScreen
      selectedLanguage={selectedLanguage}
      onSelectLanguage={(lang) => {
        localStorage.setItem("lang", lang);
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