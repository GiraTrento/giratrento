import api from './axiosConfig';

// Ottieni lo storico degli ordini dell'utente loggato
export const getMyOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

// Crea una nuova prenotazione
export const createOrder = async (orderData) => {
  // orderData: { activityId, items: [{name, quantity, price}], totalAmount, pickupDate }
  const response = await api.post('/orders', orderData);
  return response.data;
};
