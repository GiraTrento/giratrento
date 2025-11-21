import { useState } from 'react';
import './App.css';
import React from 'react';
import MyMap from './components/Map.jsx';
import TopBar from './components/TopBar.jsx';

function App() {
  return (
    <div className='app-layout'>
      <TopBar />
      <div style={{ marginTop: '80px' }}>
        <MyMap />
      </div>
    </div>
  );
}

export default App;
