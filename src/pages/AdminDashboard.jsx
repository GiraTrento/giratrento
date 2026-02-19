import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importiamo i servizi admin che abbiamo creato prima
import { getPendingActivities, approveActivity, deleteActivity } from '../api/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Controllo di Sicurezza e Caricamento Dati
  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Se non è admin, lo cacciamo via!
      if (parsedUser.role !== 'admin') {
        navigate('/');
      } else {
        setUser(parsedUser);
        fetchPendingActivities(); // Scarica le attività
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. Funzione per scaricare le attività in sospeso
  const fetchPendingActivities = async () => {
    try {
      setIsLoading(true);
      const data = await getPendingActivities();
      setPendingActivities(data);
    } catch (err) {
      setError('Errore nel caricamento delle attività in sospeso.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Funzione per Approvare
  const handleApprove = async (id) => {
    try {
      await approveActivity(id);
      alert('Attività approvata con successo!');
      // Ricarica la lista per far sparire l'attività appena approvata
      fetchPendingActivities();
    } catch (err) {
      alert("Errore durante l'approvazione");
    }
  };

  // 4. Funzione per Rifiutare/Eliminare
  const handleReject = async (id) => {
    const isConfirmed = window.confirm(
      'Sei sicuro di voler rifiutare ed eliminare questa attività?'
    );
    if (!isConfirmed) return;

    try {
      await deleteActivity(id);
      alert('Attività eliminata.');
      fetchPendingActivities(); // Ricarica la lista
    } catch (err) {
      alert("Errore durante l'eliminazione");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null; // Evita sfarfallii mentre fa i controlli

  return (
    <div className='admin-container'>
      {/* Sidebar / Menu laterale o Header */}
      <div className='admin-header'>
        <h1>Pannello di Controllo Admin</h1>
        <div className='admin-actions'>
          <span>Ciao, {user.name}</span>
          <button className='logout-btn-small' onClick={handleLogout}>
            Esci
          </button>
        </div>
      </div>

      <div className='admin-content'>
        <h2>Attività in attesa di approvazione</h2>

        {isLoading ? (
          <p>Caricamento in corso...</p>
        ) : error ? (
          <p className='error-text'>{error}</p>
        ) : pendingActivities.length === 0 ? (
          <div className='empty-state'>
            <p>Nessuna attività in sospeso! Ottimo lavoro.</p>
          </div>
        ) : (
          <div className='activities-grid'>
            {pendingActivities.map((activity) => (
              <div key={activity._id} className='admin-card'>
                <h3>{activity.name}</h3>
                <p className='activity-category'>Categoria: {activity.category}</p>
                <p className='activity-desc'>{activity.description || 'Nessuna descrizione'}</p>

                <div className='admin-card-buttons'>
                  <button className='approve-btn' onClick={() => handleApprove(activity._id)}>
                    Approva
                  </button>
                  <button className='reject-btn' onClick={() => handleReject(activity._id)}>
                    Rifiuta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
