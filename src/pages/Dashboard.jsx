import React, { useState, useEffect } from 'react';
import api from '../api';

import './Dashboard.css';

const Dashboard = ({ user, logout }) => {
  const [shops, setShops] = useState([]);
  const [formData, setFormData] = useState({
    shopName: '',
    area: '',
    mobileNumber: '',
    onboardingDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get('/api/shops', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShops(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/shops', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFormData({ shopName: '', area: '', mobileNumber: '', onboardingDate: '' });
      fetchShops();
    } catch (err) {
      alert('Error adding shop');
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = shops.filter(s => s.isVerified).length * 10;

  return (
    <div className="dashboard-container animate-fade">
      <nav className="glass nav-bar">
        <h1>Referral Dashboard</h1>
        <div className="user-info">
          <span>{user.name || 'User'}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="stats-grid">
          <div className="glass stat-card">
            <h3>Total Verified Earnings</h3>
            <p className="earnings">INR {totalEarnings}</p>
          </div>
          <div className="glass stat-card">
            <h3>Total Onboarded</h3>
            <p className="count">{shops.length}</p>
          </div>
        </div>

        <div className="main-grid">
          <section className="glass form-section">
            <h2>Onboard New Shop</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Shop Name</label>
                  <input 
                    type="text" 
                    value={formData.shopName} 
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    placeholder="Enter shop name"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Area</label>
                  <input 
                    type="text" 
                    value={formData.area} 
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="e.g. Mumbai South"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="tel" 
                    value={formData.mobileNumber} 
                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                    placeholder="10-digit number"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Onboarding Date</label>
                  <input 
                    type="date" 
                    value={formData.onboardingDate} 
                    onChange={(e) => setFormData({...formData, onboardingDate: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Shop'}
              </button>
            </form>
          </section>

          <section className="glass table-section">
            <h2>Your Onboardings</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Shop Name</th>
                    <th>Area</th>
                    <th>Mobile</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr key={shop._id} className="table-row">
                      <td>{shop.shopName}</td>
                      <td>{shop.area}</td>
                      <td>{shop.mobileNumber}</td>
                      <td>{new Date(shop.onboardingDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${shop.isVerified ? 'verified' : 'pending'}`}>
                          {shop.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {shops.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        No shops onboarded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .badge {
          padding: 4px 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .badge.verified {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .badge.pending {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
};


export default Dashboard;
