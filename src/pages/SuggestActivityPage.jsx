import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { suggestActivity } from '../api/activityService';
import './SuggestActivityPage.css';

// --- IMPORTAZIONI PER LA MAPPA ---
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// FIX per l'icona del segnalino (Vite a volte "perde" le immagini di default di Leaflet)
const defaultIcon = new Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// COMPONENTE INVISIBILE CHE ASCOLTA I CLICK SULLA MAPPA
const MapClickHandler = ({ formData, setFormData }) => {
  useMapEvents({
    click(e) {
      // Quando clicchi, aggiorna lo stato del form con le nuove coordinate
      setFormData((prev) => ({
        ...prev,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      }));
    },
  });

  // Se ci sono lat e lng nel form, mostra il segnalino
  return formData.lat && formData.lng ? (
    <Marker position={[formData.lat, formData.lng]} icon={defaultIcon} />
  ) : null;
};
// ---------------------------------

const SuggestActivityPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Devi accedere per suggerire una nuova attività.');
      navigate('/login');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    lat: '',
    lng: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category || !formData.lat || !formData.lng) {
      setError(
        'Compila tutti i campi obbligatori e clicca sulla mappa per impostare la posizione.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const activityData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        address: formData.address,
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)],
        },
      };

      await suggestActivity(activityData);
      setSuccess(true);
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Errore durante l'invio della richiesta.";
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className='suggest-container'>
        <div className='suggest-card success-card'>
          <h1>🎉 Grazie!</h1>
          <p>
            La tua attività è stata inviata con successo ed è in attesa di approvazione da parte di
            un amministratore.
          </p>
          <button className='back-btn' onClick={() => navigate('/')}>
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  // Coordinate di default su Trento se l'utente non ha ancora cliccato
  const defaultCenter = [46.0678, 11.121];

  return (
    <div className='suggest-container'>
      <div className='suggest-card'>
        <h1 className='suggest-title'>Suggerisci un Negozio</h1>
        <p className='suggest-subtitle'>Conosci un'attività sostenibile? Aggiungila alla mappa!</p>

        <form onSubmit={handleSubmit} className='suggest-form'>
          <div className='input-group'>
            <label>Nome Attività *</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Es. Trento Sfuso'
              disabled={isLoading}
            />
          </div>
          <div className='input-group'>
            <label>Categoria *</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value='' disabled>
                Seleziona una categoria...
              </option>
              <option value='Riparazioni'>Riparazioni</option>
              <option value='Sfuso'>Sfuso</option>
              <option value='Alimentari Locali'>Alimentari Locali</option>
              <option value='Seconda Mano'>Seconda Mano</option>
              <option value='Artigianato Locale'>Artigianato Locale</option>
            </select>
          </div>
          <div className='input-group'>
            <label>Indirizzo (opzionale)</label>
            <input
              type='text'
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='Es. Via Roma 10, Trento'
              disabled={isLoading}
            />
          </div>
          <div className='input-group'>
            <label>Descrizione (opzionale)</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Cosa vende questo negozio?'
              rows='3'
              disabled={isLoading}
            />
          </div>

          {/* --- INIZIO SEZIONE MAPPA --- */}
          <div className='input-group' style={{ marginTop: '20px' }}>
            <label style={{ marginBottom: '10px', display: 'block' }}>
              Posizione sulla mappa *{' '}
              <span style={{ fontWeight: 'normal', fontSize: '13px' }}>
                (Clicca per posizionare il cursore)
              </span>
            </label>

            {/* IL TRUCCO DEFINITIVO: 
              1. Altezza fissa in pixel DIRETTAMENTE nel MapContainer
              2. zIndex: 1 per evitare che copra l'intera pagina 
            */}
            <MapContainer
              center={defaultCenter}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                position: 'relative',
                height: '400px',
                width: '100%',
                borderRadius: '8px',
                border: '2px solid #e6cca0',
                zIndex: 1 /* Fondamentale per non farlo sovrapporre a tutto */,
              }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <MapClickHandler formData={formData} setFormData={setFormData} />
            </MapContainer>

            {/* Mostra le coordinate sotto la mappa */}
            {formData.lat && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#fff9ed',
                  border: '1px solid #e6cca0',
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: '#c24509',
                }}
              >
                <strong>Coordinate selezionate:</strong> {formData.lat.toFixed(5)},{' '}
                {formData.lng.toFixed(5)}
              </div>
            )}
          </div>
          {/* --- FINE SEZIONE MAPPA --- */}

          {error && <p className='error-message'>{error}</p>}
          <button type='submit' className='submit-btn' disabled={isLoading}>
            {isLoading ? 'Invio in corso...' : 'Invia Suggerimento'}
          </button>
        </form>

        <button type='button' className='cancel-btn' onClick={() => navigate('/')}>
          Annulla
        </button>
      </div>
    </div>
  );
};

export default SuggestActivityPage;
