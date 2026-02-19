import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css'; // Assicurati che il file CSS si chiami ancora così, oppure rinominalo in AdminDashboard.css

// Importiamo tutte le vere API
import { getActivities, getPendingActivities, updateActivity, deleteActivity } from '../api/activityService';
import { getAllUsers, updateUserRole } from '../api/userService';

const COLORS = ['#B78A66', '#E8B931', '#14AE5C', '#DB34F2', '#0091FF'];
const MESI_NOMI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

/* =========================================
   1. SCHEDA STATISTICHE (Dati Reali)
   ========================================= */
const StatisticheTab = () => {
  const [categorieData, setCategorieData] = useState([]);
  const [utentiData, setUtentiData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Dati per il grafico a torta (Attività)
        const activities = await getActivities({});
        const categoryCount = activities.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1;
          return acc;
        }, {});
        
        const chartData = Object.keys(categoryCount).map(key => ({
          name: key,
          value: categoryCount[key]
        }));
        setCategorieData(chartData);

        // 2. Dati per il grafico a linee (Utenti)
        const users = await getAllUsers();
        const monthCounts = { 'Gen': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'Mag': 0, 'Giu': 0, 'Lug': 0, 'Ago': 0, 'Set': 0, 'Ott': 0, 'Nov': 0, 'Dic': 0 };
        
        // Raggruppa gli utenti in base al mese in cui si sono registrati
        users.forEach(user => {
          const creationDate = user.createdAt || user.date;
          if (creationDate) {
            const date = new Date(creationDate);
            const month = MESI_NOMI[date.getMonth()];
            if (monthCounts[month] !== undefined) monthCounts[month]++;
          } else {
            // Se non c'è la data, li mettiamo in Gennaio per non perderli
            monthCounts['Gen']++; 
          }
        });

        // Trasforma l'oggetto in un array per Recharts
        const chartUsersData = MESI_NOMI.map(m => ({ mese: m, utenti: monthCounts[m] }));
        setUtentiData(chartUsersData);

      } catch (error) {
        console.error("Errore nel caricamento delle statistiche:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Panoramica Statistiche</h2>
      <div className="charts-container">
        <div className="chart-box">
          <h3>Attività per Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categorieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                {categorieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3>Crescita Utenti Registrati</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={utentiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mese" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="utenti" stroke="#c24509" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   2. SCHEDA PROPOSTE
   ========================================= */
const ProposteTab = () => {
  const [proposte, setProposte] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    // Scarica le proposte reali dal server
    getPendingActivities()
      .then(setProposte)
      .catch(err => console.error("Errore recupero proposte:", err));
  }, []);

  const startEditing = (proposta) => {
    setEditingId(proposta._id);
    setEditForm({ ...proposta });
  };

  const handleSaveAndApprove = async () => {
    try {
      // Mandiamo al server i dati aggiornati, aggiungendo isApproved: true
      await updateActivity(editingId, { ...editForm, isApproved: true });
      
      setProposte(proposte.filter(p => p._id !== editingId));
      setEditingId(null);
      alert("Attività approvata e pubblicata con successo!");
    } catch (error) {
      console.error("Errore durante l'approvazione:", error);
      alert("Impossibile approvare. Controlla la console.");
    }
  };

  const handleReject = async (id) => {
    if(window.confirm("Sei sicuro di voler rifiutare ed eliminare definitivamente questa proposta?")) {
      try {
        await deleteActivity(id);
        setProposte(proposte.filter(p => p._id !== id));
      } catch (error) {
        console.error("Errore durante il rifiuto:", error);
      }
    }
  };

  return (
    <div className="admin-panel">
      <h2>Gestione Proposte</h2>
      <p>Modifica o approva le attività suggerite dagli utenti.</p>
      
      {proposte.length === 0 && <p style={{ marginTop: '20px', fontStyle: 'italic' }}>Nessuna nuova proposta in attesa.</p>}

      <div className="admin-list">
        {proposte.map(proposta => (
          <div key={proposta._id} className="admin-list-item">
            {editingId === proposta._id ? (
              <div className="edit-proposta-form">
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  placeholder="Nome attività"
                />
                <select 
                  value={editForm.category} 
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                >
                  <option value="Riparazioni">Riparazioni</option>
                  <option value="Sfuso">Sfuso</option>
                  <option value="Alimentari Locali">Alimentari Locali</option>
                  <option value="Seconda Mano">Seconda Mano</option>
                  <option value="Artigianato Locale">Artigianato Locale</option>
                </select>
                <input 
                  type="text" 
                  value={editForm.address} 
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
                  placeholder="Indirizzo"
                />
                <div className="admin-actions">
                  <button className="btn-approve" onClick={handleSaveAndApprove}>Salva & Approva</button>
                  <button className="btn-edit" onClick={() => setEditingId(null)}>Annulla</button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <strong>{proposta.name}</strong> - {proposta.category} <br/>
                  <small>{proposta.address || 'Nessun indirizzo specificato'}</small>
                </div>
                <div className="admin-actions">
                  <button className="btn-edit" onClick={() => startEditing(proposta)}>Modifica</button>
                  <button className="btn-approve" onClick={() => handleSaveAndApprove(proposta)}>Approva</button>
                  <button className="btn-reject" onClick={() => handleReject(proposta._id)}>Rifiuta</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   3. SCHEDA ATTIVITÀ ESISTENTI
   ========================================= */
const AttivitaTab = () => {
  const [attivita, setAttivita] = useState([]);
  
  useEffect(() => {
    getActivities({})
      .then(setAttivita)
      .catch(err => console.error("Errore recupero attività:", err));
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("ATTENZIONE: Sei sicuro di voler eliminare questa attività online? L'azione è irreversibile.")) {
      try {
        await deleteActivity(id);
        setAttivita(attivita.filter(a => a._id !== id));
      } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
      }
    }
  };

  return (
    <div className="admin-panel">
      <h2>Attività Esistenti</h2>
      {attivita.length === 0 && <p>Nessuna attività approvata trovata.</p>}
      <div className="admin-list">
        {attivita.map(att => (
          <div key={att._id} className="admin-list-item">
            <div><strong>{att.name}</strong> - {att.category}</div>
            <div className="admin-actions">
              <button className="btn-delete" onClick={() => handleDelete(att._id)}>Rimuovi</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   4. SCHEDA UTENTI
   ========================================= */
const UtentiTab = () => {
  const [utenti, setUtenti] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then(setUtenti)
      .catch(err => console.error("Errore recupero utenti:", err));
  }, []);

  const handleChangeRole = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      // Aggiorniamo lo stato locale per mostrare la modifica istantaneamente
      setUtenti(utenti.map(u => u._id === id ? { ...u, role: newRole } : u));
      alert(`Ruolo aggiornato con successo a ${newRole}!`);
    } catch (error) {
      console.error("Errore modifica ruolo:", error);
      alert("Impossibile modificare il ruolo. Controlla i permessi.");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Gestione Ruoli Utenti</h2>
      <div className="admin-list">
        {utenti.map(user => (
          <div key={user._id} className="admin-list-item">
            <div><strong>{user.name}</strong> ({user.email})</div>
            <select 
              value={user.role} 
              onChange={(e) => handleChangeRole(user._id, e.target.value)}
            >
              <option value="user">Utente Base</option>
              <option value="admin">Amministratore</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   COMPONENTE PRINCIPALE DASHBOARD
   ========================================= */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('statistiche');
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <button className="back-btn" onClick={() => navigate('/')} title="Torna alla Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-nav">
          <button className={`nav-tab ${activeTab === 'statistiche' ? 'active' : ''}`} onClick={() => setActiveTab('statistiche')}>Statistiche</button>
          <button className={`nav-tab ${activeTab === 'proposte' ? 'active' : ''}`} onClick={() => setActiveTab('proposte')}>Proposte</button>
          <button className={`nav-tab ${activeTab === 'attivita' ? 'active' : ''}`} onClick={() => setActiveTab('attivita')}>Attività Esistenti</button>
          <button className={`nav-tab ${activeTab === 'utenti' ? 'active' : ''}`} onClick={() => setActiveTab('utenti')}>Ruoli Utenti</button>
        </div>
        
        <div className="dashboard-header-right"></div>
      </header>

      <main className="dashboard-main">
        {activeTab === 'statistiche' && <StatisticheTab />}
        {activeTab === 'proposte' && <ProposteTab />}
        {activeTab === 'attivita' && <AttivitaTab />}
        {activeTab === 'utenti' && <UtentiTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
