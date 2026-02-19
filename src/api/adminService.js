import api from './axiosConfig';

export const getPendingActivities = async () => {
  const response = await api.get('/admin/pending');
  return response.data;
};

export const approveActivity = async (id) => {
  const response = await api.put(`/admin/approve/${id}`);
  return response.data;
};

export const updateActivity = async (id, updatedData) => {
  const response = await api.put(`/admin/activity/${id}`, updatedData);
  return response.data; 
};

export const deleteActivity = async (id) => {
  const response = await api.delete(`/admin/activity/${id}`);
  return response.data; 
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data; 
};

export const updateUserRole = async (userId, newRole) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
  return response.data;
};
