import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const handleError = (err) => {
  console.error('Full API Error:', err);
  console.error('Error Details:', err.response?.data || err.message);
  // Return a structured error object for better handling in the frontend
  if (err.response) {
    throw {
      status: err.response.status,
      message: err.response.data?.error || 'An error occurred. Please try again.',
    };
  }
  throw { status: 500, message: 'Network or server error. Please try again.' };
};

const handleResponse = (response) => {
  console.log('API Response:', response.data);
  return response.data;
};

const timesheetService = {
  createTimesheet: async (data) => {
    console.log('Creating Timesheet Payload:', JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.post('/timesheets', data);
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },
  

  getTimesheets: async () => {
    console.log('Fetching all timesheets...');
    try {
      const response = await apiClient.get('/timesheets');
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },

  getTimesheetById: async (id) => {
    console.log(`Fetching timesheet with ID: ${id}`);
    try {
      const response = await apiClient.get(`/timesheets/${id}`);
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },

  getTimesheetsByEmployee: async (wNum) => {
    console.log(`Fetching timesheets for employee with W# ${wNum}`);
    try {
      const response = await apiClient.get(`/timesheets`, {
        params: { wNum },
      });
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },

  updateTimesheet: async (id, data) => {
    console.log(`Updating timesheet with ID: ${id}`);
    console.log('Payload:', JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.put(`/timesheets/${id}`, data);
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },

  deleteTimesheet: async (id) => {
    console.log(`Deleting timesheet with ID: ${id}`);
    try {
      const response = await apiClient.delete(`/timesheets/${id}`);
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },
};

export default timesheetService;
