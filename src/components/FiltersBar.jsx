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
        <div className='filters-content'>
          {categoriesData.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                className='filter-btn category-btn'
                onClick={() => onSelectCategory(isSelected ? '' : cat.name)}
                style={{
                  backgroundColor: isSelected ? cat.color : '#ffffff',
                  color: isSelected ? '#ffffff' : '#333333',
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
