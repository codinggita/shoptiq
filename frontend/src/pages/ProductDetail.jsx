import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = ({ onNegotiate, onNavigate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localProducts } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(185);
  const [weight, setWeight] = useState(82);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      // 1. Check if it's a locally added product first
      const localMatch = localProducts.find(p => p.id === id || p._id === id);
      if (localMatch) {
        setProduct({
          ...localMatch,
          title: localMatch.name || localMatch.title,
          thumbnail: localMatch.image || localMatch.img || localMatch.thumbnail,
          images: localMatch.images || [localMatch.image || localMatch.img || localMatch.thumbnail],
          rating: localMatch.rating || 4.5,
          discountPercentage: localMatch.discountPercentage || 0,
        });
        setLoading(false);
        return;
      }

      // 2. Fallback to API if not local
      try {
        const response = await axios.get(`https://dummyjson.com/products/${id || 1}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, localProducts]);

  const getRecommendedSize = () => {
    if (height > 180 && weight > 80) return 'Large (Slim Fit)';
    if (height > 170 && weight > 70) return 'Medium (Regular Fit)';
    return 'Small (Tailored Fit)';
  };

  const handleAR = () => {
    if (onNavigate) onNavigate('aistyling');
    else navigate('/aistyling');
  };

  if (loading) {
    return <div className="loading-spinner" style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Product Details...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Product not found.</div>;
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="product-detail-root">
      <div className="pd-container animate-slide-in-3d">
        {/* ── Left: Image Gallery ── */}
        <div className="pd-gallery-area">
          <div className="main-image-wrap">
            <img src={images[activeImg] || images[0]} alt={product.title} />
            <button className="ar-tryon-badge" onClick={handleAR}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              AR TRY-ON
            </button>
          </div>
          <div className="gallery-thumbnails">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumb-wrap ${activeImg === idx ? 'active' : ''}`}
                onClick={() => setActiveImg(idx)}
              >
                <img src={img} alt={`Thumbnail ${idx}`} />
              </div>
            ))}
          </div>
          
          <div className="expectation-meter-pd">
            <div className="meter-header-pd">
               <div className="meter-title">
                 <strong>Expectation Meter</strong>
                 <p>Comparing catalog visuals vs. real-world customer photos</p>
               </div>
               <span className="match-pill">{Math.floor((product.rating / 5) * 100)}% Match</span>
            </div>
            <div className="meter-gradient-bar">
               <div className="meter-fill-pd" style={{ width: `${(product.rating / 5) * 100}%` }}></div>
            </div>
            <div className="meter-labels">
               <span>Low Fidelity</span>
               <span>Catalog Accurate</span>
            </div>
          </div>

        </div>

        {/* ── Right: Purchase Info ── */}
        <div className="pd-info-area">
          <div className="pd-brand-header">{product.brand || product.category.toUpperCase()}</div>
          <h1 className="pd-title">{product.title}</h1>
          <p className="pd-description" style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{product.description}</p>
          <div className="pd-pricing-row">
              <span className="p-price-val">${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="pd-old-price">${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>
            )}
          </div>

          {/* AI Size Finder */}
          <div className="ai-size-finder-card">
            <div className="finder-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              AI RECOMMENDATION
            </div>
            <div className="finder-inputs">
              <div className="f-input-group">
                <label>Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
              <div className="f-input-group">
                <label>Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
            <div className="recommendation-box">
              <span>Recommended Size:</span>
              <strong>{getRecommendedSize()}</strong>
            </div>
          </div>

          {/* AI Price sense */}
          <div className="ai-price-predictor animate-fade-in">
             <div className="predictor-header">
                <div className="p-badge">AI SENSE</div>
                <strong>Price Protection Active</strong>
             </div>
             <div className="predictor-body">
                <div className="p-trend-chart">
                   <svg width="60" height="30" viewBox="0 0 60 30">
                      <path d="M0 25 Q 15 20, 30 10 T 60 5" fill="none" stroke="#10b981" strokeWidth="3" />
                   </svg>
                </div>
                <div className="p-insight">
                   <strong>Buy Now Recommendation</strong>
                   <p>Current price is 12% lower than the 30-day average. AI predicts a ₹450 increase next week.</p>
                </div>
             </div>
          </div>

          <div className="purchase-actions">
            <button className="btn-add-cart" onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart({ 
                id: product.id, 
                name: product.title, 
                price: product.price, 
                img: product.thumbnail, 
                discount: product.discountPercentage > 10 ? (product.price * 0.1) : 0 
              }));
              toast.success(`${product.title} added to cart!`);
            }}>
              ADD TO CART
            </button>
            <button className="btn-make-offer" onClick={() => onNegotiate && onNegotiate({ name: product.title, price: product.price, image: product.thumbnail })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              MAKE AN OFFER
            </button>
          </div>

          {/* Frequently Bundled */}
          <div className="bundle-box-pd">
             <h3>Frequently Bundled</h3>
             <div className="bundle-row">
                <div className="bundle-item">
                   <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" alt="Accessory" />
                   <div className="b-info">
                      <strong>Urban Case Pro</strong>
                      <span>₹1,240</span>
                   </div>
                </div>
                <div className="plus-sign">+</div>
                <div className="bundle-item">
                   <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&q=80" alt="Accessory" />
                   <div className="b-info">
                      <strong>MagSafe Sync</strong>
                      <span>₹850</span>
                   </div>
                </div>
             </div>
             <button className="btn-bundle-save">Bundle & Save ₹400</button>
          </div>

          <div className="bank-offers-pd">
             <div className="offer-header-pd">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                OFFERS & SERVICES
             </div>
             <div className="offer-item-pd">
                <strong>Bank Offer</strong> 10% instant discount on HDFC Bank Credit Cards, up to ₹1,500. <span className="tc-link">T&C</span>
             </div>
             <div className="offer-item-pd">
                <strong>Partner Offer</strong> Get extra 5% cashback on using Amazon Pay balance. <span className="tc-link">T&C</span>
             </div>
             
             <div className="pd-trust-services-inline">
               <div className="trust-item-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>1 Year Warranty</span>
               </div>
               <div className="trust-item-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Genuine Product</span>
               </div>
               <div className="trust-item-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <span>Secure Payments</span>
               </div>
             </div>
          </div>

          <div className="availability-section">
            <div className="avail-header">
              <h3>Nearby Availability</h3>
              <button className="text-btn" onClick={() => (onNavigate ? onNavigate('inventory') : navigate('/inventory'))}>Change Location</button>
            </div>
            <div className="avail-list">
              <div className="avail-item">
                <div className="avail-info">
                  <strong>Local Warehouse</strong>
                  <p>0.6 km away</p>
                </div>
                <span className={`status-pill ${product.stock > 0 ? 'green' : 'red'}`}>
                  ● {product.stock > 0 ? 'In-Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="avail-item">
                <div className="avail-info">
                  <strong>Distribution Center</strong>
                  <p>2.4 km away</p>
                </div>
                <span className={`status-pill ${product.stock > 10 ? 'green' : 'red'}`}>
                  ● {product.stock > 10 ? 'In-Stock' : 'Low Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Community Gallery ── */}
      <section className="community-gallery-pd">
        <div className="cg-header">
          <h2>Community Gallery</h2>
          <button className="upload-look-btn" onClick={() => (onNavigate ? onNavigate('community') : navigate('/community'))}>
            Upload Your Look
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </button>
        </div>
        <div className="cg-grid">
          <div className="cg-item"><img src={product.thumbnail} alt="Look 1" /></div>
          <div className="cg-item"><img src={product.images[0] || product.thumbnail} alt="Look 2" /></div>
          <div className="cg-item"><img src={product.images[1] || product.thumbnail} alt="Look 3" /></div>
          <div className="cg-item"><img src={product.images[2] || product.thumbnail} alt="Look 4" /></div>
          <div className="cg-item more">
             <img src={product.images[0] || product.thumbnail} alt="More" />
             <div className="more-overlay" onClick={() => (onNavigate ? onNavigate('community') : navigate('/community'))}>+{Math.floor(Math.random() * 50) + 10} More</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
