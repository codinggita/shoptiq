import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NegotiatorBot.css';

const NegotiatorBot = ({ isOpen, onClose, product }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: `Welcome to Shoptiq Intel. I'm your Unified Commerce Assistant. How can I assist your enterprise operations today?`,
      suggestions: ['Negotiate a Deal', 'Check Order Status', 'Shipping Logistics', 'Return Policy']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState('general'); // general, negotiation, service
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (textOverride) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Intent Detection & Logic
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = getBotResponse(text);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: botResponse.text, 
        action: botResponse.action,
        suggestions: botResponse.suggestions 
      }]);
    }, 1200);
  };

  const getBotResponse = (input) => {
    const query = input.toLowerCase();
    
    // Intent Detection
    if (query.includes('negotiate') || query.includes('price') || query.includes('discount') || query.includes('offer')) {
      setContext('negotiation');
      const val = parseFloat(input.replace(/[^0-9.]/g, ''));
      const currentPrice = product?.price || 4500;

      if (isNaN(val)) {
        return { 
          text: `I can certainly help you optimize the unit cost for the ${product?.name || 'requested asset'}. What target price are you aiming for?`,
          suggestions: ['₹4,000', '₹3,800', 'Bulk Quote']
        };
      }

      if (val < currentPrice * 0.6) {
        return { 
          text: `A price of ₹${val} is below our margin threshold for low-volume orders. However, if you commit to 10+ units, I can unlock a Tier-3 pricing at ₹${(currentPrice * 0.72).toFixed(0)}. Shall I draft a purchase order?`, 
          action: 'bulk_tier',
          suggestions: ['Draft PO', 'Compare Tiers']
        };
      } else if (val < currentPrice * 0.9) {
        return { 
          text: `We can't quite hit ₹${val} for immediate delivery, but I can authorize an "Early Mover" discount to ₹${(currentPrice * 0.88).toFixed(0)} if you finalize in the next 15 minutes.`, 
          action: 'counter_offer',
          suggestions: ['Accept Offer', 'Counter at ₹' + (val + 100)]
        };
      } else {
        return { 
          text: `That's a reasonable offer. I've logged your bid of ₹${val} in the Smart Contract ledger and notified the regional fulfillment manager.`, 
          action: 'sent',
          suggestions: ['View My Bids', 'Contact Seller']
        };
      }
    }

    if (query.includes('status') || query.includes('order') || query.includes('track')) {
      setContext('service');
      return { 
        text: "Your most recent order (#STQ-8842) is currently in the 'Transit' phase. Estimated delivery to Manhattan Hub: Tomorrow, 10:45 AM.",
        suggestions: ['Track Live', 'Contact Carrier']
      };
    }

    if (query.includes('return') || query.includes('refund') || query.includes('exchange')) {
      setContext('service');
      return { 
        text: "Our Unified Commerce policy allows for instant returns within 14 days. Since we use AR Try-On, your return risk is low, but we offer a 'no-questions-asked' credit for enterprise partners.",
        suggestions: ['Start Return', 'Policy Details']
      };
    }

    if (query.includes('shipping') || query.includes('delivery')) {
      setContext('service');
      return { 
        text: "We offer Hyper-Local delivery within 2 hours for urban centers and Next-Day sync for regional warehouses. All shipments are tracked via our real-time inventory ledger.",
        suggestions: ['Shipping Rates', 'Warehouse Map']
      }
    }

    return { 
      text: "I'm trained on Shoptiq's commerce engine. I can help you negotiate prices, track logistics, or manage your store inventory. What's on your mind?",
      suggestions: ['Negotiate', 'Store Stats', 'Help Center']
    };
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="bot-overlay"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
    >
      <div className="bot-window">
        <header className="bot-header">
          <div className="bot-identity">
            <div className="bot-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 6v6l4 2"></path></svg>
            </div>
            <div>
              <strong>Shoptiq Intel AI</strong>
              <p>● ENTERPRISE MODE</p>
            </div>
          </div>
          <button className="close-bot-btn" onClick={onClose}>×</button>
        </header>

        <div className="bot-chat-area" ref={scrollRef}>
          <AnimatePresence mode='popLayout'>
            {messages.map(msg => (
              <motion.div 
                key={msg.id} 
                className={`chat-bubble-wrap ${msg.type}`}
                initial={{ opacity: 0, x: msg.type === 'bot' ? -20 : 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              >
                <div className="chat-bubble">
                  <div className="bubble-text">{msg.text}</div>
                  
                  {msg.suggestions && (
                    <div className="chip-container">
                      {msg.suggestions.map((chip, idx) => (
                        <motion.button 
                          key={idx} 
                          className="suggestion-chip"
                          whileHover={{ scale: 1.05, backgroundColor: 'var(--accent)', color: '#fff' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSend(chip)}
                        >
                          {chip}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {msg.action === 'bulk_tier' && (
                    <div className="bot-action-card">
                      <div className="tier-viz">
                        <div className="tier">1-4 units: ₹4,500</div>
                        <div className="tier highlighted">10+ units: ₹3,240</div>
                      </div>
                      <button className="btn-apply-tier">Unlock Bulk Price</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div 
              className="chat-bubble-wrap bot"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="chat-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="bot-input-area">
          <input 
            type="text" 
            placeholder="Type your query..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-msg-btn" onClick={() => handleSend()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        
        <footer className="bot-footer">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
           Smart Agent Encryption Active
        </footer>
      </div>
    </motion.div>
  );
};

export default NegotiatorBot;
