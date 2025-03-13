/**
 * Authentication Module
 * Handles user authentication, registration, and profile management
 */

// DOM Elements
const authModal = document.getElementById('auth-modal');
const profileModal = document.getElementById('profile-modal');
const authClose = document.getElementById('auth-close');
const profileClose = document.getElementById('profile-close');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('profile-form');
const passwordForm = document.getElementById('password-form');
const authError = document.getElementById('auth-error');
const authSuccess = document.getElementById('auth-success');
const profileError = document.getElementById('profile-error');
const profileSuccess = document.getElementById('profile-success');
const authTabs = document.querySelectorAll('.auth-tab');
const authFormWrapper = document.querySelector('.auth-form-wrapper');
const authToggleRegister = document.getElementById('auth-toggle-register');
const logoutButton = document.getElementById('logout-button');

// Navigation Elements
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const mobileLoginButton = document.getElementById('mobile-login-button');
const mobileRegisterButton = document.getElementById('mobile-register-button');
const profileButton = document.getElementById('profile-button');
const mobileProfileButton = document.getElementById('mobile-profile-button');
const userInitials = document.querySelectorAll('.user-initial');
const userNames = document.querySelectorAll('.user-name');

// Social Login Buttons
const googleLoginButton = document.querySelector('.auth-social-button.google');
const facebookLoginButton = document.querySelector('.auth-social-button.facebook');
const discordLoginButton = document.querySelector('.auth-social-button.discord');

/**
 * Initialize the authentication module
 */
function init() {
  console.log('Initializing auth module');
  
  // Check if all elements are found
  if (!authModal) console.error('Auth modal not found');
  if (!loginButton) console.error('Login button not found');
  if (!registerButton) console.error('Register button not found');
  
  // Check if user is already logged in
  checkAuthStatus();
  
  // Check for OAuth callback
  checkOAuthCallback();
  
  // Event listeners
  setupEventListeners();
}

/**
 * Check for OAuth callback parameters in URL
 */
function checkOAuthCallback() {
  console.log('Checking for OAuth callback');
  
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');
  
  if (code && state) {
    console.log('OAuth callback detected');
    
    // Remove parameters from URL without refreshing the page
    const url = new URL(window.location);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, document.title, url);
    
    // Handle OAuth callback
    handleOAuthCallback({ code, state });
  } else if (error) {
    console.error('OAuth error:', error);
    showError(authError, `Authentication failed: ${error}`);
    
    // Remove error parameter from URL
    const url = new URL(window.location);
    url.searchParams.delete('error');
    window.history.replaceState({}, document.title, url);
  }
}

/**
 * Handle OAuth callback
 * @param {Object} params - OAuth callback parameters
 */
async function handleOAuthCallback(params) {
  console.log('Handling OAuth callback');
  
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(authError, 'Authentication service not available');
      return;
    }
    
    const response = await window.AuthService.handleOAuthCallback(params);
    console.log('OAuth callback response:', response);
    
    if (response.success) {
      showSuccess(authSuccess, 'Login successful!');
      updateUserUI(response.data.user);
    } else {
      showError(authError, response.message || 'Authentication failed');
      openAuthModal('login');
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    showError(authError, 'An error occurred during authentication');
    openAuthModal('login');
  }
}

/**
 * Set up event listeners for authentication elements
 */
function setupEventListeners() {
  console.log('Setting up event listeners');
  
  // Open auth modal
  if (loginButton) {
    loginButton.addEventListener('click', (e) => {
      console.log('Login button clicked');
      e.preventDefault();
      openAuthModal('login');
    });
  }
  
  if (registerButton) {
    registerButton.addEventListener('click', (e) => {
      console.log('Register button clicked');
      e.preventDefault();
      openAuthModal('register');
    });
  }
  
  if (mobileLoginButton) {
    mobileLoginButton.addEventListener('click', (e) => {
      console.log('Mobile login button clicked');
      e.preventDefault();
      openAuthModal('login');
    });
  }
  
  if (mobileRegisterButton) {
    mobileRegisterButton.addEventListener('click', (e) => {
      console.log('Mobile register button clicked');
      e.preventDefault();
      openAuthModal('register');
    });
  }
  
  // Close modals
  if (authClose) {
    authClose.addEventListener('click', () => {
      console.log('Auth close button clicked');
      closeAuthModal();
    });
  }
  
  if (profileClose) {
    profileClose.addEventListener('click', () => {
      console.log('Profile close button clicked');
      closeProfileModal();
    });
  }
  
  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      console.log('Tab clicked:', tabName);
      switchTab(tabName);
    });
  });
  
  // Toggle between login and register
  if (authToggleRegister) {
    authToggleRegister.addEventListener('click', (e) => {
      console.log('Toggle register link clicked');
      e.preventDefault();
      switchTab('register');
    });
  }
  
  // Form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      console.log('Login form submitted');
      handleLogin(e);
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      console.log('Register form submitted');
      handleRegister(e);
    });
  }
  
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      console.log('Profile form submitted');
      handleProfileUpdate(e);
    });
  }
  
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      console.log('Password form submitted');
      handlePasswordChange(e);
    });
  }
  
  // Logout
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      console.log('Logout button clicked');
      handleLogout();
    });
  }
  
  // Profile button
  if (profileButton) {
    profileButton.addEventListener('click', (e) => {
      console.log('Profile button clicked');
      e.preventDefault();
      openProfileModal();
    });
  }
  
  if (mobileProfileButton) {
    mobileProfileButton.addEventListener('click', (e) => {
      console.log('Mobile profile button clicked');
      e.preventDefault();
      openProfileModal();
    });
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      console.log('Clicked outside auth modal');
      closeAuthModal();
    }
    if (e.target === profileModal) {
      console.log('Clicked outside profile modal');
      closeProfileModal();
    }
  });
  
  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      console.log('Escape key pressed');
      closeAuthModal();
      closeProfileModal();
    }
  });
  
  // Social login buttons
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', (e) => {
      console.log('Google login button clicked');
      e.preventDefault();
      handleGoogleLogin();
    });
  }
  
  if (facebookLoginButton) {
    facebookLoginButton.addEventListener('click', (e) => {
      console.log('Facebook login button clicked');
      e.preventDefault();
      handleFacebookLogin();
    });
  }
  
  if (discordLoginButton) {
    discordLoginButton.addEventListener('click', (e) => {
      console.log('Discord login button clicked');
      e.preventDefault();
      handleDiscordLogin();
    });
  }
}

/**
 * Check if user is authenticated and update UI accordingly
 */
async function checkAuthStatus() {
  console.log('Checking auth status');
  
  if (window.AuthService && window.AuthService.isAuthenticated()) {
    const user = window.AuthService.getUser();
    
    if (user) {
      console.log('User found in local storage:', user);
      updateUserUI(user);
    } else {
      // If user data is not in localStorage, try to fetch it
      console.log('No user in local storage, fetching from API');
      const response = await window.AuthService.getCurrentUser();
      
      if (response.success) {
        console.log('User fetched from API:', response.data);
        updateUserUI(response.data);
      } else {
        // If fetching fails, user is not authenticated
        console.log('Failed to fetch user:', response.message);
        updateAuthUI(false);
      }
    }
  } else {
    console.log('User not authenticated');
    updateAuthUI(false);
  }
}

/**
 * Update UI based on authentication status
 * @param {Boolean} isAuthenticated - Whether user is authenticated
 */
function updateAuthUI(isAuthenticated) {
  console.log('Updating auth UI, authenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    if (loginButton) loginButton.style.display = 'none';
    if (registerButton) registerButton.style.display = 'none';
    if (mobileLoginButton) mobileLoginButton.style.display = 'none';
    if (mobileRegisterButton) mobileRegisterButton.style.display = 'none';
    if (profileButton) profileButton.style.display = 'flex';
    if (mobileProfileButton) mobileProfileButton.style.display = 'flex';
  } else {
    if (loginButton) loginButton.style.display = 'block';
    if (registerButton) registerButton.style.display = 'none'; // Hide register button as requested
    if (mobileLoginButton) mobileLoginButton.style.display = 'block';
    if (mobileRegisterButton) mobileRegisterButton.style.display = 'none'; // Hide mobile register button as well
    if (profileButton) profileButton.style.display = 'none';
    if (mobileProfileButton) mobileProfileButton.style.display = 'none';
  }
}

/**
 * Update user profile UI elements
 * @param {Object} user - User data
 */
function updateUserUI(user) {
  console.log('Updating user UI with:', user);
  
  // Update auth UI
  updateAuthUI(true);
  
  // Set user initials
  const initial = user.username.charAt(0);
  userInitials.forEach(el => {
    if (el) el.textContent = initial;
  });
  
  // Set user name
  userNames.forEach(el => {
    if (el) el.textContent = user.username;
  });
  
  // Update profile form
  const profileUsername = document.getElementById('profile-username');
  const profileEmail = document.getElementById('profile-email');
  const profileSubscription = document.getElementById('profile-subscription');
  
  if (profileUsername) profileUsername.value = user.username;
  if (profileEmail) profileEmail.value = user.email;
  
  // Update subscription status
  if (profileSubscription) {
    const subscriptionStatus = user.subscriptionStatus || 'none';
    const subscriptionExpiry = user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A';
    profileSubscription.value = 
      subscriptionStatus === 'active' 
        ? `Active (Expires: ${subscriptionExpiry})` 
        : subscriptionStatus === 'expired'
          ? `Expired (${subscriptionExpiry})`
          : 'None';
  }
}

/**
 * Open the authentication modal
 * @param {String} tab - Tab to show ('login' or 'register')
 */
function openAuthModal(tab = 'login') {
  console.log('Opening auth modal with tab:', tab);
  
  if (!authModal) {
    console.error('Auth modal not found');
    return;
  }
  
  // Reset forms
  if (loginForm) loginForm.reset();
  if (registerForm) registerForm.reset();
  
  // Clear error messages
  if (authError && authSuccess) {
    clearMessages(authError, authSuccess);
  }
  
  // Switch to the correct tab
  switchTab(tab);
  
  // Show modal
  authModal.classList.add('active');
  setTimeout(() => {
    const modalElement = authModal.querySelector('.auth-modal');
    if (modalElement) {
      modalElement.style.opacity = '1';
      modalElement.style.transform = 'translateY(0)';
    }
  }, 10);
  
  // Focus first input
  if (tab === 'login') {
    const loginUsername = document.getElementById('login-username');
    if (loginUsername) loginUsername.focus();
  } else {
    const registerUsername = document.getElementById('register-username');
    if (registerUsername) registerUsername.focus();
  }
}

/**
 * Close the authentication modal
 */
function closeAuthModal() {
  console.log('Closing auth modal');
  
  if (!authModal) {
    console.error('Auth modal not found');
    return;
  }
  
  const modalElement = authModal.querySelector('.auth-modal');
  if (modalElement) {
    modalElement.style.opacity = '0';
    modalElement.style.transform = 'translateY(30px)';
  }
  
  setTimeout(() => {
    authModal.classList.remove('active');
  }, 300);
}

/**
 * Open the profile modal
 */
function openProfileModal() {
  console.log('Opening profile modal');
  
  if (!profileModal) {
    console.error('Profile modal not found');
    return;
  }
  
  // Reset forms
  if (passwordForm) passwordForm.reset();
  
  // Clear error messages
  if (profileError && profileSuccess) {
    clearMessages(profileError, profileSuccess);
  }
  
  // Switch to profile tab
  const profileInfoTab = document.querySelector('.auth-tab[data-tab="profile-info"]');
  const passwordTab = document.querySelector('.auth-tab[data-tab="change-password"]');
  const formWrapper = profileModal.querySelector('.auth-form-wrapper');
  
  if (profileInfoTab) profileInfoTab.classList.add('active');
  if (passwordTab) passwordTab.classList.remove('active');
  if (formWrapper) formWrapper.classList.remove('show-register');
  
  // Show modal
  profileModal.classList.add('active');
  setTimeout(() => {
    const modalElement = profileModal.querySelector('.auth-modal');
    if (modalElement) {
      modalElement.style.opacity = '1';
      modalElement.style.transform = 'translateY(0)';
    }
  }, 10);
}

/**
 * Close the profile modal
 */
function closeProfileModal() {
  console.log('Closing profile modal');
  
  if (!profileModal) {
    console.error('Profile modal not found');
    return;
  }
  
  const modalElement = profileModal.querySelector('.auth-modal');
  if (modalElement) {
    modalElement.style.opacity = '0';
    modalElement.style.transform = 'translateY(30px)';
  }
  
  setTimeout(() => {
    profileModal.classList.remove('active');
  }, 300);
}

/**
 * Switch between tabs in the auth modal
 * @param {String} tabName - Name of the tab to switch to
 */
function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Update tab UI
  authTabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update form display
  if (tabName === 'register') {
    if (authFormWrapper) authFormWrapper.classList.add('show-register');
    
    const authFooter = document.querySelector('.auth-footer p');
    if (authFooter) {
      authFooter.innerHTML = 'Already have an account? <a href="#" class="auth-link" id="auth-toggle-login">Login</a>';
      
      const authToggleLogin = document.getElementById('auth-toggle-login');
      if (authToggleLogin) {
        authToggleLogin.addEventListener('click', (e) => {
          e.preventDefault();
          switchTab('login');
        });
      }
    }
  } else if (tabName === 'login') {
    if (authFormWrapper) authFormWrapper.classList.remove('show-register');
    
    const authFooter = document.querySelector('.auth-footer p');
    if (authFooter) {
      authFooter.innerHTML = 'Don\'t have an account? <a href="#" class="auth-link" id="auth-toggle-register">Register</a>';
      
      const authToggleRegister = document.getElementById('auth-toggle-register');
      if (authToggleRegister) {
        authToggleRegister.addEventListener('click', (e) => {
          e.preventDefault();
          switchTab('register');
        });
      }
    }
  } else if (tabName === 'profile-info') {
    const formWrapper = profileModal.querySelector('.auth-form-wrapper');
    if (formWrapper) formWrapper.classList.remove('show-register');
  } else if (tabName === 'change-password') {
    const formWrapper = profileModal.querySelector('.auth-form-wrapper');
    if (formWrapper) formWrapper.classList.add('show-register');
  }
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
  e.preventDefault();
  console.log('Handling login form submission');
  
  // Get form data
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  // Validate form
  if (!username || !password) {
    showError(authError, 'Please fill in all fields');
    return;
  }
  
  // Show loading state
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Logging in...';
  submitButton.disabled = true;
  
  // Call API
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(authError, 'Authentication service not available');
      return;
    }
    
    const response = await window.AuthService.login({ username, password });
    console.log('Login response:', response);
    
    if (response.success) {
      showSuccess(authSuccess, 'Login successful! Redirecting...');
      updateUserUI(response.data.user);
      
      // Close modal after delay
      setTimeout(() => {
        closeAuthModal();
      }, 1500);
    } else {
      showError(authError, response.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    showError(authError, 'An error occurred during login');
  } finally {
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

/**
 * Handle registration form submission
 * @param {Event} e - Form submit event
 */
async function handleRegister(e) {
  e.preventDefault();
  console.log('Handling register form submission');
  
  // Get form data
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  // Validate form
  if (!username || !email || !password || !confirmPassword) {
    showError(authError, 'Please fill in all fields');
    return;
  }
  
  if (password !== confirmPassword) {
    showError(authError, 'Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    showError(authError, 'Password must be at least 6 characters long');
    return;
  }
  
  // Show loading state
  const submitButton = registerForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Creating account...';
  submitButton.disabled = true;
  
  // Call API
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(authError, 'Authentication service not available');
      return;
    }
    
    const response = await window.AuthService.register({ username, email, password });
    console.log('Register response:', response);
    
    if (response.success) {
      showSuccess(authSuccess, 'Account created successfully! Redirecting...');
      updateUserUI(response.data.user);
      
      // Close modal after delay
      setTimeout(() => {
        closeAuthModal();
      }, 1500);
    } else {
      showError(authError, response.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError(authError, 'An error occurred during registration');
  } finally {
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

/**
 * Handle profile update form submission
 * @param {Event} e - Form submit event
 */
async function handleProfileUpdate(e) {
  e.preventDefault();
  console.log('Handling profile update form submission');
  
  // Get form data
  const username = document.getElementById('profile-username').value;
  const email = document.getElementById('profile-email').value;
  
  // Validate form
  if (!username || !email) {
    showError(profileError, 'Please fill in all fields');
    return;
  }
  
  // Show loading state
  const submitButton = profileForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Updating...';
  submitButton.disabled = true;
  
  // Call API
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(profileError, 'Authentication service not available');
      return;
    }
    
    const response = await window.AuthService.updateProfile({ username, email });
    console.log('Profile update response:', response);
    
    if (response.success) {
      showSuccess(profileSuccess, 'Profile updated successfully!');
      updateUserUI(response.data);
    } else {
      showError(profileError, response.message);
    }
  } catch (error) {
    console.error('Profile update error:', error);
    showError(profileError, 'An error occurred during profile update');
  } finally {
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

/**
 * Handle password change form submission
 * @param {Event} e - Form submit event
 */
async function handlePasswordChange(e) {
  e.preventDefault();
  console.log('Handling password change form submission');
  
  // Get form data
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-new-password').value;
  
  // Validate form
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    showError(profileError, 'Please fill in all fields');
    return;
  }
  
  if (newPassword !== confirmNewPassword) {
    showError(profileError, 'New passwords do not match');
    return;
  }
  
  if (newPassword.length < 6) {
    showError(profileError, 'New password must be at least 6 characters long');
    return;
  }
  
  // Show loading state
  const submitButton = passwordForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Changing password...';
  submitButton.disabled = true;
  
  // Call API
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(profileError, 'Authentication service not available');
      return;
    }
    
    const response = await window.AuthService.changePassword({ 
      currentPassword, 
      newPassword 
    });
    console.log('Password change response:', response);
    
    if (response.success) {
      showSuccess(profileSuccess, 'Password changed successfully!');
      passwordForm.reset();
    } else {
      showError(profileError, response.message);
    }
  } catch (error) {
    console.error('Password change error:', error);
    showError(profileError, 'An error occurred during password change');
  } finally {
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  console.log('Handling logout');
  
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      return;
    }
    
    await window.AuthService.logout();
    updateAuthUI(false);
    closeProfileModal();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Show error message
 * @param {HTMLElement} element - Error element
 * @param {String} message - Error message
 */
function showError(element, message) {
  console.log('Showing error:', message);
  
  if (!element) {
    console.error('Error element not found');
    return;
  }
  
  element.textContent = message;
  element.classList.add('active');
  
  // Hide after 5 seconds
  setTimeout(() => {
    element.classList.remove('active');
  }, 5000);
}

/**
 * Show success message
 * @param {HTMLElement} element - Success element
 * @param {String} message - Success message
 */
function showSuccess(element, message) {
  console.log('Showing success:', message);
  
  if (!element) {
    console.error('Success element not found');
    return;
  }
  
  element.textContent = message;
  element.classList.add('active');
  
  // Hide after 5 seconds
  setTimeout(() => {
    element.classList.remove('active');
  }, 5000);
}

/**
 * Clear error and success messages
 * @param {HTMLElement} errorElement - Error element
 * @param {HTMLElement} successElement - Success element
 */
function clearMessages(errorElement, successElement) {
  console.log('Clearing messages');
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('active');
  }
  
  if (successElement) {
    successElement.textContent = '';
    successElement.classList.remove('active');
  }
}

/**
 * Handle Google login
 */
async function handleGoogleLogin() {
  console.log('Handling Google login');
  
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(authError, 'Authentication service not available');
      return;
    }
    
    showSuccess(authSuccess, 'Redirecting to Google...');
    await window.AuthService.loginWithGoogle();
  } catch (error) {
    console.error('Google login error:', error);
    showError(authError, 'An error occurred during Google login');
  }
}

/**
 * Handle Facebook login
 */
async function handleFacebookLogin() {
  console.log('Handling Facebook login');
  
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(authError, 'Authentication service not available');
      return;
    }
    
    showSuccess(authSuccess, 'Redirecting to Facebook...');
    await window.AuthService.loginWithFacebook();
  } catch (error) {
    console.error('Facebook login error:', error);
    showError(authError, 'An error occurred during Facebook login');
  }
}

/**
 * Handle Discord login
 */
async function handleDiscordLogin() {
  console.log('Handling Discord login');
  
  try {
    if (!window.AuthService) {
      console.error('AuthService not found');
      showError(authError, 'Authentication service not available');
      return;
    }
    
    showSuccess(authSuccess, 'Redirecting to Discord...');
    await window.AuthService.loginWithDiscord();
  } catch (error) {
    console.error('Discord login error:', error);
    showError(authError, 'An error occurred during Discord login');
  }
}

// Initialize the authentication module
console.log('Auth.js loaded');
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded, initializing auth module');
  init();
}); 