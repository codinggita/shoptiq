import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './GroupBuyDetail.css';

const GroupBuyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Alex C.', avatar: 'https://i.pravatar.cc/150?u=1', text: 'Has anyone used this model before? Thinking of getting 3 units.', time: '10:42 AM' },
    { id: 2, user: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?u=2', text: 'Yes, it is extremely reliable. We bought 10 last month.', time: '10:45 AM' },
    { id: 3, user: 'System', avatar: null, text: 'David joined the pool! 15 units left for next tier.', time: '11:00 AM', isSystem: true }
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleJoin = () => {
    setJoined(true);
    toast.success('Successfully joined the pool!');
    setChatMessages([
      ...chatMessages,
      { id: Date.now(), user: 'System', avatar: null, text: 'You joined the pool! 14 units left for next tier.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystem: true }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://ui-avatars.com/api/?name=Admin+Pro&background=4f46e5&color=fff',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setMessage('');
  };

  return (
    <div className="gbd-root animate-slide-in-3d">
      <header className="gbd-header">
        <button className="gbd-back-btn" onClick={() => navigate('/groupbuy')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Pools
        </button>
        <div className="gbd-title-area">
          <h1>Quantum X-Series Rack</h1>
          <span className="gbd-badge">Hardware</span>
        </div>
      </header>

      <div className="gbd-content-grid">
        {/* Pool Status Column */}
        <div className="gbd-status-card">
          <div className="gbd-product-img">
             <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" alt="Hardware" />
          </div>
          
          <div className="gbd-pricing">
             <span className="current-price">₹12,500</span>
             <span className="old-price">₹18,500</span>
             <span className="discount-tag">-32% TIER 2</span>
          </div>

          <div className="gbd-progress-section">
             <div className="gbd-progress-labels">
                <span>Unlocking Next Tier Discount (-45%)</span>
                <span>82%</span>
             </div>
             <div className="gbd-progress-bar">
                <div className="gbd-progress-fill" style={{ width: '82%' }}></div>
             </div>
             <p className="gbd-progress-hint">Only 18 more units needed to unlock ₹9,999 pricing!</p>
          </div>

          <div className="gbd-action-area">
             <div className="gbd-milestones">
                <div className="m-step done">₹14,500 <span>Tier 1</span></div>
                <div className="m-step active">₹12,500 <span>Current</span></div>
                <div className="m-step next">₹9,999 <span>Goal</span></div>
             </div>

             <div className="gbd-qty-selector">
                <div className="qty-label-row">
                   <label>Units to commit:</label>
                   <span className="qty-val">1 Unit</span>
                </div>
                <input type="range" min={1} max={50} defaultValue={1} className="gb-slider" />
             </div>

             <div className="savings-simulator-card">
                <div className="sim-row">
                   <span>Projected Savings</span>
                   <strong className="green">₹6,000</strong>
                </div>
                <div className="sim-row">
                   <span>Pool Progress Impact</span>
                   <strong className="blue">+1.2%</strong>
                </div>
             </div>

             <button className={`btn-join-pool-massive ${joined ? 'joined' : ''}`} onClick={handleJoin} disabled={joined}>
               {joined ? 'You are in this pool!' : 'Commit & Join Pool'}
             </button>
             <p className="gbd-guarantee">Your card will only be charged when the pool closes.</p>
          </div>
        </div>

        {/* Chat / Discussion Column */}
        <div className="gbd-chat-card">
          <div className="chat-header">
             <div>
                <h2>Pool Discussion</h2>
                <div className="participant-avatars">
                   <img src="https://i.pravatar.cc/150?u=a" alt="p1" />
                   <img src="https://i.pravatar.cc/150?u=b" alt="p2" />
                   <img src="https://i.pravatar.cc/150?u=c" alt="p3" />
                   <span className="p-count">+42 others</span>
                </div>
             </div>
             <span className="live-viewers"><span className="red-dot"></span> 12 Online</span>
          </div>

          <div className="chat-messages-container">
             {chatMessages.map(msg => (
               msg.isSystem ? (
                 <div key={msg.id} className="chat-system-msg">
                    <span className="sys-icon">⚡</span>
                    {msg.text}
                 </div>
               ) : (
                 <div key={msg.id} className={`chat-msg-row ${msg.user === 'You' ? 'my-msg' : ''}`}>
                    <img src={msg.avatar} alt={msg.user} className="chat-avatar" />
                    <div className="chat-bubble-wrap">
                       <div className="chat-meta">
                          <strong>{msg.user}</strong>
                          <span>{msg.time}</span>
                       </div>
                       <div className="chat-bubble">{msg.text}</div>
                    </div>
                 </div>
               )
             ))}
             <div ref={chatEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
             <input 
               type="text" 
               placeholder="Discuss with pool members..." 
               value={message}
               onChange={(e) => setMessage(e.target.value)}
             />
             <button type="submit" disabled={!message.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupBuyDetail;
