import React, { useState, useEffect } from 'react';
import { getActivities } from '../api/activityService'; // <-- 1. Importa la chiamata API
import './SideBar.css';

const SideBar = ({ openStoreCard }) => {
  // 2. Inizializza gli stati
  const [negozi, setNegozi] = useState([]); // Array inizialmente vuoto
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Usa useEffect per scaricare i dati all'avvio
  useEffect(() => {
    const fetchNegozi = async () => {
      try {
        setIsLoading(true);
        // Chiama il backend per scaricare le attività approvate
        const data = await getActivities(); 
        setNegozi(data);
      } catch (err) {
        console.error("Errore nel recupero negozi:", err);
        setError('Impossibile caricare i negozi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNegozi(); // Esegui la funzione
  }, []); // L'array vuoto [] assicura che lo scaricamento avvenga solo una volta

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
        {!isLoading && !error && negozi.map((negozio) => (
          // Attenzione: MongoDB usa _id con il trattino basso
          <div 
            key={negozio._id} 
            className='shop-card' 
            onClick={() => openStoreCard(negozio._id)}
          >
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
