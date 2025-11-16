import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Pricelist from './pages/Pricelist';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'sv');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setToken={setToken} language={language} setLanguage={setLanguage} />} 
        />
        <Route 
          path="/terms" 
          element={<Terms language={language} setLanguage={setLanguage} />} 
        />
        <Route 
          path="/pricelist" 
          element={
            <PrivateRoute>
              <Pricelist token={token} language={language} setLanguage={setLanguage} />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

