import React, { useState, useEffect, useRef } from 'react';
import { chatbotService } from '../../firebase/services';
import './Pikachu.css';

const Pikachu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '⚡ Pika Pika! I\'m Pikachu, your NXRA Portal assistant! How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadFAQs();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadFAQs = async () => {
    try {
      const data = await chatbotService.getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findBestMatch = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Direct keyword matching
    const matches = faqs.filter(faq => {
      const questionMatch = faq.question?.toLowerCase().includes(lowerQuery);
      const answerMatch = faq.answer?.toLowerCase().includes(lowerQuery);
      const keywordMatch = faq.keywords?.some(keyword => 
        lowerQuery.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(lowerQuery)
      );
      return questionMatch || answerMatch || keywordMatch;
    });

    if (matches.length > 0) {
      return matches[0].answer;
    }

    // Fallback responses based on common queries
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return '⚡ Pika! Hello there! How can I assist you with the NXRA Portal today?';
    }
    
    if (lowerQuery.includes('invoice')) {
      return '📄 To create an invoice, go to Finance → Invoices → Generate Invoice. You can auto-fetch client details from the CRM!';
    }
    
    if (lowerQuery.includes('task')) {
      return '✅ For task management, visit the Management Panel → Task Management. You can create, assign, and track tasks there!';
    }
    
    if (lowerQuery.includes('client')) {
      return '👥 Manage clients in the Client CRM section. You can add, edit, and track all client information there!';
    }
    
    if (lowerQuery.includes('r&d') || lowerQuery.includes('research')) {
      return '🔬 Visit the R&D Tracker to submit weekly updates, track research progress, and manage projects!';
    }
    
    if (lowerQuery.includes('marketing') || lowerQuery.includes('campaign')) {
      return '📢 Head to the Marketing section to create campaigns, manage the festival calendar, and track marketing activities!';
    }
    
    if (lowerQuery.includes('salary') || lowerQuery.includes('payroll')) {
      return '💰 Salary management is available in Finance → Salary. The system calculates pay based on task logs!';
    }
    
    if (lowerQuery.includes('kpi') || lowerQuery.includes('performance')) {
      return '📊 Check the Management Panel → KPI Dashboard to view department performance metrics and overall statistics!';
    }

    return '⚡ Pika? I\'m not sure about that. Could you rephrase your question or ask about: Invoices, Tasks, Clients, R&D, Marketing, or KPIs?';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    // Simulate thinking delay
    setTimeout(async () => {
      const response = findBestMatch(inputMessage);
      
      const botMessage = {
        type: 'bot',
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setLoading(false);

      // Save to Firebase
      try {
        await chatbotService.saveChatHistory({
          userId: 'current-user',
          message: inputMessage,
          response: response,
          sessionId: Date.now().toString()
        });
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }, 800);
  };

  const quickQuestions = [
    'How do I create an invoice?',
    'How do I assign a task?',
    'Where is the KPI dashboard?',
    'How do I add a client?'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`pikachu-fab ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '⚡'}
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="pikachu-chat-widget">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="pikachu-avatar">⚡</div>
              <div>
                <h3>Pikachu Assistant</h3>
                <span className="status">Online • Always here to help!</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === 'bot' && <div className="message-avatar">⚡</div>}
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {message.type === 'user' && <div className="message-avatar">👤</div>}
              </div>
            ))}
            
            {loading && (
              <div className="message bot">
                <div className="message-avatar">⚡</div>
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              <div className="quick-buttons">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="quick-btn"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Pikachu anything..."
              className="chat-input"
              disabled={loading}
            />
            <button type="submit" className="send-btn" disabled={loading || !inputMessage.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Pikachu;
