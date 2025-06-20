import api from './api';

export const getJournals = async () => {
  const response = await api.get('/journals');
  return response.data;
};

export const getMyJournals = async () => {
  const response = await api.get('/my-journals');
  return response.data;
};

export const getJournal = async (id) => {
  const response = await api.get(`/journals/${id}`);
  return response.data;
};

export const createJournal = async (journalData) => {
  const response = await api.post('/journals', journalData);
  return response.data;
};

export const updateJournal = async (id, journalData) => {
  const response = await api.put(`/journals/${id}`, journalData);
  return response.data;
};

export const deleteJournal = async (id) => {
  await api.delete(`/journals/${id}`);
};

export const searchJournals = async (query) => {
  const response = await api.get('/journals/search', { params: { query } });
  return response.data;
};

export const filterByDate = async (date) => {
  const response = await api.get(`/journals/date/${date}`);
  return response.data;
};

export const getJournalSummary = async (id) => {
  const response = await api.get(`/journals/${id}/summary`);
  return response.data;
};