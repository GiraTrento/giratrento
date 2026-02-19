import api from './axiosConfig';

// Ottieni le attività in attesa (Mappato su GET /admin/pending)
export const getPendingActivities = async () => {
  const response = await api.get('/admin/pending');
  return response.data;
};

// Approva un'attività direttamente (Mappato su PUT /admin/approve/{id})
export const approveActivity = async (id) => {
  const response = await api.put(`/admin/approve/${id}`);
  return response.data;
};

// Modifica un'attività, es. pre-approvazione (Mappato su PUT /admin/activity/{id})
export const updateActivity = async (id, updatedData) => {
  const response = await api.put(`/admin/activity/${id}`, updatedData);
  return response.data; 
};

// Rifiuta o elimina un'attività (Mappato su DELETE /admin/activity/{id})
export const deleteActivity = async (id) => {
  const response = await api.delete(`/admin/activity/${id}`);
  return response.data; 
};

// Ottieni tutti gli utenti (Mappato su GET /admin/users)
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data; 
};

// Cambia il ruolo di un utente (Mappato su PUT /admin/users/{id}/role)
export const updateUserRole = async (userId, newRole) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
  return response.data;
};
