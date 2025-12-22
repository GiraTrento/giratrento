import { useState } from 'react';
import './App.css';
import React from 'react';
import MyMap from './components/Map.jsx';
import TopBar from './components/TopBar.jsx';
import SideBar from './components/SideBar.jsx';
import MenuBar from './components/MenuBar.jsx';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='app-layout'>
      <TopBar
        openMenu={() => setIsMenuOpen(true)}
        openFilters={() => console.log('apertura filtri')}
      />
      <SideBar openStoreCard={(id) => console.log('apertura negozio ' + id)} />

      <MyMap />

      <MenuBar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}

export default App;
