import React, { useState } from 'react';
import axios from 'axios';

import './Login.css';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const payload = isAdminMode 
        ? { username, password } 
        : { username, mobile };
        
      const response = await axios.post(`http://localhost:5000/api/auth/login`, payload);
      const userData = {
        token: response.data.token,
        role: response.data.role,
        userId: response.data.userId,
        name: response.data.name
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container animate-fade">
      <div className="glass login-card">
        <h2>{isAdminMode ? 'Admin Login' : 'User Login'}</h2>
        <p className="subtitle">Referral System Dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
              required 
            />
          </div>
          
          {isAdminMode ? (
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Mobile Number</label>
              <input 
                type="tel" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                placeholder="Enter mobile number"
                required 
              />
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
        
        <p className="toggle-auth">
          Switch to{' '}
          <span onClick={() => setIsAdminMode(!isAdminMode)}>
            {isAdminMode ? 'User Login' : 'Admin Login'}
          </span>
        </p>
      </div>
    </div>
  );
};


export default Login;
