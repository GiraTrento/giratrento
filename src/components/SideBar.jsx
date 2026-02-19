import React from 'react';
import './SideBar.css';

const negozi = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  nome: `Negozio ${i + 1}`,
  indirizzo: `Via Roma, ${i + 10}`,
  categoria: i % 2 === 0 ? 'Pizzeria' : 'Bar',
}));

const SideBar = ({ openStoreCard }) => {
  return (
    <div className='sidebar-container'>
      <div className='sidebar-header'>
        <button className='sort-btn' onClick={() => console.log('Ordina')}>
          Order by ▼
        </button>
      </div>
      <div className='sidebar-list'>
        {negozi.map((negozio) => (
          <div key={negozio.id} className='shop-card' onClick={() => openStoreCard(negozio.id)}>
            <h4>{negozio.nome}</h4>
            <p className='shop-address'>{negozio.indirizzo}</p>
            <span className='shop-category'>{negozio.categoria}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
