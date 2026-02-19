import React from 'react';
import './StoreCard.css';

const categoryColors = {
  Riparazioni: '#B78A66',
  Sfuso: '#E8B931',
  'Alimentari Locali': '#14AE5C',
  'Seconda Mano': '#DB34F2',
  'Artigianato Locale': '#0091FF',
};

const StoreCard = ({ store, onClose }) => {
  if (!store) return null;

  return (
    <div className="store-card-panel">
      <div className="store-card-header">
        {/* Sostituita la "X" con un testo più pulito */}
        <button className="close-btn" onClick={onClose}>Chiudi</button>
        <span 
          className="store-badge"
          style={{ backgroundColor: categoryColors[store.category] || '#ccc' }}
        >
          {store.category}
        </span>
      </div>

      <div className="store-card-content">
        <h2 className="store-name">{store.name}</h2>
        {/* Rimossa l'emoji del pin */}
        <p className="store-address">{store.address || 'Indirizzo non specificato'}</p>
        
        <div className="store-section">
          <h3>Informazioni</h3>
          <p className="store-description">
            {store.description || 'Nessuna descrizione disponibile per questa attività.'}
          </p>
        </div>

        {store.products && store.products.length > 0 && (
          <div className="store-section">
            <h3>Vetrina Prodotti</h3>
            <ul className="product-list">
              {store.products.map((product, index) => (
                <li key={index} className="product-item">
                  <span>{product.name}</span>
                  <strong>€ {product.price.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {store.reviews && store.reviews.length > 0 && (
          <div className="store-section">
            <h3>Recensioni</h3>
            <div className="reviews-list">
              {store.reviews.map((review, index) => (
                <div key={index} className="review-card">
                  {/* Rimossa l'emoji della stella */}
                  <div className="review-rating">Voto: {review.rating} / 5</div>
                  <p>"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
