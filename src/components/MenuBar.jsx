import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuBar.css';

const MenuBar = ({ isOpen, onClose, openLogin, openFavorites, openSuggestion }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`menubar ${isOpen ? 'open' : ''}`}>
        <div>
          {user ? (
            <>
              <button className='menubar-btn' onClick={() => navigate('/profile')}>
                Your Account
              </button>
              <button className='menubar-btn' onClick={openFavorites}>
                Favorites
              </button>
              <button className='menubar-btn' onClick={() => navigate('/suggest')}>
                Suggest an Activity
              </button>
            </>
          ) : (
            <button className='menubar-btn' onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
        <div>
          {user && user.role === 'admin' && (
            <button className='menubar-btn' onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuBar;
