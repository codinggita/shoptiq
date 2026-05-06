import React, { Suspense, lazy, useMemo, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NegotiatorBot from './components/NegotiatorBot';
import Footer from './components/Footer';
import { logout, loginSuccess } from './store/authSlice';
import { clearStorageOnLogout } from './utils/storage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Lazy loading pages for performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const AIStyling = lazy(() => import('./pages/AIStyling'));
const GroupBuy = lazy(() => import('./pages/GroupBuy'));
const GroupBuyDetail = lazy(() => import('./pages/GroupBuyDetail'));
const Community = lazy(() => import('./pages/Community'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NegotiationHub = lazy(() => import('./pages/NegotiationHub'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const Support = lazy(() => import('./pages/Support'));

// Skeleton Loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.ui?.theme || 'light');
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const dispatch = useDispatch();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#4f46e5', // var(--accent)
          },
          background: {
            default: themeMode === 'light' ? '#f8fafc' : '#0f172a',
            paper: themeMode === 'light' ? '#ffffff' : '#1e293b',
          },
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
      }),
    [themeMode]
  );

  useEffect(() => {
    // Keep Tailwind/CSS variables in sync with Redux theme
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Also save to localStorage for persistence if not handled by redux middleware
    localStorage.setItem('shoptiq_theme', themeMode);
  }, [themeMode]);

  const handleLogin = (user) => {
    dispatch(loginSuccess(user));
  };

  const handleLogout = () => {
    clearStorageOnLogout();
    dispatch(logout());
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} theme={themeMode} />
      <div className="app-container">
      {isAuthenticated && (
        <Navbar 
          onLogout={handleLogout} 
          cartCount={cartCount} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}
      
      <div className={`app-body-layout ${isAuthenticated ? 'with-sidebar' : ''}`}>
        {isAuthenticated && (
          <Sidebar 
            onLogout={handleLogout} 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}
        
        <main className="main-content-view">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
              <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!isAuthenticated ? <Signup onSignup={handleLogin} /> : <Navigate to="/dashboard" />} />
              
              {/* Protected Routes */}
              {isAuthenticated ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/aistyling" element={<AIStyling />} />
                  <Route path="/groupbuy" element={<GroupBuy />} />
                  <Route path="/groupbuy/:id" element={<GroupBuyDetail />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/negotiation" element={<NegotiationHub />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/" />} />
              )}
            </Routes>
          </Suspense>
        </main>
      </div>

      {isAuthenticated && (
        <>
          <button 
            className="floating-assistant-btn" 
            onClick={() => setIsBotOpen(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              backgroundColor: '#0f172a',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1000,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Assistant
          </button>
          <NegotiatorBot isOpen={isBotOpen} onClose={() => setIsBotOpen(false)} />
        </>
      )}
      <Footer />
    </div>
    </ThemeProvider>
  );
}

export default App;
