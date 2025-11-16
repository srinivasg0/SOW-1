import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Header from '../components/Header';
import './Login.css';

function Login({ setToken, language, setLanguage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [translations, setTranslations] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTranslations();
  }, [language]);

  const loadTranslations = async () => {
    try {
      const response = await apiClient.get(`/translations/login/${language}`);
      setTranslations(response.data);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        username: email,
        password: password,
      });

      if (response.data.token) {
        setToken(response.data.token);
        navigate('/pricelist');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-background">
        <img 
          src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg" 
          alt="Background" 
          className="background-image"
        />
      </div>

      <Header 
        translations={translations}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="login-main">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-title">{translations['login.title'] || 'Logga in'}</h1>
            
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">{translations['login.email_label'] || 'Skriv in din epost adress'}</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translations['login.email_placeholder'] || 'Epost adress'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{translations['login.password_label'] || 'Skriv in ditt lösenord'}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={translations['login.password_placeholder'] || 'Lösenord'}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? '...' : (translations['login.submit'] || 'Logga in')}
            </button>

            <div className="form-links">
              <a href="#" className="form-link">{translations['login.register'] || 'Registrera dig'}</a>
              <a href="#" className="form-link">{translations['login.forgot'] || 'Glömt lösenord?'}</a>
            </div>
          </form>
        </div>
      </main>

      <footer className="login-footer">
        <div className="footer-content">
          <span className="footer-brand">123 Fakturera</span>
          <span className="footer-copyright">© Lättfaktura, CRO no. 638537, 2025. All rights reserved.</span>
          <div className="footer-links">
            <a href="#">{translations['nav.home'] || 'Hem'}</a>
            <a href="#">{translations['nav.order'] || 'Beställ'}</a>
            <a href="#">{translations['nav.contact'] || 'Kontakta oss'}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;

