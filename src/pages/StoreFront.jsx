import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StoreFront.css';

const StoreFront = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const store = state?.store;

  if (!store) {
    return (
      <div className='storefront-error'>
        <h2>Ops! Negozio non trovato.</h2>
        <button onClick={() => navigate('/')}>Torna alla Mappa</button>
      </div>
    );
  }

  return (
    <div className='storefront-container'>
      <header className='storefront-header'>
        <button className='back-btn' onClick={() => navigate(-1)}>
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
        <div className='storefront-title-area'>
          <h1>Vetrina: {store.name}</h1>
          <p>{store.address}</p>
        </div>
      </header>

      <main className='storefront-main'>
        <div className='products-section'>
          <h2>I Nostri Prodotti</h2>

          {!store.products || store.products.length === 0 ? (
            <p className='no-products'>
              Questo negozio non ha ancora aggiunto prodotti alla sua vetrina.
            </p>
          ) : (
            <div className='products-grid'>
              {store.products.map((product, index) => (
                <div key={index} className='product-card'>
                  <div className='product-info'>
                    <h3>{product.name}</h3>
                    <p className='product-price'>€ {product.price.toFixed(2)}</p>
                  </div>
                  <button
                    className='btn-add-cart'
                    disabled={!product.available}
                    onClick={() => alert('Funzionalità carrello in arrivo!')}
                  >
                    {product.available ? '+ Aggiungi' : 'Esaurito'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StoreFront;
