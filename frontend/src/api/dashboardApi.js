import api from '../services/api';

export const fetchDashboardData = async (filters = {}) => {
    const response = await api.get('/data', {
        params: filters,
    });

    return response.data;
};

// Fetch filter options for dropdowns
export const fetchFilterOptions = async () => {
    const response = await api.get('/filters');

    return response.data;
};

// Fetch dashboard stats
export const fetchDashboardStats = async () => {
    const response = await api.get('/stats');

    return response.data;
};