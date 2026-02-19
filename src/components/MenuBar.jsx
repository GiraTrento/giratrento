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
        <div className='menu-content'>
          <div>
            {user ? (
              <>
                <button className='menubar-btn' onClick={() => navigate('/profile')}>
                  Il tuo Account
                </button>
                {/* <button className='menubar-btn' onClick={openFavorites}>
                Preferiti
              </button> */}
                <button className='menubar-btn' onClick={() => navigate('/suggest')}>
                  Consiglia un'Attività
                </button>
              </>
            ) : (
              <button className='menubar-btn' onClick={() => navigate('/login')}>
                Accedi
              </button>
            )}
          </div>
          <div>
            {user && user.role === 'admin' && (
              <button className='menubar-btn' onClick={() => navigate('/admin-dashboard')}>
                Dashboard
              </button>
            )}
          </div>
          <div>
            {user && user.role === 'merchant' && (
              <button className='menubar-btn' onClick={() => navigate('/merchant-dashboard')}>
                Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
