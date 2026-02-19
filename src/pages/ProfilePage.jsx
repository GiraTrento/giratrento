import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recupera i dati dell'utente dal localStorage
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    navigate('/');
    
    window.location.reload(); 
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-role">Ruolo: <strong>{user.role}</strong></p>

        <div className="profile-info">
          <div className="info-group">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          
          {user.role === 'user' && (
            <button className="secondary-btn" onClick={() => navigate('/orders')}>
              📦 I Miei Ordini
            </button>
          )}

          {user.role === 'admin' && (
            <button className="secondary-btn" onClick={() => navigate('/admin')}>
              ⚙️ Pannello Admin
            </button>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Esci dall'Account
        </button>
        
        <button className="back-home-btn" onClick={() => navigate('/')}>
          Torna alla Home
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;
