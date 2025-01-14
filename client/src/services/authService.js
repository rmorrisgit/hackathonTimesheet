import axios from 'axios';

class AuthService {
  async register(data) {
    try {
      if (this.isSignedIn()) {
        return { success: false, error: 'Cannot register a new account while logged in.' };
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Registration failed:', err.response ? err.response.data : err.message);

      if (err.response?.status === 409) {
        return { success: false, error: 'This email is already registered.' };
      }
      if (err.response?.status === 400) {
        return { success: false, error: 'Validation error. Please check your input.' };
      }

      return { success: false, error: err.response?.data?.error || 'Registration failed. Please try again.' };
    }
  }

  async SignIn(loginData) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        loginData,
        { withCredentials: true }
      );

      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('user', loginData.email);

      const supervisorEmails = [
        'research1@nscc.ca',
        'research2@nscc.ca',
        'research3@nscc.ca',
        'research4@nscc.ca',
      ];

      if (supervisorEmails.includes(loginData.email)) {
        sessionStorage.setItem('type', 'supervisor');
      } else {
        sessionStorage.setItem('type', 'employee');
      }
      return true;
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      return false;
    }
  }

  async signOut() {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, { withCredentials: true });
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('type');
      return { success: true };
    } catch (err) {
      console.error('Logout failed:', err.response ? err.response.data : err.message);
      return { success: false, error: err.response ? err.response.data : err.message };
    }
  }

  isEmployee() {
    return sessionStorage.getItem('type') === 'employee';
  }

  isSupervisor() {
    return sessionStorage.getItem('type') === 'supervisor';
  }

  isSignedIn() {
    return !!sessionStorage.getItem('isLoggedIn');
  }

  signedInUser() {
    return sessionStorage.getItem('user');
  }
}

export default new AuthService();
