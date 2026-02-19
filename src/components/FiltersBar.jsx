import React from 'react';
import './FiltersBar.css';

const categoriesData = [
  { name: 'Riparazioni', color: '#B78A66' },
  { name: 'Sfuso', color: '#E8B931' },
  { name: 'Alimentari Locali', color: '#14AE5C' },
  { name: 'Seconda Mano', color: '#DB34F2' },
  { name: 'Artigianato Locale', color: '#0091FF' },
];

const FiltersBar = ({ isOpen, onClose, selectedCategory, onSelectCategory }) => {
  return (
    <>
      <div className={`filters-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>

      <div className={`filtersbar ${isOpen ? 'open' : ''}`}>
        <div className='filters-header'>
          <h2>Select Categories</h2>
        </div>
        <div className='filters-content'>
          {categoriesData.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                className='filter-btn category-btn'
                // Logica Toggle: se ci clicco ed è già selezionato, invio una stringa vuota ('') per resettare il filtro e mostrare tutto
                onClick={() => onSelectCategory(isSelected ? '' : cat.name)}
                style={{
                  // Sfondo pieno se selezionato, altrimenti bianco
                  backgroundColor: isSelected ? cat.color : '#ffffff',
                  // Testo bianco se selezionato, altrimenti grigio scuro
                  color: isSelected ? '#ffffff' : '#333333',
                  // Il bordo richiama sempre il colore della categoria
                  borderColor: cat.color,
                  borderWidth: '2px',
                  borderStyle: 'solid',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FiltersBar;
