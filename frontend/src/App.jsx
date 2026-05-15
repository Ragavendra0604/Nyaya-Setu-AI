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
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [showDashboard, setShowDashboard] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // 🔥 NEW STATES
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // 🔥 LIFTED CHAT STATES
  const [chats, setChats] = useState([
    { chatId: null, title: "New Chat", messages: [] },
  ]);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("simple"); // Default mode

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
            setMode(response.user.mode || "simple");
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
        // Reset chat states on logout
        setChats([{ chatId: null, title: "New Chat", messages: [] }]);
        setActiveChatIndex(0);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Browser History Management (Back Button Support)
  useEffect(() => {
    const handlePopState = () => {
      if (showProfile) {
        setShowProfile(false);
      } else if (showChat) {
        setShowChat(false);
      } else if (showLogin) {
        setShowLogin(false);
      } else if (selectedLanguage) {
        setSelectedLanguage(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showProfile, showChat, showLogin, selectedLanguage]);

  // Helper to push history state
  const pushState = () => {
    window.history.pushState(null, "", window.location.pathname);
  };

  // 🌐 Language screen
  if (!selectedLanguage) {
    return (
      <LanguageSelectionScreen
        onSelectLanguage={(lang) => {
          localStorage.setItem("lang", lang);
          setSelectedLanguage(lang);
          pushState();
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
        onBack={() => window.history.back()}
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
        setShowChat={(val) => {
          if (!val) window.history.back();
          else setShowChat(true);
        }}
        setShowProfile={setShowProfile}
        currentUser={currentUser}
        userProfile={userProfile}
        // Lifted states
        chats={chats}
        setChats={setChats}
        activeChatIndex={activeChatIndex}
        setActiveChatIndex={setActiveChatIndex}
        loading={loading}
        setLoading={setLoading}
        mode={mode}
        setMode={setMode}
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
        setShowChat={(val) => {
          if (val) {
            // Only add a new chat if the current top chat is not already empty/new
            const topChat = chats[0];
            const isTopEmpty = topChat && !topChat.chatId && (!topChat.messages || topChat.messages.length === 0);

            if (!isTopEmpty) {
              setChats([{ chatId: null, title: "New Chat", messages: [] }, ...chats]);
              setActiveChatIndex(0);
            } else {
              setActiveChatIndex(0);
            }
          }
          setShowChat(val);
          if (val) pushState();
        }}
        setShowLogin={(val) => {
          setShowLogin(val);
          if (val) pushState();
        }}
        setShowProfile={(val) => {
          setShowProfile(val);
          if (val) pushState();
        }}
        isLoggedIn={isLoggedIn}
        setIsDemo={setIsDemo}
        setIsLoggedIn={setIsLoggedIn}
      />
    </>
  );
}

export default App;