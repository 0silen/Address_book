import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    getContacts() {
        return apiClient.get('/contacts');
    },
    getContact(id) {
        return apiClient.get(`/contacts/${id}`);
    },
    createContact(contact) {
        return apiClient.post('/contacts', contact);
    },
    updateContact(id, contact) {
        return apiClient.put(`/contacts/${id}`, contact);
    },
    deleteContact(id) {
        return apiClient.delete(`/contacts/${id}`);
    },
    searchContacts(query) {
        return apiClient.get('/contacts/search', {params: {query}});
    },
    importContacts(contacts) {
        return apiClient.post('/contacts/import', contacts);
    },
    exportContacts() {
        return apiClient.get('/contacts/export');
    },
    mergeContacts() {
        return apiClient.post('/contacts/merge');
    }
};