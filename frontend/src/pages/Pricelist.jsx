import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import './Pricelist.css';

function Pricelist({ token, language, setLanguage }) {
  const [products, setProducts] = useState([]);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchArticle, setSearchArticle] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTranslations();
    loadProducts();
  }, [language]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadTranslations = async () => {
    try {
      const response = await apiClient.get(`/translations/pricelist/${language}`);
      setTranslations(response.data);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = async (id, field, value) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setProducts(updated);

    clearTimeout(editingId);
    const timeoutId = setTimeout(async () => {
      try {
        const product = updated.find(p => p.id === id);
        await apiClient.put(`/products/${id}`, product);
      } catch (error) {
        console.error('Error updating product:', error);
        loadProducts();
      }
    }, 1000);
    setEditingId(timeoutId);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'sv' ? 'en' : 'sv');
  };

  const filteredProducts = products.filter(p => {
    const matchArticle = !searchArticle ||
      (p.article_no && p.article_no.toLowerCase().includes(searchArticle.toLowerCase()));
    const matchProduct = !searchProduct ||
      (p.name && p.name.toLowerCase().includes(searchProduct.toLowerCase()));
    return matchArticle && matchProduct;
  });

  if (loading) {
    return <div className="pricelist-loading">Loading...</div>;
  }

  return (
    <div className="pricelist-page">
      <header className="pricelist-header">
        <div className="header-content">
          <div className="header-left">
            <button className="hamburger-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className="user-profile">
              <div className="user-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="user-info">
                <div className="user-name">John Andre</div>
                <div className="user-company">Storfjord AS</div>
              </div>
            </div>
            {menuOpen && (
              <>
                <div className="mobile-menu-dropdown">
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Invoices</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Customers</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>My Business</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Invoice Journal</div>
                  <div className="mobile-menu-item active" onClick={() => setMenuOpen(false)}>Price List</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Multiple Invoicing</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Unpaid Invoices</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Offer</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Inventory Control</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Member Invoicing</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Import/Export</div>
                  <div className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Log out</div>
                </div>
                <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
              </>
            )}
          </div>
          <div className="header-right">
            <div className="language-selector" onClick={toggleLanguage}>
              <span>{language === 'sv' ? 'Svenska' : 'English'}</span>
              <img
                src={language === 'sv'
                  ? 'https://storage.123fakturere.no/public/flags/SE.png'
                  : 'https://storage.123fakturere.no/public/flags/GB.png'
                }
                alt="Flag"
                className="flag-icon"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="pricelist-layout">
        <aside className="sidebar-menu">
          <div className="menu-title">Menu</div>
          <nav className="menu-nav">
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Invoices</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Customers</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
              </svg>
              <span>My Business</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Invoice Journal</span>
            </div>
            <div className="menu-item active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Price List</span>
              <div className="active-indicator"></div>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M10 18h4" />
                <path d="M8 14h8" />
              </svg>
              <span>Multiple Invoicing</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <line x1="12" y1="10" x2="12" y2="14" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
              <span>Unpaid Invoices</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Offer</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>Inventory Control</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              </svg>
              <span>Member Invoicing</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Import/Export</span>
            </div>
            <div className="menu-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log out</span>
            </div>
          </nav>
        </aside>

        <main className="pricelist-main">
          <div className="pricelist-container">
            <div className="search-section">
              <div className="search-inputs">
                <div className="search-field">
                  <input
                    type="text"
                    placeholder={translations['pricelist.search_article'] || 'Search Article No...'}
                    value={searchArticle}
                    onChange={(e) => setSearchArticle(e.target.value)}
                  />
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div className="search-field">
                  <input
                    type="text"
                    placeholder={translations['pricelist.search_product'] || 'Search Product...'}
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
              </div>
              <div className="action-buttons">
                <button className="action-btn new-product">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>{translations['pricelist.new_product'] || 'New Product'}</span>
                </button>
                <button className="action-btn print">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>{translations['pricelist.print'] || 'Print List'}</span>
                </button>
                <button className="action-btn advanced">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                  </svg>
                  <span>{translations['pricelist.advanced'] || 'Advanced mode'}</span>
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="pricelist-table">
                <thead>
                  <tr>
                    <th className="col-article tablet-landscape">{translations['pricelist.article_no'] || 'Article No.'}</th>
                    <th className="col-product">{translations['pricelist.product_service'] || 'Product/Service'}</th>
                    <th className="col-inprice desktop-only">{translations['pricelist.in_price'] || 'In Price'}</th>
                    <th className="col-price">{translations['pricelist.price'] || 'Price'}</th>
                    <th className="col-unit tablet-landscape">{translations['pricelist.unit'] || 'Unit'}</th>
                    <th className="col-stock tablet-landscape">{translations['pricelist.in_stock'] || 'In Stock'}</th>
                    <th className="col-description desktop-only">{translations['pricelist.description'] || 'Description'}</th>
                    <th className="col-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="col-article tablet-landscape">
                        <input
                          type="text"
                          value={product.article_no || ''}
                          onChange={(e) => handleFieldChange(product.id, 'article_no', e.target.value)}
                          className="editable-field"
                        />
                      </td>
                      <td className="col-product">
                        <input
                          type="text"
                          value={product.name || ''}
                          onChange={(e) => handleFieldChange(product.id, 'name', e.target.value)}
                          className="editable-field"
                        />
                      </td>
                      <td className="col-inprice desktop-only">
                        <input
                          type="number"
                          step="0.01"
                          value={product.in_price || ''}
                          onChange={(e) => handleFieldChange(product.id, 'in_price', parseFloat(e.target.value) || 0)}
                          className="editable-field"
                        />
                      </td>
                      <td className="col-price">
                        <input
                          type="number"
                          step="0.01"
                          value={product.price || ''}
                          onChange={(e) => handleFieldChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                          className="editable-field"
                        />
                      </td>
                      <td className="col-unit tablet-landscape">
                        <input
                          type="text"
                          value={product.unit || ''}
                          onChange={(e) => handleFieldChange(product.id, 'unit', e.target.value)}
                          className="editable-field"
                        />
                      </td>
                      <td className="col-stock tablet-landscape">
                        <input
                          type="number"
                          step="0.01"
                          value={product.in_stock || ''}
                          onChange={(e) => handleFieldChange(product.id, 'in_stock', parseFloat(e.target.value) || 0)}
                          className="editable-field"
                        />
                      </td>
                      <td className="col-description desktop-only">
                        <input
                          type="text"
                          value={product.description || ''}
                          onChange={(e) => handleFieldChange(product.id, 'description', e.target.value)}
                          className="editable-field"
                        />
                      </td>
                      <td className="col-actions">
                        <button className="action-menu">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Pricelist;
