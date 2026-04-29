import React, { useState, useEffect, useRef } from 'react';
import { Send, Scale, Languages, History, HelpCircle, MessageSquare, Mic, Paperclip, AlertCircle, CheckCircle, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Hindi', label: 'Hindi (हिन्दी)' },
  { id: 'Tamil', label: 'Tamil (தமிழ்)' }
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [mode, setMode] = useState('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const messagesEndRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('nyayasetu_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('nyayasetu_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isUser: true, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput, language, mode })
      });

      const data = await response.json();
      
      const aiMessage = { 
        text: data.answer || "I apologize, but I'm having trouble connecting to the legal database right now.", 
        isUser: false,
        mode: mode,
        language: language,
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "System Error: Please ensure the backend servers are running.", 
        isUser: false, 
        isError: true,
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async (msgIndex, aiText, userText, msgMode) => {
    setEvaluations(prev => ({ ...prev, [msgIndex]: { loading: true, result: null, open: true } }));
    try {
      const response = await fetch('http://localhost:5000/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: userText, mode: msgMode || mode, ai_response: aiText })
      });
      const data = await response.json();
      setEvaluations(prev => ({ ...prev, [msgIndex]: { loading: false, result: data.evaluation || data.error, open: true } }));
    } catch (err) {
      setEvaluations(prev => ({ ...prev, [msgIndex]: { loading: false, result: 'Evaluation service unavailable.', open: true } }));
    }
  };

  const clearChat = () => {
    setMessages([]);
    setEvaluations({});
    localStorage.removeItem('nyayasetu_messages');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Scale size={24} />
          </div>
          <div className="logo-text">
            <h1>NyayaSetu AI</h1>
            <p>Your Trustworthy Legal Guide</p>
          </div>
        </div>

        <div className="sidebar-section">
          <h2 className="section-title">Language</h2>
          {LANGUAGES.map(lang => (
            <div 
              key={lang.id}
              className={`nav-item ${language === lang.id ? 'active' : ''}`}
              onClick={() => setLanguage(lang.id)}
            >
              <Languages size={18} />
              <span>{lang.label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-section">
          <h2 className="section-title">Mode</h2>
          <div 
            className={`nav-item ${mode === 'simple' ? 'active' : ''}`}
            onClick={() => setMode('simple')}
          >
            <MessageSquare size={18} />
            <span>Simple</span>
          </div>
          <div 
            className={`nav-item ${mode === 'detailed' ? 'active' : ''}`}
            onClick={() => setMode('detailed')}
          >
            <Scale size={18} />
            <span>Detailed</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h2 className="section-title">Recent Chats</h2>
          <div className="nav-item">
            <MessageSquare size={18} />
            <span>FIR Process Help</span>
          </div>
          <div className="nav-item">
            <History size={18} />
            <span>Legal Aid Query</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" onClick={clearChat}>
            <AlertCircle size={18} />
            <span>Clear Conversation</span>
          </div>
          <div className="nav-item">
            <HelpCircle size={18} />
            <span>How to use?</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <header className="chat-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Legal Assistant</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981' }}>
              <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></div>
              Online
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="icon-btn"><Languages size={20} /></button>
            <button className="icon-btn"><HelpCircle size={20} /></button>
          </div>
        </header>

        <div className="messages-container">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
              <Scale size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
              <h3 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '0.5rem' }}>Namaste! How can I help you today?</h3>
              <p>Ask me about FIR procedures, Legal Aid, or your fundamental rights.</p>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content" style={msg.isUser ? { whiteSpace: 'pre-wrap' } : {}}>
                  {msg.isUser ? (
                    msg.text
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '8px', opacity: 0.7, textAlign: 'right' }}>
                  {msg.timestamp}
                </div>

                {/* Evaluate button — only for AI messages */}
                {!msg.isUser && !msg.isError && (() => {
                  // find the preceding user message
                  const prevUser = [...messages].slice(0, index).reverse().find(m => m.isUser);
                  const eval_ = evaluations[index];
                  return (
                    <div style={{ marginTop: '8px' }}>
                      <button
                        onClick={() => {
                          if (eval_?.open) {
                            setEvaluations(prev => ({ ...prev, [index]: { ...prev[index], open: false } }));
                          } else {
                            handleEvaluate(index, msg.text, prevUser?.text || '', msg.mode);
                          }
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          background: 'none', border: '1px solid #d1fae5',
                          borderRadius: '20px', padding: '3px 10px',
                          fontSize: '0.72rem', cursor: 'pointer',
                          color: '#065f46', fontWeight: 500
                        }}
                      >
                        {eval_?.loading
                          ? <><span className="dot" style={{ width: 5, height: 5 }} />Evaluating...</>
                          : eval_?.open
                            ? <><ChevronUp size={12} /> Hide Evaluation</>
                            : <><CheckCircle size={12} /> Evaluate Response</>
                        }
                      </button>
                      {eval_?.open && eval_?.result && (
                        <div style={{
                          marginTop: '8px', padding: '10px 12px',
                          background: '#f0fdf4', border: '1px solid #bbf7d0',
                          borderRadius: '8px', fontSize: '0.8rem',
                          whiteSpace: 'pre-wrap', color: '#1f2937'
                        }}>
                          {eval_.result}
                        </div>
                      )}
                    </div>
                  );
                })()}

              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="message ai-message">
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-container">
            <button className="icon-btn"><Paperclip size={20} /></button>
            <input 
              type="text" 
              className="legal-input" 
              placeholder="Ask your legal query here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="icon-btn" style={{ marginRight: '8px' }}><Mic size={20} /></button>
            <button className="action-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
