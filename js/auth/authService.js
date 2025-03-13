/**
 * Authentication Service
 * Handles all API calls related to user authentication
 */

const API_URL = 'https://your-render-app-name.onrender.com/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response from the API
 */
async function register(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return { success: true, data };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error during registration' };
  }
}

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Response from the API
 */
async function login(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return { success: true, data };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error during login' };
  }
}

/**
 * Logout the current user
 * @returns {Promise} - Response from the API
 */
async function logout() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include'
    });

    // Clear local storage regardless of response
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: false, message: 'Network error during logout' };
  }
}

/**
 * Get the current logged in user
 * @returns {Promise} - Response from the API
 */
async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false, message: 'No token found' };
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      // Clear invalid token
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return { success: false, message: data.message || 'Failed to get user data' };
    }
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, message: 'Network error' };
  }
}

/**
 * Check if user is authenticated
 * @returns {Boolean} - True if user is authenticated
 */
function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

/**
 * Get user data from local storage
 * @returns {Object|null} - User data or null if not authenticated
 */
function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Update user profile
 * @param {Object} profileData - User profile data to update
 * @returns {Promise} - Response from the API
 */
async function updateProfile(profileData) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(data.data));
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message || 'Profile update failed' };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Network error during profile update' };
  }
}

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @returns {Promise} - Response from the API
 */
async function changePassword(passwordData) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_URL}/user/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData),
      credentials: 'include'
    });

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, message: 'Network error during password change' };
  }
}

/**
 * Initiate Google OAuth login
 * @returns {Promise} - Redirects to Google OAuth page
 */
async function loginWithGoogle() {
  try {
    window.location.href = `${API_URL}/auth/google`;
    return { success: true };
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false, message: 'Failed to initiate Google login' };
  }
}

/**
 * Initiate Facebook OAuth login
 * @returns {Promise} - Redirects to Facebook OAuth page
 */
async function loginWithFacebook() {
  try {
    window.location.href = `${API_URL}/auth/facebook`;
    return { success: true };
  } catch (error) {
    console.error('Facebook login error:', error);
    return { success: false, message: 'Failed to initiate Facebook login' };
  }
}

/**
 * Initiate Discord OAuth login
 * @returns {Promise} - Redirects to Discord OAuth page
 */
async function loginWithDiscord() {
  try {
    window.location.href = `${API_URL}/auth/discord`;
    return { success: true };
  } catch (error) {
    console.error('Discord login error:', error);
    return { success: false, message: 'Failed to initiate Discord login' };
  }
}

/**
 * Handle OAuth callback
 * @param {Object} params - URL parameters from OAuth callback
 * @returns {Promise} - Response from the API
 */
async function handleOAuthCallback(params) {
  try {
    const response = await fetch(`${API_URL}/auth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return { success: true, data };
    } else {
      return { success: false, message: data.message || 'OAuth callback failed' };
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    return { success: false, message: 'Network error during OAuth callback' };
  }
}

// Export all functions as a global object
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getUser,
  updateProfile,
  changePassword,
  loginWithGoogle,
  loginWithFacebook,
  loginWithDiscord,
  handleOAuthCallback
};

// Make AuthService available globally
window.AuthService = AuthService; 