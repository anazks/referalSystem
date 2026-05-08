import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // If no user, show login only
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // If user exists, handle role-based dashboards
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/admin" 
            element={user.role === 'admin' ? <AdminDashboard user={user} logout={logout} /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={user.role === 'user' ? <Dashboard user={user} logout={logout} /> : <Navigate to="/admin" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
