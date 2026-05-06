import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ onLogout, cartCount = 0, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: 'Shop', path: '/dashboard' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'AI Styling', path: '/aistyling' },
    { name: 'Group Buy', path: '/groupbuy' },
    { name: 'Community', path: '/community' },
    { name: 'Orders', path: '/orders' }
  ];

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand-group">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <motion.line 
                x1="3" y1="6" x2="21" y2="6" 
                animate={isMobileMenuOpen ? { x1: 18, y1: 6, x2: 6, y2: 18 } : { x1: 3, y1: 6, x2: 21, y2: 6 }}
              />
              <motion.line 
                x1="3" y1="12" x2="21" y2="12" 
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.line 
                x1="3" y1="18" x2="21" y2="18" 
                animate={isMobileMenuOpen ? { x1: 6, y1: 6, x2: 18, y2: 18 } : { x1: 3, y1: 18, x2: 21, y2: 18 }}
              />
            </svg>
          </button>
          <Link to="/dashboard" className="navbar-brand">
            Shoptiq
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="navbar-search-container">
          <div className="search-input-wrap">
            <svg className="search-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search products, pools, stores..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>

        <div className="navbar-actions">
          <button className="icon-btn-action" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          
          <Link to="/cart" className="icon-btn-action" title="Shopping Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </Link>
          
          <div className="user-profile-trigger" onClick={onLogout} title="Logout">
            <div className="avatar-placeholder-pro">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="user-details-mini">
              <span className="user-name-nav">{user?.name || 'Admin'}</span>
              <span className="user-role-nav">Pro</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
