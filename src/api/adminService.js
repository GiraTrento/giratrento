// src/api/adminService.js
import api from './axiosConfig';

// Ottieni la lista delle attività in attesa di approvazione (Solo Admin)
export const getPendingActivities = async () => {
  const response = await api.get('/admin/pending');
  return response.data;
};

// Approva un'attività in sospeso (Solo Admin)
export const approveActivity = async (activityId) => {
  const response = await api.put(`/admin/approve/${activityId}`);
  return response.data;
};

// Rifiuta ed elimina un'attività in sospeso (Solo Admin)
export const deleteActivity = async (activityId) => {
  const response = await api.delete(`/admin/activity/${activityId}`);
  return response.data;
};
