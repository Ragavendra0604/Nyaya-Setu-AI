import React from 'react';
import { Send, Scale, Languages, HelpCircle, Mic, Paperclip, ChevronUp, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from '../components/Sidebar';

const ChatUI = ({ 
  messages, 
  input, 
  setInput, 
  handleSend, 
  isLoading, 
  messagesEndRef, 
  evaluations, 
  setEvaluations, 
  handleEvaluate,
  language,
  setLanguage,
  mode,
  setMode,
  navigate,
  clearChat
}) => {
  return (
    <div className="app-container">
      <Sidebar 
        language={language}
        setLanguage={setLanguage}
        mode={mode}
        setMode={setMode}
        navigate={navigate}
        clearChat={clearChat}
      />

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
            <div style={{ textAlign: 'center', margin: '4rem auto', color: 'var(--text-muted)' }}>
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

                {!msg.isUser && !msg.isError && (() => {
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
};

export default ChatUI;
