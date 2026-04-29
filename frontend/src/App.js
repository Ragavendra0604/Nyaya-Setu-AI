import React, { useState, useEffect, useRef } from 'react';
import LanguageSelection from './views/LanguageSelection';
import Dashboard from './views/Dashboard';
import ChatUI from './views/ChatUI';
import { aiService } from './services/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [mode, setMode] = useState('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [currentView, setCurrentView] = useState('language-selection'); // language-selection | dashboard | chat
  const messagesEndRef = useRef(null);

  const navigate = (view) => {
    setCurrentView(view);
    window.history.pushState({ view }, '', `/#${view}`);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView('language-selection');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ view: currentView }, '', `/#${currentView}`);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem('nyayasetu_messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

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
      const data = await aiService.askQuestion(currentInput, language, mode);
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
      const data = await aiService.evaluateResponse(userText, msgMode || mode, aiText);
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

  if (currentView === 'language-selection') {
    return <LanguageSelection setLanguage={setLanguage} navigate={navigate} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard language={language} navigate={navigate} setInput={setInput} />;
  }

  return (
    <ChatUI 
      messages={messages}
      input={input}
      setInput={setInput}
      handleSend={handleSend}
      isLoading={isLoading}
      messagesEndRef={messagesEndRef}
      evaluations={evaluations}
      setEvaluations={setEvaluations}
      handleEvaluate={handleEvaluate}
      language={language}
      setLanguage={setLanguage}
      mode={mode}
      setMode={setMode}
      navigate={navigate}
      clearChat={clearChat}
    />
  );
}

export default App;
