import { useState } from 'react';
import './Home.css';
import React from 'react';
import MyMap from '../components/Map.jsx';
import TopBar from '../components/TopBar.jsx';
import SideBar from '../components/SideBar.jsx';
import MenuBar from '../components/MenuBar.jsx';
import FiltersBar from '../components/FiltersBar.jsx';
import StoreCard from '../components/StoreCard.jsx';

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [selectedStore, setSelectedStore] = useState(null);

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

      <SideBar
        selectedCategory={selectedCategory}
        openStoreCard={(negozio) => setSelectedStore(negozio)}
      />

      <MyMap selectedCategory={selectedCategory} />

      <MenuBar
        isOpen={isMenuOpen}
        openLogin={() => console.log('Opening Login')}
        onClose={() => setIsMenuOpen(false)}
      />

      <FiltersBar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => setSelectedCategory(category)}
      />

      <StoreCard store={selectedStore} onClose={() => setSelectedStore(null)} />
    </div>
  );
}

export default Home;
