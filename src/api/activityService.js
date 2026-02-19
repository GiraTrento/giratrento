import api from './axiosConfig';

export const getActivities = async (filters = {}) => {
  const response = await api.get('/activities', { params: filters });
  return response.data;
};

export const suggestActivity = async (activityData) => {
  const response = await api.post('/activities', activityData);
  return response.data;
};

export const addProduct = async (activityId, productData) => {
  const response = await api.post(`/activities/${activityId}/products`, productData);
  return response.data;
};

export const updateProduct = async (activityId, productId, productData) => {
  const response = await api.put(`/activities/${activityId}/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (activityId, productId) => {
  const response = await api.delete(`/activities/${activityId}/products/${productId}`);
  return response.data;
};

export const addReview = async (activityId, reviewData) => {
  const response = await api.post(`/activities/${activityId}/reviews`, reviewData);
  return response.data;
};

export const getMerchantActivities = async () => {
  const response = await api.get('/merchant/activities');
  return response.data;
};
