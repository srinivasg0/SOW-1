import { useState, useEffect } from 'react';
import './Header.css';

function Header({ translations, language, setLanguage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'sv' ? 'en' : 'sv');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left-section">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className="logo-container">
            <img 
              src="https://storage.123fakturera.se/public/icons/diamond.png" 
              alt="Logo" 
              className="logo"
            />
          </div>
          
          {menuOpen && (
            <>
              <div className="mobile-menu-dropdown">
                <a href="#" className="mobile-menu-item" onClick={closeMenu}>{translations['nav.home'] || 'Hem'}</a>
                <a href="#" className="mobile-menu-item" onClick={closeMenu}>{translations['nav.order'] || 'Beställ'}</a>
                <a href="#" className="mobile-menu-item" onClick={closeMenu}>{translations['nav.customers'] || 'Våra Kunder'}</a>
                <a href="#" className="mobile-menu-item" onClick={closeMenu}>{translations['nav.about'] || 'Om oss'}</a>
                <a href="#" className="mobile-menu-item" onClick={closeMenu}>{translations['nav.contact'] || 'Kontakta oss'}</a>
              </div>
              <div className="menu-overlay" onClick={closeMenu}></div>
            </>
          )}
        </div>
        
        <nav className="nav-menu">
          <div className="nav-links desktop-nav">
            <a href="#" className="nav-link">{translations['nav.home'] || 'Hem'}</a>
            <a href="#" className="nav-link">{translations['nav.order'] || 'Beställ'}</a>
            <a href="#" className="nav-link">{translations['nav.customers'] || 'Våra Kunder'}</a>
            <a href="#" className="nav-link">{translations['nav.about'] || 'Om oss'}</a>
            <a href="#" className="nav-link">{translations['nav.contact'] || 'Kontakta oss'}</a>
          </div>
          
          <div className="language-selector" onClick={toggleLanguage}>
            <span>{translations['nav.language'] || (language === 'sv' ? 'Svenska' : 'English')}</span>
            <img 
              src={language === 'sv' 
                ? 'https://storage.123fakturere.no/public/flags/SE.png'
                : 'https://storage.123fakturere.no/public/flags/GB.png'
              } 
              alt="Flag" 
              className="flag-icon"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

