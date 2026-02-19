import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

import { getActivities } from '../api/activityService';
import {
  getPendingActivities,
  approveActivity,
  updateActivity,
  deleteActivity,
  getAllUsers,
  updateUserRole,
} from '../api/adminService';

// MAPPA COLORI FISSI PER CATEGORIA
const CATEGORY_COLORS = {
  'Riparazioni': '#B78A66', // Blu
  'Sfuso': '#E8B931', // Verde
  'Alimentari Locali': '#14AE5C', // Giallo
  'Seconda Mano': '#DB34F2', // Viola
  'Artigianato Locale': '#0091FF',
};

const MESI_NOMI = [
  'Gen',
  'Feb',
  'Mar',
  'Apr',
  'Mag',
  'Giu',
  'Lug',
  'Ago',
  'Set',
  'Ott',
  'Nov',
  'Dic',
];

const StatisticheTab = () => {
  const [categorieData, setCategorieData] = useState([]);
  const [utentiData, setUtentiData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activities = await getActivities({});
        const categoryCount = activities.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1;
          return acc;
        }, {});

        setCategorieData(
          Object.keys(categoryCount).map((key) => ({
            name: key,
            value: categoryCount[key],
          }))
        );

        const users = await getAllUsers();
        const monthCounts = {
          Gen: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          Mag: 0,
          Giu: 0,
          Lug: 0,
          Ago: 0,
          Set: 0,
          Ott: 0,
          Nov: 0,
          Dic: 0,
        };

        users.forEach((user) => {
          const creationDate = user.createdAt || user.date;
          if (creationDate) {
            const date = new Date(creationDate);
            monthCounts[MESI_NOMI[date.getMonth()]]++;
          } else {
            monthCounts['Gen']++;
          }
        });

        setUtentiData(MESI_NOMI.map((m) => ({ mese: m, utenti: monthCounts[m] })));
      } catch (error) {
        console.error('Errore statistiche:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className='admin-panel'>
      <h2>Panoramica Statistiche</h2>
      <div className='charts-container'>
        <div className='chart-box'>
          <h3>Attività per Categoria</h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={categorieData}
                cx='50%'
                cy='50%'
                outerRadius={100}
                fill='#8884d8'
                dataKey='value'
                label
              >
                {categorieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='chart-box'>
          <h3>Crescita Utenti Registrati</h3>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={utentiData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='mese' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='utenti'
                stroke='#c24509'
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ProposteTab = () => {
  const [proposte, setProposte] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    getPendingActivities().then(setProposte).catch(console.error);
  }, []);

  const startEditing = (proposta) => {
    setEditingId(proposta._id);
    setEditForm({
      ...proposta,
      lng: proposta.location?.coordinates?.[0] || '',
      lat: proposta.location?.coordinates?.[1] || '',
    });
  };

  const handleSaveAndApprove = async () => {
    try {
      const dataToSave = {
        ...editForm,
        isApproved: true,
        location: {
          type: 'Point',
          coordinates: [parseFloat(editForm.lng) || 0, parseFloat(editForm.lat) || 0],
        },
      };

      await updateActivity(editingId, dataToSave);
      setProposte(proposte.filter((p) => p._id !== editingId));
      setEditingId(null);
    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('Impossibile salvare le modifiche.');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Rifiutare ed eliminare definitivamente questa proposta?')) {
      try {
        await deleteActivity(id);
        setProposte(proposte.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Errore rifiuto:', error);
      }
    }
  };

  return (
    <div className='admin-panel'>
      <h2>Gestione Proposte</h2>

      {proposte.length === 0 && (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>Nessuna nuova proposta.</p>
      )}

      <div className='admin-list'>
        {proposte.map((proposta) => (
          <div key={proposta._id} className='admin-list-item'>
            {editingId === proposta._id ? (
              <div className='edit-proposta-form'>
                <input
                  type='text'
                  className='full-width'
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder='Nome Attività'
                />

                <textarea
                  className='full-width'
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Descrizione dell'attività..."
                  rows='3'
                />

                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value='Riparazioni'>Riparazioni</option>
                  <option value='Sfuso'>Sfuso</option>
                  <option value='Alimentari Locali'>Alimentari Locali</option>
                  <option value='Seconda Mano'>Seconda Mano</option>
                  <option value='Artigianato Locale'>Artigianato Locale</option>
                </select>

                <input
                  type='text'
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder='Indirizzo fisico'
                />

                <input
                  type='number'
                  step='any'
                  value={editForm.lat}
                  onChange={(e) => setEditForm({ ...editForm, lat: e.target.value })}
                  placeholder='Latitudine (es. 46.06)'
                />
                <input
                  type='number'
                  step='any'
                  value={editForm.lng}
                  onChange={(e) => setEditForm({ ...editForm, lng: e.target.value })}
                  placeholder='Longitudine (es. 11.12)'
                />

                <div className='admin-actions full-width'>
                  <button className='btn-approve' onClick={handleSaveAndApprove}>
                    Salva & Approva
                  </button>
                  <button className='btn-edit' onClick={() => setEditingId(null)}>
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <strong>{proposta.name}</strong> - {proposta.category} <br />
                  <small>{proposta.address || 'Nessun indirizzo'}</small>
                </div>
                <div className='admin-actions'>
                  <button className='btn-edit' onClick={() => startEditing(proposta)}>
                    Revisiona e Approva
                  </button>
                  <button className='btn-reject' onClick={() => handleReject(proposta._id)}>
                    Rifiuta
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AttivitaTab = () => {
  const [attivita, setAttivita] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    getActivities({}).then(setAttivita).catch(console.error);
  }, []);

  const startEditing = (att) => {
    setEditingId(att._id);
    setEditForm({
      ...att,
      lng: att.location?.coordinates?.[0] || '',
      lat: att.location?.coordinates?.[1] || '',
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...editForm,
        location: {
          type: 'Point',
          coordinates: [parseFloat(editForm.lng) || 0, parseFloat(editForm.lat) || 0],
        },
      };

      await updateActivity(editingId, dataToSave);

      setAttivita(attivita.map((a) => (a._id === editingId ? { ...a, ...dataToSave } : a)));
      setEditingId(null);
    } catch (error) {
      console.error('Errore salvataggio:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare definitivamente questa attività?')) {
      try {
        await deleteActivity(id);
        setAttivita(attivita.filter((a) => a._id !== id));
      } catch (error) {
        console.error('Errore eliminazione:', error);
      }
    }
  };

  return (
    <div className='admin-panel'>
      <h2>Gestione Attività</h2>

      <div className='admin-list'>
        {attivita.length === 0 && <p>Nessuna attività approvata trovata.</p>}
        {attivita.map((att) => (
          <div key={att._id} className='admin-list-item'>
            {editingId === att._id ? (
              <div className='edit-proposta-form'>
                <input
                  type='text'
                  className='full-width'
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder='Nome Attività'
                />

                <textarea
                  className='full-width'
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Descrizione dell'attività..."
                  rows='3'
                />

                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value='Riparazioni'>Riparazioni</option>
                  <option value='Sfuso'>Sfuso</option>
                  <option value='Alimentari Locali'>Alimentari Locali</option>
                  <option value='Seconda Mano'>Seconda Mano</option>
                  <option value='Artigianato Locale'>Artigianato Locale</option>
                </select>

                <input
                  type='text'
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder='Indirizzo fisico'
                />

                <input
                  type='number'
                  step='any'
                  value={editForm.lat}
                  onChange={(e) => setEditForm({ ...editForm, lat: e.target.value })}
                  placeholder='Latitudine (es. 46.06)'
                />
                <input
                  type='number'
                  step='any'
                  value={editForm.lng}
                  onChange={(e) => setEditForm({ ...editForm, lng: e.target.value })}
                  placeholder='Longitudine (es. 11.12)'
                />

                <div className='admin-actions full-width'>
                  <button className='btn-approve' onClick={handleSave}>
                    Salva Modifiche
                  </button>
                  <button className='btn-edit' onClick={() => setEditingId(null)}>
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <strong>{att.name}</strong> - {att.category} <br />
                  <small>{att.address || 'Nessun indirizzo'}</small>
                </div>
                <div className='admin-actions'>
                  <button className='btn-edit' onClick={() => startEditing(att)}>
                    Modifica
                  </button>
                  <button className='btn-delete' onClick={() => handleDelete(att._id)}>
                    Rimuovi
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const UtentiTab = () => {
  const [utenti, setUtenti] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUtenti).catch(console.error);
  }, []);

  const handleChangeRole = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      setUtenti(utenti.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error('Errore modifica ruolo:', error);
      alert(error.response?.data?.message || 'Impossibile modificare il ruolo.');
    }
  };

  return (
    <div className='admin-panel'>
      <h2>Gestione Ruoli Utenti</h2>
      <div className='admin-list'>
        {utenti.map((user) => (
          <div key={user._id} className='admin-list-item'>
            <div>
              <strong>{user.name}</strong> ({user.email})
            </div>
            <select value={user.role} onChange={(e) => handleChangeRole(user._id, e.target.value)}>
              <option value='user'>Utente</option>
              <option value='merchant'>Commerciante</option>
              <option value='admin'>Amministratore</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('statistiche');
  const navigate = useNavigate();

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
          <h1>Dashboard</h1>
        </div>

        <div className='dashboard-nav'>
          <button
            className={`nav-tab ${activeTab === 'statistiche' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistiche')}
          >
            Statistiche
          </button>
          <button
            className={`nav-tab ${activeTab === 'proposte' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposte')}
          >
            Proposte
          </button>
          <button
            className={`nav-tab ${activeTab === 'attivita' ? 'active' : ''}`}
            onClick={() => setActiveTab('attivita')}
          >
            Attività
          </button>
          <button
            className={`nav-tab ${activeTab === 'utenti' ? 'active' : ''}`}
            onClick={() => setActiveTab('utenti')}
          >
            Ruoli Utenti
          </button>
        </div>
        <div className='dashboard-header-right'></div>
      </header>

      <main className='dashboard-main'>
        {activeTab === 'statistiche' && <StatisticheTab />}
        {activeTab === 'proposte' && <ProposteTab />}
        {activeTab === 'attivita' && <AttivitaTab />}
        {activeTab === 'utenti' && <UtentiTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
