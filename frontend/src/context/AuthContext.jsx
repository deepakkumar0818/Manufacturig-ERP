import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data from localStorage');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
  
  // Register user
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, userData);
      
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      setLoading(false);
      return { success: true, user: response.data };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  
  // Login function
  const login = async (userData) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // For demo purposes, keep the mock authentication
      if (userData.email === 'admin@example.com' && userData.password === 'password') {
        const user = {
          _id: '1',
          name: 'Admin User',
          email: userData.email,
          role: 'admin',
          profileImage: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
          company: 'Demo Manufacturing',
          phone: '+1234567890',
          position: 'Administrator',
          token: 'mock-jwt-token'
        };
        
        // Store user in state and localStorage
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setLoading(false);
        return { success: true, user };
      }
      
      // Real API call
      const response = await axios.post(API_URL + 'login', userData);
      
      if (response.data) {
        // Make sure we have the latest data including the profile image
        const freshUserData = response.data;
        
        // Add cache-busting parameter to Cloudinary URL if it exists
        if (freshUserData.profileImage && freshUserData.profileImage.includes('cloudinary.com')) {
          // Add or update the timestamp parameter to prevent browser caching
          const timestamp = Date.now();
          freshUserData.profileImage = freshUserData.profileImage.includes('?') 
            ? freshUserData.profileImage.replace(/(\?|&)_t=\d+/, '') + `&_t=${timestamp}`
            : freshUserData.profileImage + `?_t=${timestamp}`;
        }
        
        console.log('Login response data with cache busting:', freshUserData);
        setUser(freshUserData);
        localStorage.setItem('user', JSON.stringify(freshUserData));
      }
      
      setLoading(false);
      return { success: true, user: response.data };
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Invalid email or password');
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid email or password' 
      };
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Update user profile
  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // For demo user, just update in localStorage
      if (user?.email === 'admin@example.com') {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setLoading(false);
        return { success: true, user: updatedUser };
      }
      
      // Check if updatedData is FormData
      const isFormData = updatedData instanceof FormData;
      
      // Real API call with authentication
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      // If it's not FormData, set the Content-Type to JSON
      if (!isFormData) {
        config.headers['Content-Type'] = 'application/json';
      }
      
      const response = await axios.put(
        API_URL + 'profile', 
        updatedData,
        config
      );
      
      if (response.data) {
        // Add cache-busting parameter to Cloudinary URL if it exists
        const freshData = {...response.data};
        if (freshData.profileImage && freshData.profileImage.includes('cloudinary.com')) {
          // Add or update the timestamp parameter to prevent browser caching
          const timestamp = Date.now();
          freshData.profileImage = freshData.profileImage.includes('?') 
            ? freshData.profileImage.replace(/(\?|&)_t=\d+/, '') + `&_t=${timestamp}`
            : freshData.profileImage + `?_t=${timestamp}`;
        }
        
        // Make sure to preserve the token from the current user
        const updatedUser = {...freshData, token: user.token};
        console.log('Profile update with cache busting:', updatedUser);
        
        // Update both state and localStorage
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setLoading(false);
        return { success: true, user: updatedUser };
      }
      
      setLoading(false);
      return { success: true, user: response.data };
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Failed to update profile');
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  };
  
  // Get user profile
  const getUserProfile = async () => {
    setLoading(true);
    
    try {
      // For demo user, return from state
      if (user?.email === 'admin@example.com') {
        setLoading(false);
        return { success: true, user };
      }
      
      // Real API call with authentication
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const response = await axios.get(API_URL + 'profile', config);
      
      if (response.data) {
        // Add cache-busting parameter to Cloudinary URL if it exists
        const freshUserData = {...response.data};
        if (freshUserData.profileImage && freshUserData.profileImage.includes('cloudinary.com')) {
          // Add or update the timestamp parameter to prevent browser caching
          const timestamp = Date.now();
          freshUserData.profileImage = freshUserData.profileImage.includes('?') 
            ? freshUserData.profileImage.replace(/(\?|&)_t=\d+/, '') + `&_t=${timestamp}`
            : freshUserData.profileImage + `?_t=${timestamp}`;
        }
        
        // Update state and localStorage with fresh data, preserving token
        const updatedUserData = {...freshUserData, token: user.token};
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      }
      
      setLoading(false);
      return { success: true, user: response.data };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch profile' 
      };
    }
  };
  
  const authContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    getUserProfile,
    setUser,
    isAuthenticated: !!user,
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 