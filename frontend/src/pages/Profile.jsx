import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, getUserProfile, setUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    profileImage: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      // Initialize form with user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [isAuthenticated, navigate, user]);

  // Function to refresh user data from the server
  const refreshUserData = async () => {
    if (!isAuthenticated) return;
    
    setIsRefreshing(true);
    try {
      const result = await getUserProfile();
      if (result.success) {
        const userData = result.user;
        
        // Also manually update the context state and form data
        const updatedUser = {...user, ...userData};
        setUser(updatedUser);
        
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          company: userData.company || '',
          position: userData.position || '',
          profileImage: userData.profileImage || '',
        });
        
        // Reset image preview and file
        setImagePreview('');
        setImageFile(null);
        
        setSuccessMessage('Profile data refreshed from server');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.error || 'Failed to refresh profile data');
      }
    } catch (error) {
      setErrorMessage('Failed to refresh profile data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear any messages when editing
    if (errorMessage) setErrorMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit');
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please use JPG, PNG, GIF, or WebP');
      return;
    }
    
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
    
    // Clear any error messages
    if (errorMessage) setErrorMessage('');
  };
  
  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // If we're using the demo admin, just update without file upload
      if (user?.email === 'admin@example.com') {
        // For demo user, update directly with form data
        let updatedData = { ...formData };
        
        // If there's a new image preview, use that as the profile image for the demo user
        if (imagePreview) {
          updatedData.profileImage = imagePreview;
        }
        
        const result = await updateProfile(updatedData);
        
        if (result.success) {
          handleSuccessfulUpdate(result.user);
        } else {
          setErrorMessage(result.error || 'Failed to update profile');
        }
      } else {
        // For real users with backend integration
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('company', formData.company);
        formDataToSend.append('position', formData.position);
        
        // Only append file if one is selected
        if (imageFile) {
          formDataToSend.append('profileImage', imageFile);
        } else if (formData.profileImage) {
          // If using a URL, pass it as a field
          formDataToSend.append('profileImage', formData.profileImage);
        }
        
        // Send request with FormData
        const token = user.token;
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formDataToSend
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Add back the token
          const updatedUser = {...data, token};
          
          // Update context and localStorage
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          handleSuccessfulUpdate(updatedUser);
        } else {
          setErrorMessage(data.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating your profile');
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSuccessfulUpdate = (updatedUser) => {
    // Update form data with response
    setFormData({
      name: updatedUser.name || '',
      email: updatedUser.email || '',
      phone: updatedUser.phone || '',
      company: updatedUser.company || '',
      position: updatedUser.position || '',
      profileImage: updatedUser.profileImage || '',
    });
    
    // Reset image states
    setImagePreview('');
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setIsEditing(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative">
                <img 
                  src={imagePreview || formData.profileImage || 'https://ui-avatars.com/api/?name=User&background=random'} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
                <p className="text-blue-100">{formData.position} at {formData.company}</p>
              </div>
              <div className="md:ml-auto mt-4 md:mt-0 flex space-x-2">
                <button 
                  onClick={refreshUserData} 
                  disabled={isRefreshing}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors flex items-center"
                  title="Refresh data from server"
                >
                  <span className="material-icons text-sm mr-1">{isRefreshing ? 'sync' : 'refresh'}</span>
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <label className="cursor-pointer bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                          Browse...
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="sr-only"
                          />
                        </label>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={clearImageSelection}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF or WebP. Max 5MB.</p>
                      
                      {!imageFile && (
                        <div className="mt-2">
                          <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700">Or use image URL</label>
                          <input
                            type="text"
                            id="profileImage"
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                      <input
                        type="text"
                        value={formData.profileImage}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 cursor-not-allowed shadow-sm sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setErrorMessage('');
                      setImagePreview('');
                      setImageFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      // Reset form to original values
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        company: user.company || '',
                        position: user.position || '',
                        profileImage: user.profileImage || '',
                      });
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 