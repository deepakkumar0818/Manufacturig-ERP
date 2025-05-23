import { useState, useEffect } from 'react';
import axios from 'axios';

const Enquiries = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [fetchingEnquiries, setFetchingEnquiries] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit', or 'view'
  
  // State for form data (used for both create and edit)
  const [formData, setFormData] = useState({
    customer: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    industry: '',
    product: '',
    quantity: '',
    specs: '',
    drawings: '',
    expectedDelivery: '',
    projectTimeline: '',
    budget: '',
    preferredMaterial: '',
    additionalServices: [],
    referenceSource: '',
    notes: ''
  });
  
  // Fetch enquiries from API on component mount
  useEffect(() => {
    const fetchEnquiries = async () => {
      setFetchingEnquiries(true);
      try {
        const response = await axios.get('http://localhost:5000/api/enquiries');
        setEnquiries(response.data);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
        // If API fails, use sample data as fallback
        setEnquiries([
          {
            id: 'ENQ-001',
            date: '2024-04-25',
            customer: 'ABC Manufacturing',
            contactPerson: 'John Smith',
            phone: '+1 234-567-8901',
            email: 'john@abcmanufacturing.com',
            status: 'Open',
            product: 'Custom Machinery Parts',
            quantity: 50,
            expectedDelivery: '2024-05-30',
            notes: 'Requires precision machining'
          },
          // Other fallback sample data
        ]);
      } finally {
        setFetchingEnquiries(false);
      }
    };

    fetchEnquiries();
  }, []);
  
  // Form submission handler - handles both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (formMode === 'create') {
        // Create new enquiry
        response = await axios.post('http://localhost:5000/api/enquiries', formData);
        
        // Add new enquiry to list
        setEnquiries([response.data, ...enquiries]);
      } else if (formMode === 'edit' && selectedEnquiry) {
        // Update existing enquiry
        response = await axios.put(
          `http://localhost:5000/api/enquiries/${selectedEnquiry._id}`, 
          formData
        );
        
        // Update enquiry in list
        setEnquiries(enquiries.map(item => 
          item.id === selectedEnquiry.id ? response.data : item
        ));
      }
      
      // Reset form and go back to list view
      resetForm();
      setActiveTab('list');
      
    } catch (err) {
      console.error('Error with enquiry:', err);
      setError(err.response?.data?.message || 'Failed to process enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      customer: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      industry: '',
      product: '',
      quantity: '',
      specs: '',
      drawings: '',
      expectedDelivery: '',
      projectTimeline: '',
      budget: '',
      preferredMaterial: '',
      additionalServices: [],
      referenceSource: '',
      notes: ''
    });
    setFormMode('create');
    setSelectedEnquiry(null);
  };
  
  // Form field update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle multi-select for additional services
    if (name === 'additionalServices') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({
        ...formData,
        [name]: selectedOptions
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle view button click
  const handleView = (enquiryId) => {
    const enquiry = enquiries.find(e => e.id === enquiryId);
    setSelectedEnquiry(enquiry);
    setFormData({...enquiry});
    setFormMode('view');
    setActiveTab('create'); // Reuse create form tab but in view mode
  };

  // Handle edit button click
  const handleEdit = (enquiryId) => {
    const enquiry = enquiries.find(e => e.id === enquiryId);
    setSelectedEnquiry(enquiry);
    setFormData({...enquiry});
    setFormMode('edit');
    setActiveTab('create'); // Reuse create form tab but in edit mode
  };

  // Handle delete button click
  const handleDelete = (enquiryId) => {
    const enquiry = enquiries.find(e => e.id === enquiryId);
    setSelectedEnquiry(enquiry);
    setShowDeleteConfirm(true);
  };

  // Delete enquiry handler
  const confirmDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`http://localhost:5000/api/enquiries/${selectedEnquiry._id}`);
      
      // Remove from local state
      setEnquiries(enquiries.filter(e => e.id !== selectedEnquiry.id));
      setShowDeleteConfirm(false);
      setSelectedEnquiry(null);
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      setError(err.response?.data?.message || 'Failed to delete enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Status badge color function
  const getStatusColor = (status) => {
    switch(status) {
      case 'Open':
        return 'bg-blue-500';
      case 'Quoted':
        return 'bg-yellow-500';
      case 'Converted':
        return 'bg-green-500';
      case 'Closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get form title based on mode
  const getFormTitle = () => {
    switch(formMode) {
      case 'create':
        return 'Create New Enquiry';
      case 'edit':
        return `Edit Enquiry - ${selectedEnquiry?.id}`;
      case 'view':
        return `Enquiry Details - ${selectedEnquiry?.id}`;
      default:
        return 'Enquiry Form';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Tabs and Action Button */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => {
              setActiveTab('list');
              resetForm();
            }}
          >
            Enquiry List
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => {
              setActiveTab('create');
              if (formMode !== 'create' && formMode !== 'edit') {
                resetForm();
                setFormMode('create');
              }
            }}
          >
            {formMode === 'create' ? 'Create Enquiry' : formMode === 'edit' ? 'Edit Enquiry' : 'View Enquiry'}
          </button>
        </div>
        
        {activeTab === 'list' && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => {
              setActiveTab('create');
              resetForm();
              setFormMode('create');
            }}
          >
            <span className="material-icons mr-1">add</span> New Enquiry
          </button>
        )}
      </div>
      
      {/* List View */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {fetchingEnquiries ? (
            <div className="flex justify-center items-center p-8">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2">Loading enquiries...</span>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-gray-400 text-5xl mb-4">
                <span className="material-icons" style={{ fontSize: '4rem' }}>inbox</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-1">No enquiries yet</h3>
              <p className="text-gray-500 mb-4">Create your first enquiry to get started</p>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={() => {
                  setActiveTab('create');
                  resetForm();
                  setFormMode('create');
                }}
              >
                <span className="material-icons mr-1">add</span> New Enquiry
              </button>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{enquiry.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{enquiry.customer}</div>
                      <div className="text-gray-500">{enquiry.contactPerson}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{enquiry.product}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{enquiry.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-white text-xs rounded-full ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.expectedDelivery}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleView(enquiry.id)}
                        >
                          <span className="material-icons text-sm">visibility</span>
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleEdit(enquiry.id)}
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(enquiry.id)}
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}
      
      {/* Enquiry Form (Create/Edit/View) */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="py-4 px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 flex items-center">
              <span className="material-icons mr-2 text-blue-500">
                {formMode === 'create' ? 'add_circle' : formMode === 'edit' ? 'edit' : 'visibility'}
              </span>
              {getFormTitle()}
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Customer Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="material-icons mr-2 text-blue-500">person</span>
                Customer Information
              </h3>
              <div className="grid gap-x-6 gap-y-4">
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name {formMode !== 'view' && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleChange}
                      required={formMode !== 'view'}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Company name"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person {formMode !== 'view' && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required={formMode !== 'view'}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Full name"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email {formMode !== 'view' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <span className="material-icons text-sm">email</span>
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required={formMode !== 'view'}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="example@company.com"
                        readOnly={formMode === 'view'}
                        disabled={formMode === 'view'}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number {formMode !== 'view' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <span className="material-icons text-sm">phone</span>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required={formMode !== 'view'}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+1 (123) 456-7890"
                        readOnly={formMode === 'view'}
                        disabled={formMode === 'view'}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Street address"
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-x-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="City"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="State/Province"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Zip/Postal code"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry/Sector
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  >
                    <option value="">Select Industry</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Aerospace">Aerospace</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Consumer Goods">Consumer Goods</option>
                    <option value="Medical Devices">Medical Devices</option>
                    <option value="Industrial Equipment">Industrial Equipment</option>
                    <option value="Construction">Construction</option>
                    <option value="Energy">Energy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Product Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="material-icons mr-2 text-blue-500">inventory_2</span>
                Product Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product/Service {formMode !== 'view' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    required={formMode !== 'view'}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="E.g., CNC Machining, Metal Fabrication"
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity {formMode !== 'view' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required={formMode !== 'view'}
                    min="1"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Number of units"
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Material
                  </label>
                  <input
                    type="text"
                    name="preferredMaterial"
                    value={formData.preferredMaterial}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="E.g., Aluminum, Steel, Plastic"
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  >
                    <option value="">Select Budget Range</option>
                    <option value="< $1,000">Less than $1,000</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specifications/Requirements
                  </label>
                  <textarea
                    name="specs"
                    value={formData.specs}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Material specifications, dimensions, tolerances, etc."
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 md:col-span-2">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Delivery Date
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <span className="material-icons text-sm">calendar_today</span>
                      </span>
                      <input
                        type="date"
                        name="expectedDelivery"
                        value={formData.expectedDelivery}
                        onChange={handleChange}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        readOnly={formMode === 'view'}
                        disabled={formMode === 'view'}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Timeline
                    </label>
                    <select
                      name="projectTimeline"
                      value={formData.projectTimeline}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    >
                      <option value="">Select Timeline</option>
                      <option value="Urgent (1-2 weeks)">Urgent (1-2 weeks)</option>
                      <option value="Standard (2-4 weeks)">Standard (2-4 weeks)</option>
                      <option value="Flexible (1-2 months)">Flexible (1-2 months)</option>
                      <option value="Long-term (3+ months)">Long-term (3+ months)</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Drawings/Files
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-icons text-gray-500 mb-1">upload_file</span>
                        <p className="mb-2 text-sm text-gray-500">Click to upload files</p>
                        <p className="text-xs text-gray-500">CAD files, sketches, or reference images (MAX. 10MB)</p>
                      </div>
                      <input type="file" name="drawings" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="material-icons mr-2 text-blue-500">note_add</span>
                Additional Information
              </h3>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Services Required
                    </label>
                    <select
                      name="additionalServices"
                      value={formData.additionalServices}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    >
                      <option value="">Select Additional Service</option>
                      <option value="Assembly">Assembly</option>
                      <option value="Surface Finishing">Surface Finishing</option>
                      <option value="Painting">Painting</option>
                      <option value="Heat Treatment">Heat Treatment</option>
                      <option value="Testing">Testing & Quality Control</option>
                      <option value="Packaging">Custom Packaging</option>
                      <option value="Logistics">Logistics & Delivery</option>
                      <option value="Design">Design Optimization</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      How did you hear about us?
                    </label>
                    <select
                      name="referenceSource"
                      value={formData.referenceSource}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      readOnly={formMode === 'view'}
                      disabled={formMode === 'view'}
                    >
                      <option value="">Select Option</option>
                      <option value="Search Engine">Search Engine</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Referral">Referral</option>
                      <option value="Trade Show">Trade Show</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Direct Mail">Direct Mail</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Any additional information or special requirements..."
                    readOnly={formMode === 'view'}
                    disabled={formMode === 'view'}
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Form Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('list');
                  resetForm();
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                {formMode === 'view' ? 'Back to List' : 'Cancel'}
              </button>
              
              {formMode === 'view' ? (
              <button
                type="button"
                  onClick={() => setFormMode('edit')}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <span className="material-icons mr-1">edit</span>
                  Edit Enquiry
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {formMode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    formMode === 'create' ? 'Submit Enquiry' : 'Update Enquiry'
                  )}
              </button>
              )}
            </div>
          </form>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="material-icons mr-2 text-red-500">warning</span>
                Delete Enquiry
              </h3>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <div className="p-6">
              <p className="mb-4">Are you sure you want to delete the enquiry <strong>{selectedEnquiry.id}</strong> from <strong>{selectedEnquiry.customer}</strong>? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-sm mr-1">delete</span>
                      Delete Enquiry
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries; 