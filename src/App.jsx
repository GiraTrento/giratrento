import { useState } from 'react';
import './App.css';
import React from 'react';
import MyMap from './components/Map.jsx';
import TopBar from './components/TopBar.jsx';
import SideBar from './components/SideBar.jsx';

function App() {
  return (
    <div className='app-layout'>
      <TopBar
        openMenu={() => console.log('apertura menu')}
        openFilters={() => console.log('apertura filtri')}
      />
      <div style={{ marginTop: '80px' }}>
        <SideBar openStoreCard={(id) => console.log('apertura negozio ' + id)} />
        <MyMap />
      </div>
    </div>
  );
}

export default App;
