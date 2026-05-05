import { useState, useEffect, useRef } from "react";
import "./chat.css";
import { ArrowLeftCircle, Scale, Plus, PanelLeft, Mic, Send } from "lucide-react";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { sendLegalQuery } from "../services/api";

const TEXT = {
  en: {
    appName: "NyayaSetu",
    newChat: "New Chat",
    logout: "Logout",
    simple: "Simple",
    detailed: "Detailed",
    placeholder: "Ask about Indian law...",
    rename: "Rename",
    clear: "Clear",
    delete: "Delete",
    feedback: "Feedback",
  },
  hi: {
    appName: "न्यायसेतु",
    newChat: "नई चैट",
    logout: "लॉग आउट",
    simple: "सरल",
    detailed: "विस्तृत",
    placeholder: "कानूनी प्रश्न पूछें...",
    rename: "नाम बदलें",
    clear: "साफ करें",
    delete: "हटाएं",
    feedback: "प्रतिक्रिया",
  },
  ta: {
    appName: "நியாயசேது",
    newChat: "புதிய உரையாடல்",
    logout: "வெளியேறு",
    simple: "எளியது",
    detailed: "விரிவானது",
    placeholder: "சட்ட கேள்விகளை கேளுங்கள்...",
    rename: "பெயர் மாற்று",
    clear: "அழி",
    delete: "நீக்கு",
    feedback: "கருத்து",
  },
};

const DEMO_OPTIONS_MAP = {
  en: ["FIR Filing Guidance", "Accessing Legal Aid", "Tenant Rights & Dispute"],
  hi: [
    "एफआईआर दर्ज करने की जानकारी",
    "मुफ्त कानूनी सहायता कैसे प्राप्त करें",
    "किरायेदार अधिकार और विवाद",
  ],
  ta: [
    "FIR பதிவு வழிகாட்டி",
    "இலவச சட்ட உதவி பெறுவது எப்படி",
    "குத்தகையாளர் உரிமைகள் & பிரச்சினைகள்",
  ],
};

export default function ChatPage({
  selectedLanguage,
  isDemo,
  setShowChat,
  currentUser,
  userProfile,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [menuOpen, setMenuOpen] = useState(null);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showDemoOptions, setShowDemoOptions] = useState(isDemo);

  const [chats, setChats] = useState([
    { title: "New Chat", messages: [], firestoreId: null },
  ]);

  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const activeChatIndexRef = useRef(0);

  const [input, setInput] = useState("");
  const [mode, setMode] = useState(userProfile?.mode || "simple");
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});

  const messages = chats[activeChatIndex]?.messages || [];
  const messagesEndRef = useRef(null);

  const lang = selectedLanguage || localStorage.getItem("lang") || "en";
  const t = TEXT[lang] || TEXT.en;
  const DEMO_OPTIONS = DEMO_OPTIONS_MAP[lang] || DEMO_OPTIONS_MAP.en;

  const getMessageKey = (msg) => `${msg.query || msg.text}-${msg.time || ""}`;

  useEffect(() => {
    activeChatIndexRef.current = activeChatIndex;
  }, [activeChatIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser || isDemo) return;

      try {
        const q = query(
          collection(db, "chats"),
          where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setChats([{ title: t.newChat, messages: [], firestoreId: null }]);
          setActiveChatIndex(0);
          return;
        }

        const fetchedChats = snapshot.docs
          .map((docSnap) => ({
            firestoreId: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a, b) => {
            const aTime = a.updatedAt?.seconds || a.createdAt?.seconds || 0;
            const bTime = b.updatedAt?.seconds || b.createdAt?.seconds || 0;
            return bTime - aTime;
          });

        setChats(fetchedChats);
        setActiveChatIndex(0);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [currentUser, isDemo, t.newChat]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!currentUser || isDemo) return;

      try {
        const q = query(
          collection(db, "feedback"),
          where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);
        const savedRatings = {};

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();

          if (data.messageKey) {
            savedRatings[data.messageKey] = data.rating;
          }
        });

        setRatings(savedRatings);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [currentUser, isDemo]);

  const saveChatToFirestore = async (updatedChat) => {
    if (!currentUser || isDemo) return null;

    try {
      if (updatedChat.firestoreId) {
        await updateDoc(doc(db, "chats", updatedChat.firestoreId), {
          title: updatedChat.title,
          messages: updatedChat.messages,
          mode,
          language: lang,
          updatedAt: serverTimestamp(),
        });

        return updatedChat.firestoreId;
      }

      const docRef = await addDoc(collection(db, "chats"), {
        userId: currentUser.uid,
        title: updatedChat.title,
        messages: updatedChat.messages,
        mode,
        language: lang,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error saving chat:", error);
      return null;
    }
  };

  const updateChat = async (newMessages) => {
    const index = activeChatIndexRef.current;

    const existingChat = chats[index] || {
      title: t.newChat,
      messages: [],
      firestoreId: null,
    };

    const currentTitle =
      existingChat.title === t.newChat && newMessages[0]?.text
        ? newMessages[0].text.slice(0, 25)
        : existingChat.title || t.newChat;

    const updatedChat = {
      ...existingChat,
      title: currentTitle,
      messages: newMessages,
    };

    setChats((prevChats) => {
      const updated = [...prevChats];
      updated[index] = updatedChat;
      return updated;
    });

    const firestoreId = await saveChatToFirestore(updatedChat);

    if (firestoreId && !updatedChat.firestoreId) {
      setChats((prevChats) => {
        const updated = [...prevChats];
        updated[index] = {
          ...updated[index],
          firestoreId,
        };
        return updated;
      });
    }

    return firestoreId;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const queryText = input;

    const userMsg = {
      type: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setInput("");
    setLoading(true);

    const messagesWithUser = [...messages, userMsg];

    const index = activeChatIndexRef.current;
    setChats((prevChats) => {
      const updated = [...prevChats];
      updated[index] = {
        ...updated[index],
        messages: messagesWithUser,
      };
      return updated;
    });

    try {
      const result = await sendLegalQuery({
        query: queryText,
        language: lang,
        mode,
      });

      const systemMsg = {
        type: "system",
        text:
          result?.answer ||
          (mode === "simple"
            ? "Simple legal answer."
            : "Detailed legal explanation for your query."),
        query: queryText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      await updateChat([...messagesWithUser, systemMsg]);
    } catch (error) {
      await updateChat([
        ...messagesWithUser,
        {
          type: "system",
          text: "Sorry, something went wrong. Please try again.",
          query: queryText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveFeedback = async (msg, rating, messageKey) => {
    if (!currentUser) {
      alert("Login required to save feedback");
      return;
    }

    if (ratings[messageKey]) {
      alert("Feedback already submitted");
      return;
    }

    setRatings((prev) => ({
      ...prev,
      [messageKey]: rating,
    }));

    setHoverRatings((prev) => ({
      ...prev,
      [messageKey]: 0,
    }));

    try {
      const feedbackText = prompt("Enter feedback text:");

      await addDoc(collection(db, "feedback"), {
        userId: currentUser.uid,
        messageKey,
        query: msg.query || "",
        response: msg.text,
        rating,
        feedback: feedbackText || "",
        language: lang,
        mode,
        timestamp: serverTimestamp(),
      });

      alert("Feedback saved");
    } catch (error) {
      console.error("Feedback error:", error);
      alert("Failed to save feedback");
    }
  };

  const handleDemoClick = async (text) => {
    const userMsg = { type: "user", text };
    await updateChat([...messages, userMsg]);
    setShowDemoOptions(false);

    setTimeout(async () => {
      await updateChat([
        ...messages,
        userMsg,
        {
          type: "system",
          text: `Simulated response for: ${text}`,
          query: text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      setShowDemoOptions(true);
    }, 800);
  };

  const newChat = () => {
    const nextIndex = chats.length;
    setChats([...chats, { title: t.newChat, messages: [], firestoreId: null }]);
    setActiveChatIndex(nextIndex);
    activeChatIndexRef.current = nextIndex;
  };

  const clearChatAt = async (index) => {
    const updated = [...chats];
    updated[index].messages = [];
    setChats(updated);
    setMenuOpen(null);

    if (updated[index].firestoreId) {
      await updateDoc(doc(db, "chats", updated[index].firestoreId), {
        messages: [],
        updatedAt: serverTimestamp(),
      });
    }
  };

  const deleteChatAt = async (index) => {
    const chatToDelete = chats[index];

    if (chatToDelete.firestoreId) {
      await deleteDoc(doc(db, "chats", chatToDelete.firestoreId));
    }

    const updated = chats.filter((_, i) => i !== index);
    setChats(
      updated.length
        ? updated
        : [{ title: t.newChat, messages: [], firestoreId: null }]
    );
    setActiveChatIndex(0);
    activeChatIndexRef.current = 0;
    setMenuOpen(null);
  };

  const renameChat = async (index) => {
    const updated = [...chats];
    updated[index].title = renameValue || "Untitled";
    setChats(updated);
    setRenamingIndex(null);

    if (updated[index].firestoreId) {
      await updateDoc(doc(db, "chats", updated[index].firestoreId), {
        title: updated[index].title,
        updatedAt: serverTimestamp(),
      });
    }
  };

  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowChat(false);
  };

  return (
    <div className="chat-layout">
      <aside className={`chat-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-top-controls">
            <div className="back-btn chat-back-btn" onClick={() => setShowChat(false)}>
              <ArrowLeftCircle />
            </div>

            <div className="close-btn" onClick={() => setSidebarOpen(false)}>
              ✕
            </div>
          </div>

          <div className="sidebar-brand">
            <div className="chat-brand">
              <Scale size={20} />
            </div>
            <span>{t.appName}</span>
          </div>
        </div>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="mode-select"
        >
          <option value="simple">{t.simple}</option>
          <option value="detailed">{t.detailed}</option>
        </select>

        <button className="new-chat-btn" onClick={newChat}>
          <Plus size={20} />
          {t.newChat}
        </button>

        <div className="chat-history">
          {chats.map((chat, i) => (
            <div
              key={chat.firestoreId || i}
              className={`chat-recent ${i === activeChatIndex ? "active" : ""}`}
              onClick={() => {
                setActiveChatIndex(i);
                activeChatIndexRef.current = i;
              }}
            >
              {renamingIndex === i ? (
                <input
                  className="rename-input"
                  value={renameValue}
                  autoFocus
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => renameChat(i)}
                  onKeyDown={(e) => e.key === "Enter" && renameChat(i)}
                />
              ) : (
                <span className="chat-title">{chat.title}</span>
              )}

              <button
                className="chat-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === i ? null : i);
                }}
              >
                ⋯
              </button>

              {menuOpen === i && (
                <div className="chat-menu">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingIndex(i);
                      setRenameValue(chat.title);
                      setMenuOpen(null);
                    }}
                  >
                    {t.rename}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearChatAt(i);
                    }}
                  >
                    {t.clear}
                  </button>

                  <button
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatAt(i);
                    }}
                  >
                    {t.delete}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {!isDemo && (
          <div className="sidebar-bottom">
            <button onClick={handleLogout}>{t.logout}</button>
          </div>
        )}
      </aside>

      <div className="chat-main">
        <div className="chat-header">
          <div className="header-left">
            <button
              title="Close Sidebar"
              className="menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <PanelLeft size={26} />
            </button>

            <select className="mode-select">
              <option value="v1">NyayaSetu v1</option>
              <option value="v2">NyayaSetu v2</option>
            </select>
          </div>
        </div>

        <div className="chat-body">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.type}`}>
                <div>{msg.text}</div>

                {msg.type === "system" && !isDemo && (
                  <div className="feedback-stars">
                    <span className="feedback-label">{t.feedback}:</span>

                    {[1, 2, 3, 4, 5].map((rating) => {
                      const messageKey = getMessageKey(msg);
                      const selected = ratings[messageKey];
                      const current = selected ?? (hoverRatings[messageKey] ?? 0);

                      return (
                        <span
                          key={rating}
                          className={`feedback-star ${
                            current >= rating ? "active" : ""
                          } ${selected ? "disabled" : ""}`}
                          onClick={() => {
                            if (!selected) {
                              saveFeedback(msg, rating, messageKey);
                            }
                          }}
                          onMouseEnter={() => {
                            if (!selected) {
                              setHoverRatings((prev) => ({
                                ...prev,
                                [messageKey]: rating,
                              }));
                            }
                          }}
                          onMouseLeave={() => {
                            if (!selected) {
                              setHoverRatings((prev) => ({
                                ...prev,
                                [messageKey]: 0,
                              }));
                            }
                          }}
                          title={
                            selected
                              ? `You rated ${selected} star`
                              : `${rating} star`
                          }
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {loading && <div className="chat-bubble system">Thinking...</div>}

            <div ref={messagesEndRef} />
          </div>

          {isDemo && (
            <div className="demo-bottom">
              <div className="demo-options-row">
                {DEMO_OPTIONS.map((q, i) => (
                  <div
                    key={i}
                    className="demo-option"
                    onClick={() => handleDemoClick(q)}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={isDemo || loading}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={handleVoice} disabled={isDemo || loading}>
              <Mic size={20} />
            </button>

            <button onClick={sendMessage} disabled={isDemo || loading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}