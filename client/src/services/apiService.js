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

const apiService = {
  createCoffee: async (data) => {
    console.log('Payload:', JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.post('/coffees', data);
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },

  
  getCoffeeByName: async (name) => {
    console.log(`Fetching coffee with name: ${name}`);
    try {
      const response = await apiClient.get(`/coffees`, {
        params: { name },
      });
      // Check for an exact match
      const exactMatch = response.data.find(
        (coffee) => coffee.coffeeName.toLowerCase() === name.toLowerCase()
      );
      return exactMatch || null;
    } catch (err) {
      if (err.response?.status === 404) {
        console.log(`No coffee found with name: ${name}`);
        return null;
      }
      handleError(err);
    }
  },

  getCoffees: async () => {
    console.log('Fetching all coffees...');
    try {
      
      const response = await apiClient.get('/coffees');
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },

  getCoffeeById: async (id) => {
    console.log(`Fetching coffee with ID: ${id}`);
    try {

      const response = await apiClient.get(`/coffees/${id}`);
      console.log('Fetched Coffee Data:', response); // Log response here

      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },

  updateCoffee: async (id, data) => {
    console.log(`Updating coffee with ID: ${id}`);
    console.log('Payload:', JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.put(`/coffees/${id}`, data);
      return handleResponse(response);
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      throw {
        status: err.response?.status || 500,
        message: err.response?.data?.error || 'Failed to update coffee',
      };
    }
  }
  ,

  deleteCoffee: async (id) => {
    console.log(`Deleting coffee with ID: ${id}`);
    try {
      const response = await apiClient.delete(`/coffees/${id}`);
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },
};

export default apiService;
