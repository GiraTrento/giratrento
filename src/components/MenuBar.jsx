import React from 'react';
import './MenuBar.css';

const MenuBar = ({ isOpen, onClose, openAccount, openFavorites, openSuggestion }) => {
  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`menubar ${isOpen ? 'open' : ''}`}>
        <button className='account-btn' onClick={openAccount}>
          Account
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
