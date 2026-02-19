import React, { useState, useEffect } from 'react';
import { getActivities } from '../api/activityService';
import './SideBar.css';

const categoryColors = {
  Riparazioni: '#B78A66',
  Sfuso: '#E8B931',
  'Alimentari Locali': '#14AE5C',
  'Seconda Mano': '#DB34F2',
  'Artigianato Locale': '#0091FF',
};

const SideBar = ({ openStoreCard, selectedCategory }) => {
  const [negozi, setNegozi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNegozi = async () => {
      try {
        setIsLoading(true);

        const data = await getActivities({ category: selectedCategory });
        setNegozi(data);
      } catch (err) {
        console.error('Errore nel recupero negozi:', err);
        setError('Impossibile caricare i negozi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNegozi();
  }, [selectedCategory]);

  const negoziFiltrati = negozi.filter((negozio) =>
    negozio.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='sidebar-container'>
      <div className='sidebar-header'>
        <input
          type='text'
          className='search-input'
          placeholder='Cerca per nome...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className='sidebar-list'>
        {isLoading && <p style={{ padding: '20px', textAlign: 'center' }}>Caricamento negozi...</p>}

        {error && <p style={{ padding: '20px', color: 'red' }}>{error}</p>}

        {!isLoading && !error && negoziFiltrati.length === 0 && (
          <p style={{ padding: '20px', textAlign: 'center' }}>Nessun negozio trovato.</p>
        )}

        {!isLoading &&
          !error &&
          negoziFiltrati.map((negozio) => (
            <div key={negozio._id} className='shop-card' onClick={() => openStoreCard(negozio)}>
              <h4>{negozio.name}</h4>

              <p className='shop-address'>{negozio.address || 'Trento'}</p>

              <span
                className='shop-category'
                style={{
                  backgroundColor: categoryColors[negozio.category] || '#ccc',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '5px',
                }}
              >
                {negozio.category}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SideBar;
