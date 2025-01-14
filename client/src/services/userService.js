import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

const handleError = (err) => {
  console.error('Full API Error:', err);
  console.error('Error Details:', err.response?.data || err.message);

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

const userService = {
  /**
   * Fetch logged-in user's data
   * @returns {Promise<Object>} User data
   */
  getUserData: async () => {
    console.log('Fetching logged-in user data...');
    try {
      const response = await apiClient.get('/users/me'); // Use the appropriate backend endpoint
      return handleResponse(response);
    } catch (err) {
      handleError(err);
    }
  },
};

export default userService;
