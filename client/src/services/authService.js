import axios from 'axios';

class AuthService {
  
  async register(data) {
    try {
      // Check if the user is already logged in
      if (this.isSignedIn()) {
        return { success: false, error: 'Cannot register a new account while logged in.' };
      }
  
      // Proceed with registration
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Registration failed:', err.response ? err.response.data : err.message);
  
      // Handle specific error cases
      if (err.response?.status === 409) {
        return { success: false, error: 'This email is already registered.' };
      }
      if (err.response?.status === 400) {
        return { success: false, error: 'Validation error. Please check your input.' };
      }
  
      // Generic error handling
      return { success: false, error: err.response?.data?.error || 'Registration failed. Please try again.' };
    }
  }
  

  async SignIn(loginData) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        loginData,
        { withCredentials: true } // Include credentials to handle HTTP-only cookies
      );
  
      // Store session data
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('user', loginData.email);
      //set employee type. build out is employee. 
      if( loginDataEmail == 'researchNSCC@nscc.ca') {
        sessionStorage.setItem('type', 'supervisor')
      } else {
        sessionStorage.setItem('type', 'employee')
      }
      return true; // Login was successful
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
  
      return false; // Login failed
    }
  }
  
  

  async signOut() {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, { withCredentials: true });
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('user');
      return { success: true };
    } catch (err) {
      console.error('Logout failed:', err.response ? err.response.data : err.message);
      return { success: false, error: err.response ? err.response.data : err.message };
    }
  }
// isEmployee method 

  isEmployee() {
    return sessionStorage.getItem('type') == 'employee';
  }



  isSignedIn() {
    return !!sessionStorage.getItem('isLoggedIn');
  }

  signedInUser() {
    return sessionStorage.getItem('user');
  }
}

export default new AuthService();