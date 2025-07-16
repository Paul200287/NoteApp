import React, { useState } from 'react';
import axios from 'axios';
import './Auth.modules.css';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegister ? 'register' : 'login';
    axios.post(`http://localhost:8000/${endpoint}`, { username, password })
      .then((res) => {
        setError('');
        if (isRegister) {
          setIsRegister(false);
          return;
        }
        localStorage.setItem('token', res.data.access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
        onLogin();
      })
      .catch(() => {
        setError('Fehler beim Vorgang');
      });
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        <p className="toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Have an account? Login' : 'No account? Register'}
        </p>
      </form>
    </div>
  );
}

export default Login;
