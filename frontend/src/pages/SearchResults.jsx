import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addToCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = ({ query }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const searchQuery = query || '';
        if (searchQuery) {
          const response = await axios.get(`https://dummyjson.com/products/search?q=${searchQuery}`);
          setProducts(response.data.products);
        } else {
          const [mens, womens, tops, shoes] = await Promise.all([
            axios.get('https://dummyjson.com/products/category/mens-shirts?limit=6'),
            axios.get('https://dummyjson.com/products/category/womens-dresses?limit=6'),
            axios.get('https://dummyjson.com/products/category/tops?limit=6'),
            axios.get('https://dummyjson.com/products/category/mens-shoes?limit=6')
          ]);
          const combined = [...mens.data.products, ...womens.data.products, ...tops.data.products, ...shoes.data.products];
          setProducts(combined.sort(() => Math.random() - 0.5));
        }
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-results-root">
      {/* ── Filters Sidebar ── */}
      <aside className="filters-sidebar">
        <h2>Filters</h2>
        
        <div className="filter-section">
          <div className="toggle-row">
            <span>Available Near Me</span>
            <div className="toggle-switch active">
              <div className="toggle-thumb"></div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <label className="checkbox-item">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Negotiable Only
          </label>
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="checkmark"></span>
            Bulk Discounts
          </label>
        </div>

        <div className="filter-section">
          <label className="section-label">Size</label>
          <div className="size-grid">
            <button className="size-btn">XS</button>
            <button className="size-btn active">S</button>
            <button className="size-btn">M</button>
            <button className="size-btn">L</button>
          </div>
        </div>

        <div className="filter-section">
          <label className="section-label">Color</label>
          <div className="color-grid">
            <div className="color-dot white active"></div>
            <div className="color-dot blue"></div>
            <div className="color-dot yellow"></div>
            <div className="color-dot navy"></div>
            <div className="color-dot peach"></div>
          </div>
        </div>
      </aside>

      {/* ── Results Main ── */}
      <main className="results-main">
        <header className="results-header">
          <div className="header-left">
            <span className="results-count">Showing {products.length} results for</span>
            <h1 className="results-query">'{query || 'All Products'}'</h1>
          </div>
          <div className="header-right">
            <button className="sort-dropdown">
              Sort: Popularity <span className="chevron">⌄</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading-spinner" style={{ padding: '50px', textAlign: 'center', fontWeight: 'bold' }}>
            Searching...
          </div>
        ) : (
          <div className="products-grid-results">
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                className="product-card-res" 
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="res-img-wrap">
                  <img src={product.thumbnail} alt={product.title} loading="lazy" />
                  {product.discountPercentage > 10 && (
                    <span className="res-badge blue">{Math.round(product.discountPercentage)}% OFF</span>
                  )}
                  <div className="fit-icon-overlay">🔍</div>
                </div>
                <div className="res-content">
                  <div className="res-title-row">
                    <h3 className="res-name">{product.title}</h3>
                    <span className="res-price">${product.price.toFixed(2)}</span>
                  </div>
                  <div className={`res-stock ${product.stock > 0 ? 'green' : 'red'}`}>
                    <span className="stock-dot"></span> {product.stock > 0 ? `Live Stock: ${product.stock} units` : 'Out of Stock'}
                  </div>
                  <button className="add-to-cart-res" onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart({ 
                      id: product.id, 
                      name: product.title, 
                      price: product.price, 
                      img: product.thumbnail, 
                      discount: product.discountPercentage > 10 ? (product.price * 0.1) : 0 
                    }));
                    toast.success(`${product.title} added to cart!`);
                  }}>Add to Cart</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        <footer className="pagination">
          <button className="page-btn">‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span className="page-dots">...</span>
          <button className="page-btn">›</button>
        </footer>
      </main>
    </div>
  );
};

export default SearchResults;
