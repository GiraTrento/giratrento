import api from './axiosConfig';

// Ottieni la lista delle attività approvate (con filtri opzionali)
export const getActivities = async (filters = {}) => {
  // filters può contenere: { category, lat, lng, dist }
  const response = await api.get('/activities', { params: filters });
  return response.data;
};

// Suggerisci una nuova attività (Richiede Token)
export const suggestActivity = async (activityData) => {
  // activityData: { name, description, category, address, location: { type, coordinates } }
  const response = await api.post('/activities', activityData);
  return response.data;
};

// Aggiungi un prodotto a un'attività specifica (Solo per Merchant, Richiede Token)
export const addProduct = async (activityId, productData) => {
  // productData: { name, price, available }
  const response = await api.post(`/activities/${activityId}/products`, productData);
  return response.data;
};

// Aggiungi una recensione a un'attività (Richiede Token)
export const addReview = async (activityId, reviewData) => {
  // reviewData: { rating, comment }
  const response = await api.post(`/activities/${activityId}/reviews`, reviewData);
  return response.data;
};
