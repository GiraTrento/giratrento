import { MapContainer, TileLayer, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import './Map.css';

const MyMap = () => {
  const position = [46.069692, 11.121089];

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

        <ZoomControl position='bottomright' />
      </MapContainer>
    </div>
  );
};

export default MyMap;
