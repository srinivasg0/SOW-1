import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Header from '../components/Header';
import './Terms.css';

function Terms({ language, setLanguage }) {
  const [translations, setTranslations] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadTranslations();
  }, [language]);

  useEffect(() => {
    // ENHANCED ANDROID + iOS FIX
    const setVH = () => {
      // Get actual viewport height (works for Android address bar)
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on mount
    setVH();
    
    // Update on resize (Android address bar hide/show)
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Force styles for both iOS and Android
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.position = 'relative'; // Android fix
    
    return () => {
      // Cleanup on unmount
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';
      document.body.style.position = '';
    };
  }, []);

  const loadTranslations = async () => {
    try {
      const [termsResponse, loginResponse] = await Promise.all([
        apiClient.get(`/translations/terms/${language}`),
        apiClient.get(`/translations/login/${language}`)
      ]);
      setTranslations({
        ...termsResponse.data,
        ...loginResponse.data
      });
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="terms-page">
      <div className="terms-background" aria-hidden="true">
        <img
          src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
          alt=""
          className="background-image"
        />
      </div>

      <Header 
        translations={translations}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="terms-main">
        <div className="terms-header-section">
          <h1 className="terms-title">{translations['terms.title'] || 'Villkor'}</h1>
          <button className="terms-close-button" onClick={handleClose}>
            {translations['terms.button'] || 'Stäng och gå tillbaka'}
          </button>
        </div>

        <div className="terms-container">
          <div className="terms-content">
            {translations['terms.content'] ? (
              translations['terms.content'].split('\n\n').map((paragraph, index) => 
                paragraph.trim() ? (
                  <p key={index}>{paragraph.trim()}</p>
                ) : null
              )
            ) : (
              <p>Placeholder text - will be replaced with actual terms content later</p>
            )}
          </div>
        </div>
        <button className="terms-close-button terms-close-button-bottom" onClick={handleClose}>
          {translations['terms.button'] || 'Stäng och gå tillbaka'}
        </button>
      </main>
    </div>
  );
}

export default Terms;
