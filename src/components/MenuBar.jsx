import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuBar.css';

const MenuBar = ({ isOpen, onClose, openLogin, openFavorites, openSuggestion }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`menubar ${isOpen ? 'open' : ''}`}>
        <button className='account-btn' onClick={() => navigate('/login')}>
          Login
        </button>
        <button className='favorites-btn' onClick={openFavorites}>
          Favorites
        </button>
        <button className='suggest-btn' onClick={openSuggestion}>
          Suggest an Activity
        </button>
      </div>
    </>
  );
};

export default MenuBar;
