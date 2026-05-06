import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Signup.css';

const Signup = ({ onSignup }) => {
  const [role, setRole] = useState('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        role 
      });
      localStorage.setItem('shoptiq_token', data.token);
      if (onSignup) onSignup(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await api.post('/auth/google', { 
          token: tokenResponse.access_token,
          role 
        });
        localStorage.setItem('shoptiq_token', data.token);
        if (onSignup) onSignup(data);
        toast.success('Signed up with Google successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Google registration failed. Please try again.');
        console.error(error);
      }
    },
    onError: () => toast.error('Google registration failed'),
  });

  return (
    <div className="signup-root">
      <div className="signup-card-layout">
        {/* ── Left Panel (Vision) ── */}
        <div className="signup-hero-panel">
          <div className="hero-overlay-gradient"></div>
          <div className="hero-content-wrap">
            <div className="hero-text-main">
              <h2>Join the future of Unified Commerce.</h2>
              <p>Register your enterprise to bridge the gap between digital vision and physical reality.</p>
            </div>
            
            <div className="hero-feature-row">
              <div className="feature-item-pro">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
                 <span>INSTANT SYNC</span>
              </div>
              <div className="feature-item-pro">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                 <span>VERIFIED AGENTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="signup-auth-panel">
          <div className="auth-scroll-wrap">
            <header className="auth-header-new">
              <h1>Create Account</h1>
              <p>Register your organization for the 2.0 ecosystem.</p>
            </header>

            <div className="role-toggle-group">
               <button 
                className={`role-toggle ${role === 'buyer' ? 'active' : ''}`}
                onClick={() => setRole('buyer')}
               >
                 I'm a Buyer
               </button>
               <button 
                className={`role-toggle ${role === 'seller' ? 'active' : ''}`}
                onClick={() => setRole('seller')}
               >
                 I'm a Seller
               </button>
            </div>

            <form className="auth-form-new" onSubmit={handleSubmit}>
              <div className="field-group-new">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input 
                    type="text" 
                    placeholder="Alex Sterling" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-group-new">
                <label>Enterprise Email</label>
                <div className="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-group-new">
                <label>Security Password</label>
                <div className="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input 
                    type="password" 
                    placeholder="Min. 8 characters" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-access-main">
                Register Organization
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </form>

            <div className="auth-divider-new">
              <span>OR JOIN WITH</span>
            </div>

            <div className="sso-row-new">
              <button className="sso-pill-new" onClick={() => handleGoogleLogin()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Google
              </button>
            </div>

            <footer className="auth-footer-new">
              <p>Already registered? <Link to="/login">Sign in here</Link></p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
