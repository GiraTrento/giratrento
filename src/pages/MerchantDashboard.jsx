import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMerchantActivities } from '../api/activityService';
import './Dashboard.css';

const MieAttivitaTab = ({ attivita, navigate }) => {
  return (
    <div className='admin-panel'>
      <h2>Le Mie Attività</h2>

      {attivita.length === 0 ? (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
          Non hai ancora attività approvate sulla piattaforma. Suggerisci una nuova attività dalla
          mappa!
        </p>
      ) : (
        <div className='admin-list'>
          {attivita.map((att) => (
            <div key={att._id} className='admin-list-item'>
              <div>
                <strong>{att.name}</strong> - {att.category} <br />
                <small>{att.address}</small>
              </div>
              <div className='admin-actions'>
                <button
                  className='btn-edit'
                  onClick={() => navigate(`/vetrina/${att._id}`, { state: { store: att } })}
                >
                  Gestisci Vetrina Prodotti
                </button>
                <button
                  className='btn-approve'
                  style={{ backgroundColor: '#B78A66' }}
                  onClick={() =>
                    alert('La modifica dei dati del negozio per i commercianti arriverà a breve!')
                  }
                >
                  Modifica Dettagli
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrdiniRicevutiTab = () => {
  return (
    <div className='admin-panel'>
      <h2>Ordini Ricevuti</h2>
      <div className='admin-list'>
        <p style={{ fontStyle: 'italic', color: '#888' }}>
          Nessun nuovo ordine al momento. Quando un utente farà un acquisto, comparirà qui!
        </p>
        {/* Qui in futuro mapperemo gli ordini del merchant */}
      </div>
    </div>
  );
};

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('attivita');
  const [mieAttivita, setMieAttivita] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setCurrentUser(user);

    // USIAMO LA NUOVA CHIAMATA API DIRETTA
    const fetchMieAttivita = async () => {
      try {
        const activities = await getMerchantActivities();
        setMieAttivita(activities); // Il backend ci manda già solo le nostre!
      } catch (error) {
        console.error('Errore recupero attività del merchant:', error);
      }
    };

    fetchMieAttivita();
  }, [navigate]);

  return (
    <div className='dashboard-container'>
      <header className='dashboard-header'>
        <div className='dashboard-header-left'>
          <button className='back-btn' onClick={() => navigate('/')} title='Torna alla Home'>
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M19 12H5M12 19l-7-7 7-7' />
            </svg>
          </button>
          <h1>Area Commercianti</h1>
        </div>

        <div className='dashboard-nav'>
          <button
            className={`nav-tab ${activeTab === 'attivita' ? 'active' : ''}`}
            onClick={() => setActiveTab('attivita')}
          >
            Le Mie Attività
          </button>
          <button
            className={`nav-tab ${activeTab === 'ordini' ? 'active' : ''}`}
            onClick={() => setActiveTab('ordini')}
          >
            Ordini Ricevuti
          </button>
        </div>
        <div className='dashboard-header-right'></div>
      </header>

      <main className='dashboard-main'>
        {activeTab === 'attivita' && <MieAttivitaTab attivita={mieAttivita} navigate={navigate} />}
        {activeTab === 'ordini' && <OrdiniRicevutiTab />}
      </main>
    </div>
  );
};

export default MerchantDashboard;
