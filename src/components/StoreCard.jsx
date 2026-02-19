import React, { useState } from 'react';
import { addReview } from '../api/activityService';
import './StoreCard.css';

const categoryColors = {
  Riparazioni: '#B78A66',
  Sfuso: '#E8B931',
  'Alimentari Locali': '#14AE5C',
  'Seconda Mano': '#DB34F2',
  'Artigianato Locale': '#0091FF',
};

const StoreCard = ({ store, onClose }) => {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  if (!store) return null;

  const calculateAverageRating = () => {
    if (!store.reviews || store.reviews.length === 0) return 0;
    const sum = store.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / store.reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setReviewError('');

    try {
      const reviewData = {
        rating: newRating,
        comment: newComment,
      };

      await addReview(store._id, reviewData);

      if (!store.reviews) store.reviews = [];
      store.reviews.push({
        rating: newRating,
        comment: newComment,
        user: { name: 'Tu' },
        date: new Date().toISOString(),
      });

      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error('Errore invio recensione:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Impossibile inviare la recensione. Assicurati di aver fatto l'accesso.";
      setReviewError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='store-card-panel'>
      <button className='close-btn-x' onClick={onClose}>
        &times;
      </button>

      <div className='store-card-content'>
        <h2 className='store-name'>{store.name}</h2>

        <div className='store-meta'>
          <span
            className='store-badge'
            style={{ backgroundColor: categoryColors[store.category] || '#ccc' }}
          >
            {store.category}
          </span>

          <span className='store-average-rating'>
            {averageRating > 0
              ? `⭐ ${averageRating} / 5 (${store.reviews.length} recensioni)`
              : 'Nessuna recensione'}
          </span>
        </div>

        <p className='store-address'>{store.address || 'Indirizzo non specificato'}</p>

        {store.description && (
          <div className='store-description-box'>
            <p>{store.description}</p>
          </div>
        )}

        {store.products && store.products.length > 0 && (
          <div className='store-section'>
            <h3>Vetrina Prodotti</h3>
            <ul className='product-list'>
              {store.products.map((product, index) => (
                <li key={index} className='product-item'>
                  <span>{product.name}</span>
                  <strong>€ {product.price.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className='store-section'>
          <h3>Recensioni</h3>

          <form className='add-review-form' onSubmit={handleSubmitReview}>
            <h4>Lascia una recensione</h4>
            <div className='rating-select'>
              <label>Voto:</label>
              <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
                <option value={2}>⭐⭐ (2/5)</option>
                <option value={1}>⭐ (1/5)</option>
              </select>
            </div>
            <textarea
              placeholder='Scrivi la tua esperienza qui...'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows='3'
            />
            <button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Invio in corso...' : 'Pubblica Recensione'}
            </button>
          </form>

          <div className='reviews-list'>
            {!store.reviews || store.reviews.length === 0 ? (
              <p className='no-reviews'>Sii il primo a recensire questa attività!</p>
            ) : (
              store.reviews.map((review, index) => {
                const reviewDate = review.createdAt || review.date;
                const formattedDate = reviewDate
                  ? new Date(reviewDate).toLocaleDateString('it-IT')
                  : 'Data sconosciuta';
                const userName = review.user?.name || 'Utente';

                return (
                  <div key={index} className='review-card'>
                    <div className='review-header'>
                      <span className='review-author'>{userName}</span>
                      <span className='review-date'>{formattedDate}</span>
                    </div>
                    <div className='review-rating'>⭐ {review.rating}/5</div>
                    <p className='review-comment'>"{review.comment}"</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
