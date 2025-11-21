import React from 'react';
import './TopBar.css';
import logo from '../assets/LogoGiraTrento.svg';

const TopBar = () => {
  return (
    <header className='top-bar'>
      <div className='bar-section left'>
        <button onClick={() => console.log('Sinistra')}>Menu</button>
      </div>

      <div className='bar-section center'>
        <img src={logo} alt='Logo Progetto' className='app-logo' />
      </div>

      <div className='bar-section right'>
        <button onClick={() => console.log('Destra')}>Filters</button>
      </div>
    </header>
  );
};

export default TopBar;
