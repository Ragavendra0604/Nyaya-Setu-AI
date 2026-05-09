import { useState, useEffect, useRef } from "react";
import "./chat.css";
import { ArrowLeftCircle, Scale, Plus, PanelLeft, Mic, Send, User, LogOut, Paperclip, X, ShieldCheck, CheckCircle, AlertCircle, Volume2, VolumeX, Sparkles } from "lucide-react";
import { signOut } from "firebase/auth";
import {
  createChat,
  getUserChats,
  sendMessage as sendLegalQuery,
  updateChatTitle,
  deleteChat,
  clearChat,
  rateMessage,
  evaluateResponse,
} from "../services/api";
import { useTranslation } from "react-i18next";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Image, FileText, Camera } from "lucide-react";

export default function ChatPage({
  selectedLanguage,
  isDemo,
  setShowChat,
  currentUser,
  userProfile,
  setShowProfile,
}) {
  const { t } = useTranslation("chat");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [menuOpen, setMenuOpen] = useState(null);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showDemoOptions, setShowDemoOptions] = useState(isDemo);

  const [chats, setChats] = useState([
    { chatId: null, title: "New Chat", messages: [] },
  ]);

  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const activeChatIndexRef = useRef(0);

  const [input, setInput] = useState("");
  const [mode, setMode] = useState(userProfile?.mode || "simple");
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});

  const getMessageKey = (msg) => {
    return msg.id || `${msg.time}-${msg.text?.substring(0, 20)}`;
  };

  const messages = chats[activeChatIndex]?.messages || [];
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const [speakingId, setSpeakingId] = useState(null);
  const synthRef = useRef(window.speechSynthesis);

  const lang = selectedLanguage || localStorage.getItem("lang") || "en";

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
        const response = await getUserChats(currentUser.uid);
        if (response.ok && response.chats && response.chats.length > 0) {
          // Map backend format (role/content) to frontend format (type/text)
          const transformed = response.chats.map((chat) => ({
            ...chat,
            messages: (chat.messages || []).map((m) => {
              let displayContent = m.query || m.content || m.text;

              if (m.role === "user" && displayContent?.startsWith("Please analyze this")) {
                displayContent = "[Document Attachment]";
              }

              return {
                type: m.role === "user" ? "user" : "system",
                text: displayContent,
                time: m.timestamp
                  ? new Date(
                    m.timestamp._seconds
                      ? m.timestamp._seconds * 1000
                      : m.timestamp
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : m.time,
                id: m.id,
                rating: m.rating,
              };
            }),
          }));

          setChats(prev => {
            // Try to keep current chat active if it's still there
            const currentChatId = prev[activeChatIndex]?.chatId;
            if (currentChatId) {
              const newIndex = transformed.findIndex(c => c.chatId === currentChatId);
              if (newIndex !== -1) setActiveChatIndex(newIndex);
            }
            return transformed;
          });
        } else {
          setChats([{ title: t("newChat"), messages: [], chatId: null }]);
          setActiveChatIndex(0);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [currentUser, isDemo]);

  // Feedback is now handled via rateMessage API

  const updateChatMessages = (index, newMessages, chatId = null) => {
    setChats((prevChats) => {
      const updated = [...prevChats];
      updated[index] = {
        ...updated[index],
        messages: newMessages,
        chatId: chatId || updated[index].chatId,
      };
      return updated;
    });
  };

  const handleSpeak = (text, id) => {
    if (speakingId === id) {
      synthRef.current.cancel();
      setSpeakingId(null);
      return;
    }

    // Cancel any previous speech
    synthRef.current.cancel();

    // Clean text for speech (remove markdown symbols)
    const cleanText = text.replace(/[#*`_~]/g, '').substring(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Map languages to speech codes
    const voiceMap = {
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'en': 'en-US'
    };

    utterance.lang = voiceMap[lang] || 'en-US';

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const handleRate = async (msgIndex, rating) => {
    const chat = chats[activeChatIndex];
    if (!chat || !chat.chatId) return;

    const msg = chat.messages[msgIndex];
    if (!msg || !msg.id) return;

    try {
      const res = await rateMessage(chat.chatId, msg.id, rating);
      if (res.ok) {
        const updatedChats = [...chats];
        updatedChats[activeChatIndex].messages[msgIndex].rating = rating;
        setChats(updatedChats);
        toast.success("Feedback saved");
      }
    } catch (error) {
      console.error("Rating error:", error);
      toast.error("Failed to save feedback");
    }
  };

  const sendMessage = async (overrideInput = null) => {
    const queryText = overrideInput || input;
    if ((!queryText.trim() && !attachedFile) || loading) return;

    const userMsg = {
      type: "user",
      text: queryText,
      attachment: attachedFile ? {
        url: previewUrl,
        name: attachedFile.name,
        type: attachedFile.type,
        size: (attachedFile.size / 1024).toFixed(1) + ' KB'
      } : null,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (!overrideInput) setInput("");
    setPreviewUrl(null); // Clear preview
    setLoading(true);

    const index = activeChatIndexRef.current;
    let currentChatId = chats[index]?.chatId;
    const messagesWithUser = [...(chats[index]?.messages || []), userMsg];

    // Update UI immediately with user message
    updateChatMessages(index, messagesWithUser);

    try {
      // 1. Create chat if it doesn't exist
      if (!currentChatId && !isDemo) {
        const title = queryText.slice(0, 25);
        const createRes = await createChat(currentUser.uid, title);
        if (createRes.ok) {
          currentChatId = createRes.chat.chatId;
          setChats(prev => {
            const updated = [...prev];
            updated[index].chatId = currentChatId;
            updated[index].title = title;
            return updated;
          });
        }
      }

      // 2. Send message to backend (which calls AI)
      const response = await sendLegalQuery(
        currentChatId || "demo-chat",
        queryText,
        lang,
        mode,
        isDemo,
        attachedFile
      );

      if (response && response.ok && response.assistantMessage) {
        setAttachedFile(null);
        const systemMsg = {
          type: "system",
          id: response.assistantMessage.id,
          text: response.assistantMessage.content || response.answer || "No response received.",
          query: queryText,
          pipeline_steps: response.pipeline_steps || [],
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        updateChatMessages(index, [...messagesWithUser, systemMsg], currentChatId);
      } else {
        // Handle server-side errors (500, 400 etc)
        const errorMessage = response?.error || "Failed to get AI response. Please try again.";
        toast.error(errorMessage);

        const errorMsg = {
          type: "system",
          text: `Error: ${errorMessage}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        updateChatMessages(index, [...messagesWithUser, errorMsg]);
      }
    } catch (error) {
      console.error("Send message error:", error);
      const errorMsg = {
        type: "system",
        text: "Sorry, something went wrong. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      updateChatMessages(index, [...messagesWithUser, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const saveFeedback = async (msg, rating, messageKey) => {
    if (ratings[messageKey]) {
      toast.error("Feedback already submitted");
      return;
    }

    const index = activeChatIndexRef.current;
    const chatId = chats[index]?.chatId;
    const messageId = msg.id;

    if (!chatId || !messageId) {
      toast.error("Cannot save feedback for this message");
      return;
    }

    try {
      const res = await rateMessage(chatId, messageId, rating);
      if (res.ok) {
        setRatings((prev) => ({
          ...prev,
          [messageKey]: rating,
        }));
        toast.success("Feedback saved");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Failed to save feedback");
    }
  };

  const handleDemoClick = (text) => {
    setShowDemoOptions(false);
    sendMessage(text);
    setTimeout(() => {
      setShowDemoOptions(true);
    }, 2000);
  };

  const newChat = () => {
    // If current chat is empty and has no ID, don't create another one
    if (chats[activeChatIndex]?.messages.length === 0 && !chats[activeChatIndex]?.chatId) {
      return;
    }
    const nextIndex = chats.length;
    setChats([...chats, { title: t("newChat"), messages: [], chatId: null }]);
    setActiveChatIndex(nextIndex);
    activeChatIndexRef.current = nextIndex;
  };

  const clearChatAt = async (index) => {
    const chatId = chats[index]?.chatId;
    if (!chatId) return;

    try {
      const res = await clearChat(chatId);
      if (res.ok) {
        const updated = [...chats];
        updated[index].messages = [];
        setChats(updated);
      }
    } catch (error) {
      console.error("Clear chat error:", error);
    }
    setMenuOpen(null);
  };

  const deleteChatAt = async (index) => {
    const chatId = chats[index]?.chatId;

    if (chatId) {
      try {
        await deleteChat(chatId);
      } catch (error) {
        console.error("Delete chat error:", error);
      }
    }

    const updated = chats.filter((_, i) => i !== index);
    setChats(
      updated.length
        ? updated
        : [{ title: t("newChat"), messages: [], chatId: null }]
    );
    setActiveChatIndex(0);
    activeChatIndexRef.current = 0;
    setMenuOpen(null);
  };

  const renameChat = async (index) => {
    const chatId = chats[index]?.chatId;
    const newTitle = renameValue || "Untitled";

    if (chatId) {
      try {
        await updateChatTitle(chatId, newTitle);
      } catch (error) {
        console.error("Rename chat error:", error);
      }
    }

    const updated = [...chats];
    updated[index].title = newTitle;
    setChats(updated);
    setRenamingIndex(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([audioBlob], "VoiceMessage.webm", { type: 'audio/webm' });

        // Auto-send or attach
        setAttachedFile(file);
        toast.success("Voice recording captured!");

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Recording failed:", err);
      toast.error("Microphone access denied or error occurred.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const handleVoice = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowChat(false);
    toast.success("Logged out successfully");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setAttachedFile(file);
      toast.success(`Attached: ${file.name}`);
    }
  };

  const handleEvaluate = async (msgIndex) => {
    const systemMsg = messages[msgIndex];
    // Find the user query that preceded this assistant response
    let userQuery = "";
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].type === "user") {
        userQuery = messages[i].text;
        break;
      }
    }

    if (!userQuery || !systemMsg.text) return;

    setEvaluatingId(msgIndex);
    try {
      const res = await evaluateResponse(userQuery, systemMsg.text, mode);
      if (res.evaluation) {
        setEvaluations(prev => ({ ...prev, [msgIndex]: res.evaluation }));
        toast.success("Evaluation complete!");
      }
    } catch (error) {
      toast.error("Evaluation failed");
    } finally {
      setEvaluatingId(null);
    }
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
              ✖
            </div>
          </div>

          <div className="sidebar-brand">
            <div className="chat-brand">
              <Scale size={20} />
            </div>
            <span>{t("appName")}</span>
          </div>
        </div>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="mode-select"
        >
          <option value="simple">{t("simple")}</option>
          <option value="detailed">{t("detailed")}</option>
        </select>

        <button className="new-chat-btn" onClick={newChat}>
          <Plus size={20} />
          {t("newChat")}
        </button>

        <div className="chat-history">
          {chats.map((chat, i) => (
            <div
              key={chat.chatId || i}
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
                    {t("rename")}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearChatAt(i);
                    }}
                  >
                    {t("clear")}
                  </button>

                  <button
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatAt(i);
                    }}
                  >
                    {t("delete")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {!isDemo && (
          <div className="sidebar-bottom">
            <button className="profile-btn-sidebar" onClick={() => setShowProfile(true)}>
              <User size={18} /> {t("profile") || "Profile"}
            </button>
            <button className="logout-btn-sidebar" onClick={handleLogout}>
              <LogOut size={18} /> {t("logout")}
            </button>
          </div>
        )}
      </aside>

      <div
        className={`chat-main ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="drag-overlay">
            <div className="drag-content">
              <Plus size={48} />
              <p>Drop your documents or images here</p>
            </div>
          </div>
        )}
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
                <div className="chat-bubble-content">
                  {msg.attachment && (
                    <div
                      className={`media-block ${msg.attachment.type.startsWith('image/') ? 'image-type' : 'file-type'}`}
                      onClick={() => setFullScreenImage(msg.attachment)}
                    >
                      {msg.attachment.type.startsWith('image/') ? (
                        <img
                          src={msg.attachment.url}
                          alt="attachment"
                          className="message-thumbnail"
                        />
                      ) : (
                        <div className="file-card">
                          <div className="file-icon">
                            <FileText size={24} />
                          </div>
                          <div className="file-info">
                            <span className="file-name">{msg.attachment.name}</span>
                            <span className="file-size">{msg.attachment.size}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {msg.type === "system" ? (
                    <>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                      {msg.pipeline_steps && msg.pipeline_steps.length > 0 && (
                        <div className="message-pipeline">
                          <div className="pipeline-toggle" onClick={(e) => {
                            const target = e.currentTarget.nextElementSibling;
                            target.classList.toggle('visible');
                          }}>
                            <Sparkles size={12} /> View Analysis Process
                          </div>
                          <div className="pipeline-steps-list">
                            {msg.pipeline_steps.map((step, sIdx) => (
                              <div key={sIdx} className="pipeline-step-item">
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    msg.text
                  )}
                </div>

                {msg.type === "system" && !isDemo && (
                  <div className="message-actions">
                    <div className="feedback-stars">
                      <span className="feedback-label">{t("feedback")}:</span>

                      {[1, 2, 3, 4, 5].map((rating) => {
                        const messageKey = getMessageKey(msg);
                        const selected = ratings[messageKey] || msg.rating;
                        const active = (hoverRatings[messageKey] || selected) >= rating;

                        return (
                          <span
                            key={rating}
                            className={`feedback-star ${active ? "active" : ""} ${selected ? "disabled" : ""}`}
                            onClick={() => {
                              if (!selected) {
                                handleRate(i, rating);
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

                    <div className="message-actions-right">
                      <button
                        className={`action-icon-btn ${speakingId === i ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(msg.text, i)}
                        title="Read out loud"
                      >
                        {speakingId === i ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>

                      <button
                        className={`evaluate-btn ${evaluations[i] ? 'evaluated' : ''}`}
                        onClick={() => !evaluations[i] && handleEvaluate(i)}
                        disabled={evaluatingId === i}
                      >
                        {evaluatingId === i ? (
                          "Evaluating..."
                        ) : evaluations[i] ? (
                          <><CheckCircle size={14} /> Result Checked</>
                        ) : (
                          <><ShieldCheck size={14} /> Verify Logic</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {evaluations[i] && (
                  <div className="evaluation-result">
                    <button
                      className="close-evaluation"
                      onClick={() => {
                        const updated = { ...evaluations };
                        delete updated[i];
                        setEvaluations(updated);
                      }}
                      title="Close evaluation"
                    >
                      <X size={14} />
                    </button>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {evaluations[i]}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble system thinking-bubble">
                <div className="pipeline-tracker-ui">
                  <div className="pipeline-header">
                    <div className="loader-spinner"></div>
                    <span>NyayaSetu is processing...</span>
                  </div>
                  <div className="pipeline-live-steps">
                    <div className="live-step active">
                      <span className="step-icon">🔄</span>
                      <span className="step-text">Initializing Legal Engine...</span>
                    </div>
                    {attachedFile && (
                      <div className="live-step delayed-1">
                        <span className="step-icon">🔍</span>
                        <span className="step-text">Extracting Document Evidence...</span>
                      </div>
                    )}
                    {(attachedFile?.type.startsWith('audio/') || attachedFile?.name.endsWith('.webm')) && (
                      <div className="live-step delayed-2">
                        <span className="step-icon">🎙️</span>
                        <span className="step-text">Transcribing Voice Input...</span>
                      </div>
                    )}
                    <div className="live-step delayed-3">
                      <span className="step-icon">🧠</span>
                      <span className="step-text">Applying Legal Reasoning...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showDemoOptions && (
            <div className="demo-bottom">
              <div className="demo-options-row">
                {(t("demoOptions", { returnObjects: true }) || []).map((q, j) => (
                  <div
                    key={j}
                    className="demo-option"
                    onClick={() => handleDemoClick(q)}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-wrapper">
          {showUploadMenu && (
            <div className="upload-menu">
              <button onClick={() => { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); setShowUploadMenu(false); }}>
                <Image size={18} /> Photos & Videos
              </button>
              <button onClick={() => { fileInputRef.current.accept = "audio/*"; fileInputRef.current.click(); setShowUploadMenu(false); }}>
                <Mic size={18} /> Audio
              </button>
              <button onClick={() => { fileInputRef.current.accept = ".pdf,.doc,.docx,.txt"; fileInputRef.current.click(); setShowUploadMenu(false); }}>
                <FileText size={18} /> Documents
              </button>
              <button onClick={() => { toast.error("Camera access not implemented"); setShowUploadMenu(false); }}>
                <Camera size={18} /> Camera
              </button>
            </div>
          )}

          {attachedFile && (
            <div className="file-preview-bar">
              <span className="file-name">📌 {attachedFile.name}</span>
              <button className="remove-file" onClick={() => setAttachedFile(null)}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="chat-input">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAttachedFile(file);
                  if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                  } else {
                    setPreviewUrl(null);
                  }
                  toast.success(`Attached: ${file.name}`);
                  e.target.value = ""; // Reset value to allow selecting same file again
                }
              }}
            />
            <button
              className={`upload-btn-plus ${showUploadMenu ? 'active' : ''}`}
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              disabled={isDemo || loading}
            >
              <Plus size={24} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              disabled={isDemo || loading}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={handleVoice}
              disabled={loading}
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
            >
              {isRecording ? (
                <div className="recording-indicator">
                  <span className="rec-dot"></span>
                  <span className="rec-time">{Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}</span>
                </div>
              ) : (
                <Mic size={20} />
              )}
            </button>

            <button onClick={() => sendMessage()} disabled={isDemo || loading}>
              <Send size={20} />
            </button>
          </div>
          <div className="chat-disclaimer">
            NyayaSetu can make mistakes. Consider checking important information.
          </div>
        </div>

        {fullScreenImage && (
          <div className="fullscreen-overlay" onClick={() => setFullScreenImage(null)}>
            <div className="fullscreen-content" onClick={e => e.stopPropagation()}>
              {fullScreenImage.type?.startsWith('image/') ? (
                <img src={fullScreenImage.url} alt="full screen" />
              ) : (
                <div className="doc-preview-modal">
                  <FileText size={64} className="doc-preview-icon" />
                  <h2>{fullScreenImage.name}</h2>
                  <p>{fullScreenImage.size} • {fullScreenImage.type?.split('/')[1]?.toUpperCase()}</p>
                  <div className="doc-preview-actions">
                    <span className="doc-status">Document Processed & Analyzed</span>
                  </div>
                </div>
              )}
              <button className="close-fullscreen" onClick={() => setFullScreenImage(null)}>
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

