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
      <Header
        translations={translations}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="terms-main">
        <div className="terms-header-section">
          <h1 className="terms-title">
            {translations['terms.title'] || 'Villkor'}
          </h1>
          <button className="terms-close-button" onClick={handleClose}>
            {translations['terms.button'] || 'Stäng och gå tillbaka'}
          </button>
        </div>

        <div className="terms-container">
          <div className="terms-content">
            {translations['terms.content'] ? (
              translations['terms.content']
                .split('\n\n')
                .map((paragraph, index) =>
                  paragraph.trim() ? <p key={index}>{paragraph.trim()}</p> : null
                )
            ) : (
              <p>
                Placeholder text - will be replaced with actual terms content later
              </p>
            )}
          </div>
        </div>

        <button
          className="terms-close-button terms-close-button-bottom"
          onClick={handleClose}
        >
          {translations['terms.button'] || 'Stäng och gå tillbaka'}
        </button>
      </main>
    </div>
  );
}

export default Terms;
