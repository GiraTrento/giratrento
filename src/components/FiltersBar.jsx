import React from 'react';
import './FiltersBar.css';

const FiltersBar = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`filters-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`filtersbar ${isOpen ? 'open' : ''}`}></div>
    </>
  );
};

export default FiltersBar;
