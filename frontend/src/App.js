import React, { useEffect, useState } from 'react';
import './App.css';
import LoginForm from './LoginForm';
import ChuckNorris from './ChuckNorris';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);

  useEffect(() => {
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('http://localhost:3333/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      // ignore network errors
    }
    setToken(null);
  };

  return (
    <div className="App">
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <ChuckNorris token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
