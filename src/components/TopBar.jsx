import React from 'react';
import './TopBar.css';
import logo from '../assets/LogoGiraTrento.svg';

const TopBar = ({ menuOpened, openMenu, filtersOpened, openFilters }) => {
  return (
    <header className='top-bar'>
      <div className={`bar-section left ${menuOpened ? 'moved' : ''}`}>
        <button className='menu-btn' onClick={openMenu}>
          <svg
            width='44'
            height='40'
            viewBox='0 0 44 40'
            fill='none'
            stroke='#FFE5AC'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <g className='icon-original'>
              <line x1='4' y1='4' x2='40' y2='4'></line>
              <line x1='4' y1='14' x2='30' y2='14'></line>
              <line x1='4' y1='24' x2='40' y2='24'></line>
              <line x1='4' y1='34' x2='30' y2='34'></line>
            </g>
            <g className='icon-close'>
              <line x1='10' y1='6' x2='34' y2='30'></line>
              <line x1='10' y1='30' x2='34' y2='6'></line>
            </g>
          </svg>
        </button>
      </div>

      <div className='bar-section center'>
        <img src={logo} alt='Logo Progetto' className='app-logo' />
      </div>

      <div className={`bar-section right ${filtersOpened ? 'moved' : ''}`}>
        <button className='filters-btn' onClick={openFilters}>
          <svg
            width='44'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
            stroke='#FFE5AC'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <g className='icon-original'>
              <line x1='6' y1='4' x2='6' y2='10'></line>
              <line x1='34' y1='4' x2='34' y2='10'></line>
              <line x1='6' y1='10' x2='15' y2='22'></line>
              <line x1='34' y1='10' x2='25' y2='22'></line>
              <line x1='15' y1='22' x2='15' y2='34'></line>
              <line x1='25' y1='22' x2='25' y2='34'></line>
            </g>
            <g className='icon-close'>
              <line x1='8' y1='6' x2='32' y2='30'></line>
              <line x1='8' y1='30' x2='32' y2='6'></line>
            </g>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
