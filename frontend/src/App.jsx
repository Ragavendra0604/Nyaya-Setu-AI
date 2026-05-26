import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import DashboardScreen from "./components/DashboardScreen";
import LanguageSelectionScreen from "./components/LanguageSelectionScreen";
import ChatPage from "./components/Chatpage";
import Login from "./components/Auth/Login";
import Profile from "./components/Profile/Profile";

import i18n from "./iq8n";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// API
import { getUser, getTranslations } from "./services/api";

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

  // 🔥 USER STATES
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // 🔥 CHAT STATES
  const [chats, setChats] = useState([
    {
      chatId: null,
      title: "New Chat",
      messages: [],
    },
  ]);

  const [activeChatIndex, setActiveChatIndex] = useState(0);

  // 🔥 GLOBAL LOADING
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("simple");

  // =========================================
  // 🌐 LOAD TRANSLATIONS FROM DATABASE
  // =========================================
  useEffect(() => {

    async function loadTranslations() {

      if (!selectedLanguage) return;

      try {

        setLoading(true);

        const response = await getTranslations(selectedLanguage);

        if (response.ok) {

          i18n.addResourceBundle(
            selectedLanguage,
            "translation",
            response.translations,
            true,
            true
          );

          await i18n.changeLanguage(selectedLanguage);

          console.log("Translations loaded:", selectedLanguage);

        } else {

          console.warn("Translation API failed");

        }

      } catch (error) {

        console.error("Translation load error:", error);

      } finally {

        setLoading(false);

      }
    }

    loadTranslations();

  }, [selectedLanguage]);

  // =========================================
  // 🔥 FIREBASE AUTH LISTENER
  // =========================================
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      // ✅ USER LOGGED IN
      if (user) {

        console.log("Firebase user detected:", user.email);

        setCurrentUser(user);

        setIsLoggedIn(true);

        try {

          let response = await getUser(user.uid);

          // Retry once if backend profile missing
          if (!response.ok || !response.user) {

            console.log("Retrying profile fetch...");

            await new Promise((resolve) =>
              setTimeout(resolve, 1500)
            );

            response = await getUser(user.uid);
          }

          if (response.ok && response.user) {

            setUserProfile(response.user);

            setMode(response.user.mode || "simple");

            console.log("Backend profile loaded");

          } else {

            console.warn("User profile missing in backend");

          }

        } catch (err) {

          console.error("Backend fetch failed:", err);

          toast.error("Failed to load profile");
        }
      }

      // ❌ USER LOGGED OUT
      else {

        console.log("User logged out");

        setCurrentUser(null);

        setUserProfile(null);

        setIsLoggedIn(false);

        // Reset chats
        setChats([
          {
            chatId: null,
            title: "New Chat",
            messages: [],
          },
        ]);

        setActiveChatIndex(0);

        setLoading(false);
      }
    });

    return () => unsubscribe();

  }, []);

  // =========================================
  // 🔙 BACK BUTTON SUPPORT
  // =========================================
  useEffect(() => {

    const handlePopState = () => {

      if (showProfile) {

        setShowProfile(false);

      }

      else if (showChat) {

        setShowChat(false);

      }

      else if (showLogin) {

        setShowLogin(false);

      }

      else if (selectedLanguage) {

        setSelectedLanguage(null);

      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {

      window.removeEventListener(
        "popstate",
        handlePopState
      );

    };

  }, [
    showProfile,
    showChat,
    showLogin,
    selectedLanguage,
  ]);

  // =========================================
  // 📌 PUSH HISTORY
  // =========================================
  const pushState = () => {

    window.history.pushState(
      {},
      "",
      window.location.pathname
    );

  };

  // =========================================
  // ⏳ GLOBAL LOADING SCREEN
  // =========================================
  if (loading) {

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: "600",
      }}
    >
      Loading...
    </div>
  );
}

  // =========================================
  // 🌐 LANGUAGE SCREEN
  // =========================================
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

  // =========================================
  // 🔐 LOGIN SCREEN
  // =========================================
  if (showLogin && !isLoggedIn) {

    return (
      <>
        <Toaster position="top-center" />

        <Login
          setShowLogin={setShowLogin}
          setIsLoggedIn={setIsLoggedIn}
        />
      </>
    );
  }

  // =========================================
  // 👤 PROFILE SCREEN
  // =========================================
  if (showProfile && isLoggedIn) {

    return (
      <>
        <Toaster position="top-center" />

        <Profile
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          currentUser={currentUser}

          onBack={() => window.history.back()}

          onLanguageChange={(lang) => {

            localStorage.setItem("lang", lang);

            setSelectedLanguage(lang);

          }}
        />
      </>
    );
  }

  // =========================================
  // 💬 CHAT SCREEN
  // =========================================
  if (showChat) {

    return (
      <>
        <Toaster position="top-center" />

        <ChatPage
          selectedLanguage={selectedLanguage}

          isDemo={isDemo}

          setShowChat={(val) => {

            if (!val) {

              window.history.back();

            } else {

              setShowChat(true);

            }
          }}

          setShowProfile={setShowProfile}

          currentUser={currentUser}

          userProfile={userProfile}

          chats={chats}

          setChats={setChats}

          activeChatIndex={activeChatIndex}

          setActiveChatIndex={setActiveChatIndex}

          loading={loading}

          setLoading={setLoading}

          mode={mode}

          setMode={setMode}
        />
      </>
    );
  }

  // =========================================
  // 🏠 DASHBOARD
  // =========================================
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #2ecc71",
          },

          success: {
            iconTheme: {
              primary: "#2ecc71",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ff4b4b",
              secondary: "#fff",
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

            const topChat = chats[0];

            const isTopEmpty =
              topChat &&
              !topChat.chatId &&
              (
                !topChat.messages ||
                topChat.messages.length === 0
              );

            if (!isTopEmpty) {

              setChats([
                {
                  chatId: null,
                  title: "New Chat",
                  messages: [],
                },

                ...chats,
              ]);

              setActiveChatIndex(0);

            } else {

              setActiveChatIndex(0);

            }
          }

          setShowChat(val);

          if (val) {

            pushState();

          }
        }}

        setShowLogin={(val) => {

          setShowLogin(val);

          if (val) {

            pushState();

          }
        }}

        setShowProfile={(val) => {

          setShowProfile(val);

          if (val) {

            pushState();

          }
        }}

        isLoggedIn={isLoggedIn}

        setIsDemo={setIsDemo}

        setIsLoggedIn={setIsLoggedIn}
      />
    </>
  );
}

export default App;