import axios from 'axios';

class AuthService {
  async register(data) {
    try {
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

      // Mark as logged in
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('user', loginData.email);

      // Extract role and group from the backend response
      const userRole = response.data.user?.role || 'employee'; // Default to 'employee' if undefined
      const userGroup = response.data.user?.group || 'unknown'; // Default to 'unknown' if undefined

      // Save role and group in session storage
      sessionStorage.setItem('type', userRole);
      sessionStorage.setItem('group', userGroup);

      return true;
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      return false;
    }
  }

  async signOut() {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, { withCredentials: true });
      sessionStorage.clear();
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

  userGroup() {
    return sessionStorage.getItem('group') || 'unknown';
  }
}

export default new AuthService();
