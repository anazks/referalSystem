import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const AdminDashboard = ({ user, logout }) => {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    mobile: '',
    location: '',
    referredBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchShops();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/admin/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shops/admin/all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShops(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (shopId) => {
    try {
      await axios.patch(`http://localhost:5000/api/shops/verify/${shopId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchShops();
      alert('Shop verified successfully!');
    } catch (err) {
      alert('Error verifying shop');
    }
  };

  const handleEditClick = (u) => {
    setEditingUserId(u._id);
    setFormData({
      username: u.username,
      name: u.name,
      mobile: u.mobile,
      location: u.location,
      referredBy: u.referredBy || ''
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setFormData({ username: '', name: '', mobile: '', location: '', referredBy: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUserId) {
        await axios.patch(`http://localhost:5000/api/auth/admin/update-user/${editingUserId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert('User updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/auth/admin/create-user', formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert('User created successfully!');
      }
      cancelEdit();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade">
      <nav className="glass nav-bar">
        <h1>Admin Control Panel</h1>
        <div className="nav-controls">
          <div className="tabs">
            <span className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</span>
            <span className={activeTab === 'shops' ? 'active' : ''} onClick={() => setActiveTab('shops')}>Shops</span>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'users' ? (
          <div className="main-grid">
            <section className="glass form-section">
              <h2>{editingUserId ? 'Edit User' : 'Create New User'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Username (Login ID)</label>
                    <input 
                      type="text" 
                      value={formData.username} 
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="Enter username"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter full name"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      value={formData.mobile} 
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      placeholder="10-digit number"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="City / Area"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Referred By</label>
                    <input 
                      type="text" 
                      value={formData.referredBy} 
                      onChange={(e) => setFormData({...formData, referredBy: e.target.value})}
                      placeholder="Referrer name"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (editingUserId ? 'Update User' : 'Create User')}
                  </button>
                  {editingUserId && (
                    <button type="button" onClick={cancelEdit} className="btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="glass table-section">
              <h2>Registered Users</h2>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Mobile</th>
                      <th>Location</th>
                      <th>Referrer</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="table-row">
                        <td>{u.name}</td>
                        <td>{u.username}</td>
                        <td>{u.mobile}</td>
                        <td>{u.location}</td>
                        <td>{u.referredBy || '-'}</td>
                        <td>
                          <button onClick={() => handleEditClick(u)} className="btn-edit">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          <section className="glass table-section full-width">
            <h2>Shop Verifications</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Shop Name</th>
                    <th>Area</th>
                    <th>Mobile</th>
                    <th>Date</th>
                    <th>Added By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((s) => (
                    <tr key={s._id} className="table-row">
                      <td>{s.shopName}</td>
                      <td>{s.area}</td>
                      <td>{s.mobileNumber}</td>
                      <td>{new Date(s.onboardingDate).toLocaleDateString()}</td>
                      <td>{s.userId?.name || s.userId?.username || 'Unknown'}</td>
                      <td>
                        <span className={`badge ${s.isVerified ? 'verified' : 'pending'}`}>
                          {s.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        {!s.isVerified && (
                          <button onClick={() => handleVerify(s._id)} className="btn-verify">
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        .nav-controls {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .tabs {
          display: flex;
          gap: 20px;
        }
        .tabs span {
          cursor: pointer;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 5px 0;
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
        }
        .tabs span.active {
          color: var(--accent-color);
          border-bottom-color: var(--accent-color);
        }
        .full-width {
          grid-column: 1 / -1;
        }
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
        .btn-verify {
          background: var(--accent-color);
          color: #0f172a;
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .btn-verify:hover {
          background: white;
        }
        .form-actions {
          display: flex;
          gap: 15px;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid var(--border-color);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .btn-edit {
          background: rgba(56, 189, 248, 0.2);
          color: var(--accent-color);
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .btn-edit:hover {
          background: var(--accent-color);
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
