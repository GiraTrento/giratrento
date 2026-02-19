// src/pages/Home.jsx
import { useState } from 'react';
import './Home.css';
import React from 'react';
import MyMap from '../components/Map.jsx';
import TopBar from '../components/TopBar.jsx';
import SideBar from '../components/SideBar.jsx';
import MenuBar from '../components/MenuBar.jsx';
import FiltersBar from '../components/FiltersBar.jsx';

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // NUOVO STATO: Tiene traccia della categoria scelta dai filtri
  const [selectedCategory, setSelectedCategory] = useState('');

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

      {/* 1. Passiamo la categoria selezionata alla lista */}
      <SideBar
        selectedCategory={selectedCategory}
        openStoreCard={(id) => console.log('apertura negozio ' + id)}
      />

      {/* 2. Passiamo la categoria selezionata alla mappa */}
      <MyMap selectedCategory={selectedCategory} />

      <MenuBar
        isOpen={isMenuOpen}
        openLogin={() => {
          console.log('Opening Login');
          // Nota: qui potresti usare navigate('/login') se hai tolto il popup del login
        }}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* 3. Passiamo stato e funzione alla barra dei filtri */}
      <FiltersBar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => setSelectedCategory(category)}
      />
    </div>
  );
}

export default Home;
