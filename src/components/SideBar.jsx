import React, { useState, useEffect } from 'react';
import { getActivities } from '../api/activityService'; // <-- 1. Importa la chiamata API
import './SideBar.css';

const SideBar = ({ openStoreCard, selectedCategory }) => {
  // 2. Inizializza gli stati
  const [negozi, setNegozi] = useState([]); // Array inizialmente vuoto
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Usa useEffect per scaricare i dati all'avvio
  // Dentro SideBar.jsx
  useEffect(() => {
    const fetchNegozi = async () => {
      try {
        // 1. Diciamo a React che stiamo caricando
        setIsLoading(true);

        // 2. Facciamo la chiamata passando il filtro
        const data = await getActivities({ category: selectedCategory });
        setNegozi(data);
      } catch (err) {
        console.error('Errore nel recupero negozi:', err);
        setError('Impossibile caricare i negozi.');
      } finally {
        // 3. FONDAMENTALE: Diciamo a React che abbiamo finito (sia che sia andata bene, sia in caso di errore)
        setIsLoading(false);
      }
    };

    fetchNegozi();
  }, [selectedCategory]); // Riesegui ogni volta che cambia la categoria

  return (
    <div className='sidebar-container'>
      <div className='sidebar-header'>
        <button className='sort-btn' onClick={() => console.log('Ordina')}>
          Order by ▼
        </button>
      </div>

      <div className='sidebar-list'>
        {/* Gestione degli stati visuali (Caricamento, Errore, Lista vuota) */}
        {isLoading && <p style={{ padding: '20px', textAlign: 'center' }}>Caricamento negozi...</p>}

        {error && <p style={{ padding: '20px', color: 'red' }}>{error}</p>}

        {!isLoading && !error && negozi.length === 0 && (
          <p style={{ padding: '20px', textAlign: 'center' }}>Nessun negozio trovato.</p>
        )}

        {/* Mappatura dei dati REALI del database */}
        {!isLoading &&
          !error &&
          negozi.map((negozio) => (
            // Attenzione: MongoDB usa _id con il trattino basso
            <div key={negozio._id} className='shop-card' onClick={() => openStoreCard(negozio._id)}>
              {/* I nomi delle proprietà devono combaciare col tuo schema backend */}
              <h4>{negozio.name}</h4>

              {/* Se non hai 'address' nel GET ma solo coordinate, puoi mostrare altro o la categoria */}
              <p className='shop-address'>{negozio.address || 'Trento'}</p>

              <span className='shop-category'>{negozio.category}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SideBar;
