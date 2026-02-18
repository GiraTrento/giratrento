import { useState } from 'react';
import './App.css';
import React from 'react';
import MyMap from './components/Map.jsx';
import TopBar from './components/TopBar.jsx';
import SideBar from './components/SideBar.jsx';
import MenuBar from './components/MenuBar.jsx';
import FiltersBar from './components/FiltersBar.jsx';
import LoginPanel from './components/LoginPanel.jsx';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className='app-layout'>
      <TopBar
        menuOpened={isMenuOpen}
        openMenu={() => {
          setIsMenuOpen(!isMenuOpen);
          setIsFiltersOpen(false);
        }}
        filtersOpened={isFiltersOpen}
        openFilters={() => {
          setIsFiltersOpen(!isFiltersOpen);
          setIsMenuOpen(false);
        }}
      />
      <SideBar openStoreCard={(id) => console.log('apertura negozio ' + id)} />

      <MyMap />

      <MenuBar
        isOpen={isMenuOpen}
        openLogin={() => {
          console.log('Opening Login');
          setIsLoginOpen(true);
        }}
        onClose={() => setIsMenuOpen(false)}
      />

      <FiltersBar isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />

      <LoginPanel isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;
