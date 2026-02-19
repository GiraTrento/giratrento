import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, ZoomControl, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getActivities } from '../api/activityService'; // Assicurati che il percorso sia corretto
import './Map.css';

// Mappa dei colori in base alla categoria
const categoryColors = {
  Riparazioni: '#B78A66',
  Sfuso: '#E8B931',
  'Alimentari Locali': '#14AE5C',
  'Seconda Mano': '#DB34F2',
  'Artigianato Locale': '#0091FF',
};

// Funzione per creare un Marker SVG personalizzato con il colore corretto
const createCustomIcon = (category) => {
  const color = categoryColors[category] || '#c24509'; // Colore di default se la categoria non fa match

  // Disegniamo un pin personalizzato usando SVG e inseriamo la variabile "color"
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-icon', // Classe CSS (serve per rimuovere lo sfondo di default di Leaflet)
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Il punto esatto che tocca la coordinata (la punta del pin)
    popupAnchor: [0, -32], // Dove si apre il popup rispetto al pin
  });
};

const MyMap = ({ selectedCategory }) => {
  const position = [46.069692, 11.121089];
  const [activities, setActivities] = useState([]);

  // Scarica le attività dal database appena la mappa viene caricata
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Passiamo il filtro alla funzione API
        const data = await getActivities({ category: selectedCategory });
        setActivities(data); // In SideBar si chiama setNegozi(data)
      } catch (error) {
        console.error('Errore nel caricamento:', error);
      }
    };

    fetchActivities();
  }, [selectedCategory]);

  return (
    <div>
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        className='leaflet-container'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />

        {/* Mappiamo le attività dal database e creiamo un Marker per ognuna */}
        {activities.map((activity) => {
          // Attenzione: il DB salva [Longitudine, Latitudine], ma Leaflet vuole [Latitudine, Longitudine]!
          const lat = activity.location.coordinates[1];
          const lng = activity.location.coordinates[0];

          return (
            <Marker
              key={activity._id}
              position={[lat, lng]}
              icon={createCustomIcon(activity.category)}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: categoryColors[activity.category] }}>
                    {activity.name}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>{activity.category}</p>
                  <p style={{ margin: '0', fontSize: '13px' }}>
                    {activity.address || 'Indirizzo non specificato'}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <ZoomControl position='bottomright' />
      </MapContainer>
    </div>
  );
};

export default MyMap;
