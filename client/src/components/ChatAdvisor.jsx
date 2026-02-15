import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ChatAdvisor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { role: 'assistant', content: 'Namaste! I am your India Tourism Guide AI. How can I help you plan your perfect trip today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = { role: 'user', content: message };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
            const response = await axios.post(`${baseUrl}/api/chat`, {
                message,
                history: history.slice(-5) // Send last 5 messages for context
            });

            setHistory(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setHistory(prev => [...prev, { role: 'assistant', content: 'Deepest apologies, but I am having trouble connecting right now. Please try again in a moment.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-advisor-wrapper">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="chat-window"
                    >
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="bot-avatar">
                                    <Sparkles size={16} color="white" />
                                </div>
                                <div>
                                    <h3>AI Travel Advisor</h3>
                                    <div className="status-indicator">
                                        <span className="dot"></span> Online
                                    </div>
                                </div>
                            </div>
                            <button className="chat-close" onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="chat-messages">
                            {history.map((msg, index) => (
                                <div key={index} className={`message-row ${msg.role}`}>
                                    <div className="message-icon">
                                        {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className="message-bubble">
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-row assistant">
                                    <div className="message-icon">
                                        <Bot size={16} />
                                    </div>
                                    <div className="message-bubble loading">
                                        <Loader2 size={16} className="animate-spin" />
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask about climate, trip plans..."
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !message.trim()}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className="chat-toggle-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && (
                    <span className="chat-badge">AI</span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatAdvisor;
