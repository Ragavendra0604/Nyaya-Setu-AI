import { useState, useEffect, useRef } from "react";
import "./chat.css";
import logo from "../assets/app_logo.png";
import { ArrowLeftCircle, Scale, Plus, PanelLeft, Mic, Send } from "lucide-react";

const DEMO_OPTIONS = [
  "FIR Filing Guidance",
  "Accessing Legal Aid",
  "Tenant Rights & Dispute",
];

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
  },
};

const DEMO_OPTIONS_MAP = {
  en: [
    "FIR Filing Guidance",
    "Accessing Legal Aid",
    "Tenant Rights & Dispute",
  ],
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

export default function ChatPage({ selectedLanguage, isDemo, goBack, setShowChat }) {

  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768
  );
  const [model, setModel] = useState("NyayaSetu v1");
  const [menuOpen, setMenuOpen] = useState(null);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showDemoOptions, setShowDemoOptions] = useState(isDemo);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chat_history");
    return saved
      ? JSON.parse(saved)
      : [{ title: "New Chat", messages: [] }];
  });

  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("simple");

  const messages = chats[activeChatIndex]?.messages || [];
  const messagesEndRef = useRef(null);

  const lang = localStorage.getItem("lang") || "en";
  const t = TEXT[lang] || TEXT.en;
  const DEMO_OPTIONS = DEMO_OPTIONS_MAP[lang] || DEMO_OPTIONS_MAP.en;

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(chats));
  }, [chats]);

  const updateChat = (newMessages) => {
    const updated = [...chats];
    updated[activeChatIndex].messages = newMessages;
    setChats(updated);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      type: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setInput("");
    updateChat([...messages, userMsg]);

    setTimeout(() => {
      updateChat([
        ...messages,
        userMsg,
        {
          type: "system",
          text:
            mode === "simple"
              ? "Simple legal answer."
              : "Detailed legal explanation for your query.",
        },
      ]);
    }, 800);
  };

  const handleDemoClick = (text) => {
    const userMsg = { type: "user", text };

    updateChat([...messages, userMsg]);

    setShowDemoOptions(false); // hide options while loading

    setTimeout(() => {
      updateChat([
        ...messages,
        userMsg,
        {
          type: "system",
          text: `Simulated response for: ${text}`,
        },
      ]);

      setShowDemoOptions(true); // show options again
    }, 800);
  };

  const newChat = () => {
    setChats([
      ...chats,
      { title: t.newChat, messages: [] }
    ]);
    setActiveChatIndex(chats.length);
  };

  const clearChatAt = (index) => {
    const updated = [...chats];
    updated[index].messages = [];
    setChats(updated);
    setMenuOpen(null);
  };

  const deleteChatAt = (index) => {
    const updated = chats.filter((_, i) => i !== index);
    setChats(updated.length ? updated : [{ title: "New Chat", messages: [] }]);
    setActiveChatIndex(0);
    setMenuOpen(null);
  };

  const renameChat = (index) => {
    const updated = [...chats];
    updated[index].title = renameValue || "Untitled";
    setChats(updated);
    setRenamingIndex(null);
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

  return (
  <div className="chat-layout">
    <aside className={`chat-sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-top-controls">
          <div
            className="back-btn chat-back-btn"
            onClick={() => setShowChat(false)}
          >
            <ArrowLeftCircle />
          </div>

          <div
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
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
            key={i}
            className={`chat-recent ${i === activeChatIndex ? "active" : ""}`}
            onClick={() => setActiveChatIndex(i)}
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
          <button>{t.logout}</button>
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
              {msg.text}
            </div>
          ))}

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
            disabled={isDemo} 
          />

          <button onClick={handleVoice} disabled={isDemo}>
            <Mic size={20} />
          </button>

          <button onClick={sendMessage} disabled={isDemo}>
            <Send size={20} />
          </button>
        </div>

      </div>
    </div>
  </div>
);
}