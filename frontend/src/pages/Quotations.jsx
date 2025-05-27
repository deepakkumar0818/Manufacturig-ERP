import { useState, useEffect } from 'react';
import axios from 'axios';

const Quotations = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error'); // error, success, warning
  const [submissionType, setSubmissionType] = useState('draft'); // draft or send
  const [showEnquiryLookup, setShowEnquiryLookup] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  
  // New state for customers dropdown
  const [customers, setCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  
  // Sample quotation data for the list
  const [quotations, setQuotations] = useState([
    {
      id: 'QT-001-2024',
      date: '2024-04-26',
      enquiryId: 'ENQ-001',
      customer: 'ABC Manufacturing',
      contactPerson: 'John Smith',
      email: 'john@abcmanufacturing.com',
      phone: '+1 234-567-8901',
      validity: '30 days',
      validUntil: '2024-05-26',
      items: [
        { id: 1, description: 'Custom Machinery Parts', quantity: 50, unitPrice: 120, total: 6000 }
      ],
      subtotal: 6000,
      tax: 600,
      discount: 300,
      total: 6300,
      status: 'Draft',
      termsConditions: 'Standard manufacturing terms apply',
      notes: 'Requires precision machining'
    },
    {
      id: 'QT-002-2024',
      date: '2024-04-24',
      enquiryId: 'ENQ-002',
      customer: 'XYZ Industries',
      contactPerson: 'Jane Doe',
      email: 'jane@xyzindustries.com',
      phone: '+1 987-654-3210',
      validity: '15 days',
      validUntil: '2024-05-09',
      items: [
        { id: 1, description: 'Industrial Valves', quantity: 25, unitPrice: 320, total: 8000 }
      ],
      subtotal: 8000,
      tax: 800,
      discount: 0,
      total: 8800,
      status: 'Sent',
      termsConditions: 'Payment due within 30 days of delivery',
      notes: 'High-pressure tolerance required'
    },
    {
      id: 'QT-003-2024',
      date: '2024-04-22',
      enquiryId: 'ENQ-003',
      customer: 'Acme Corp',
      contactPerson: 'Robert Johnson',
      email: 'robert@acmecorp.com',
      phone: '+1 456-789-0123',
      validity: '60 days',
      validUntil: '2024-06-21',
      items: [
        { id: 1, description: 'Metal Fabrication - Sheet Metal Components', quantity: 100, unitPrice: 45, total: 4500 },
        { id: 2, description: 'Assembly Service', quantity: 1, unitPrice: 500, total: 500 }
      ],
      subtotal: 5000,
      tax: 500,
      discount: 250,
      total: 5250,
      status: 'Approved',
      termsConditions: '50% advance payment required',
      notes: 'Priority production requested'
    }
  ]);
  
  // State for new quotation form
  const initialQuotationState = {
    enquiryId: '',
    relatedEnquiry: null,
    customer: '',
    contactPerson: '',
    email: '',
    phone: '',
    streetAddress: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    validity: '30 days',
    validUntil: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    taxRate: 10,
    tax: 0,
    discountType: 'percentage',
    discountValue: 0,
    discount: 0,
    total: 0,
    paymentTerms: '',
    deliveryTerms: '',
    termsConditions: '',
    notes: ''
  };
  
  const [newQuotation, setNewQuotation] = useState(initialQuotationState);
  
  const [lookupEnquiryLoading, setLookupEnquiryLoading] = useState(false);
  const [enquiryLookupError, setEnquiryLookupError] = useState('');
  
  // Load sample customer data (replace with API call in production)
  useEffect(() => {
    const sampleCustomers = [
      { id: 1, name: 'ABC Manufacturing', contactPerson: 'John Smith', email: 'john@abcmanufacturing.com', phone: '+1 234-567-8901' },
      { id: 2, name: 'XYZ Industries', contactPerson: 'Jane Doe', email: 'jane@xyzindustries.com', phone: '+1 987-654-3210' },
      { id: 3, name: 'Acme Corp', contactPerson: 'Robert Johnson', email: 'robert@acmecorp.com', phone: '+1 456-789-0123' },
      { id: 4, name: 'Global Enterprises', contactPerson: 'Sarah Williams', email: 'sarah@globalenterprises.com', phone: '+1 567-890-1234' },
      { id: 5, name: 'Tech Solutions', contactPerson: 'Michael Brown', email: 'michael@techsolutions.com', phone: '+1 678-901-2345' },
      { id: 6, name: 'Innovative Manufacturing', contactPerson: 'Emily Davis', email: 'emily@innovativemanufacturing.com', phone: '+1 789-012-3456' },
      { id: 7, name: 'Precision Tools Inc', contactPerson: 'David Wilson', email: 'david@precisiontools.com', phone: '+1 890-123-4567' },
    ];
    
    setCustomers(sampleCustomers);
    setFilteredCustomers(sampleCustomers);
  }, []);
  
  // Filter customers when search term changes
  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearchTerm, customers]);
  
  // Function to handle selecting a customer from dropdown
  const handleCustomerSelect = (customer) => {
    setNewQuotation({
      ...newQuotation,
      customer: customer.name,
      contactPerson: customer.contactPerson,
      email: customer.email,
      phone: customer.phone
    });
    setShowCustomerDropdown(false);
    setCustomerSearchTerm('');
  };
  
  // Update filtered enquiries when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = enquiries.filter(enquiry =>
        enquiry.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.product?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEnquiries(filtered);
    } else {
      setFilteredEnquiries(enquiries);
    }
  }, [searchTerm, enquiries]);
  
  // Function to handle enquiry ID input changes with auto-lookup
  const handleEnquiryIdChange = (e) => {
    const { value } = e.target;
    
    // Update the field value
    handleChange(e);
    
    // If the value is cleared, reset related enquiry data
    if (!value) {
      setNewQuotation(prev => ({
        ...prev,
        relatedEnquiry: null
      }));
    }
  };
  
  // Auto-lookup enquiry when field loses focus and has a value
  const handleEnquiryIdBlur = (e) => {
    const value = e.target.value?.trim();
    if (value && (!newQuotation.relatedEnquiry || value !== newQuotation.relatedEnquiry.id)) {
      lookupEnquiryById(value);
    }
  };
  
  // Function to handle find/lookup button click
  const handleFindEnquiry = () => {
    setShowEnquiryLookup(true);
    setEnquiryLookupError('');
    fetchEnquiries();
  };
  
  // Fetch enquiries from API with better error handling
  const fetchEnquiries = async () => {
    setEnquiriesLoading(true);
    setEnquiryLookupError('');
    try {
      const response = await axios.get('http://localhost:5000/api/enquiries');
      if (response.data && Array.isArray(response.data)) {
        setEnquiries(response.data);
        setFilteredEnquiries(response.data);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setEnquiryLookupError('Unable to fetch enquiries. Please try again later.');
      // Use sample data as fallback if API fails
      const fallbackData = [
        {
          _id: '1',
          id: 'ENQ-001',
          date: '2024-04-25',
          customer: 'ABC Manufacturing',
          contactPerson: 'John Smith',
          phone: '+1 234-567-8901',
          email: 'john@abcmanufacturing.com',
          address: '123 Industrial Ave',
          city: 'Manufacturing City',
          state: 'NY',
          zipCode: '12345',
          country: 'USA',
          status: 'Open',
          product: 'Custom Machinery Parts',
          quantity: 50,
          specs: 'High precision required',
          expectedDelivery: '2024-05-30',
          notes: 'Requires precision machining'
        },
        {
          _id: '2',
          id: 'ENQ-002',
          date: '2024-04-24',
          customer: 'XYZ Industries',
          contactPerson: 'Jane Doe',
          phone: '+1 987-654-3210',
          email: 'jane@xyzindustries.com',
          address: '456 Corporate Blvd',
          city: 'Industry City',
          state: 'CA',
          zipCode: '98765',
          country: 'USA',
          status: 'Open',
          product: 'Industrial Valves',
          quantity: 25,
          specs: 'High-pressure tolerance',
          expectedDelivery: '2024-05-15',
          notes: 'High-pressure tolerance required'
        },
        {
          _id: '3',
          id: 'ENQ-003',
          date: '2024-04-22',
          customer: 'Acme Corp',
          contactPerson: 'Robert Johnson',
          phone: '+1 456-789-0123',
          email: 'robert@acmecorp.com',
          address: '789 Production Rd',
          city: 'Acme City',
          state: 'TX',
          zipCode: '45678',
          country: 'USA',
          status: 'Open',
          product: 'Metal Fabrication - Sheet Metal Components',
          quantity: 100,
          specs: 'Standard specifications',
          expectedDelivery: '2024-06-01',
          notes: 'Priority production requested'
        }
      ];
      setEnquiries(fallbackData);
      setFilteredEnquiries(fallbackData);
    } finally {
      setEnquiriesLoading(false);
    }
  };
  
  // Function to look up enquiry by ID with better UI feedback
  const lookupEnquiryById = async (id) => {
    if (!id) {
      showErrorToast('Please enter an Enquiry ID');
      return;
    }

    setLookupEnquiryLoading(true);
    setEnquiryLookupError('');
    try {
      // First try to find in already loaded enquiries
      const foundEnquiry = enquiries.find(e => e.id === id);
      if (foundEnquiry) {
        handleEnquirySelect(foundEnquiry);
        return;
      }

      // If not found, fetch from the server
      const response = await axios.get(`http://localhost:5000/api/enquiries/custom/${id}`);
      if (response.data) {
        handleEnquirySelect(response.data);
      } else {
        showErrorToast(`Enquiry with ID ${id} not found`);
      }
    } catch (err) {
      console.error('Error finding enquiry:', err);
      showErrorToast(`Enquiry with ID ${id} not found. Please verify the ID and try again.`);
    } finally {
      setLookupEnquiryLoading(false);
    }
  };
  
  // Handle the selection of an enquiry from the lookup with comprehensive field mapping
  const handleEnquirySelect = (enquiry) => {
    // Create a comprehensive mapping of all available fields
    setNewQuotation({
      ...newQuotation,
      enquiryId: enquiry.id,
      relatedEnquiry: enquiry,
      customer: enquiry.customer || '',
      contactPerson: enquiry.contactPerson || '',
      email: enquiry.email || '',
      phone: enquiry.phone || '',
      streetAddress: enquiry.address || '',
      addressLine2: enquiry.addressLine2 || '',
      city: enquiry.city || '',
      state: enquiry.state || '',
      postalCode: enquiry.zipCode || enquiry.postalCode || '',
      country: enquiry.country || '',
      // Add items with details from the enquiry
      items: [
        {
          description: enquiry.product || '',
          quantity: parseInt(enquiry.quantity) || 1,
          unitPrice: parseFloat(enquiry.estimatedPrice) || 0,
          total: (parseInt(enquiry.quantity) || 1) * (parseFloat(enquiry.estimatedPrice) || 0)
        }
      ],
      // Copy any other relevant fields
      notes: [
        enquiry.specs ? `Specifications: ${enquiry.specs}` : '',
        enquiry.notes ? `Notes: ${enquiry.notes}` : '',
        enquiry.expectedDelivery ? `Expected Delivery: ${enquiry.expectedDelivery}` : ''
      ].filter(note => note !== '').join('\n\n')
    });
    
    // Calculate totals
    setTimeout(() => {
      calculateTotals();
    }, 100);
    
    // Close the lookup
    setShowEnquiryLookup(false);
    
    // Show success message
    showSuccessToast(`Enquiry ${enquiry.id} data loaded successfully!`);
    
    // Optional: Update enquiry status to "Quoted" via API
    updateEnquiryStatus(enquiry._id || enquiry.id, "Quoted");
  };
  
  // Function to update enquiry status after selection
  const updateEnquiryStatus = async (enquiryId, status) => {
    try {
      // Call API to update status - implement according to your API structure
      await axios.patch(`http://localhost:5000/api/enquiries/${enquiryId}/status`, { 
        status: status 
      });
      console.log(`Enquiry ${enquiryId} status updated to ${status}`);
    } catch (err) {
      console.error('Error updating enquiry status:', err);
      // Don't show error to user as this is a background operation
    }
  };
  
  // Calculate valid until date
  const calculateValidUntil = (days) => {
    const validityDays = parseInt(days);
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + validityDays);
    
    // Format date as DD Month YYYY (e.g., 15 Jan 2024)
    const day = validUntilDate.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[validUntilDate.getMonth()];
    const year = validUntilDate.getFullYear();
    
    return `${day} ${month} ${year}`;
  };
  
  // Component mount effect to set initial valid until date
  useEffect(() => {
    const validUntil = calculateValidUntil(newQuotation.validity);
    setNewQuotation({
      ...newQuotation,
      validUntil
    });
  }, []);
  
  // Form submission handler - update to save relation to enquiry
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = {
      customer: 'Customer Name',
      contactPerson: 'Contact Person',
      email: 'Email',
      phone: 'Phone Number',
      streetAddress: 'Street Address',
      city: 'City',
      postalCode: 'Postal/ZIP Code',
      country: 'Country'
    };
    
    // Check for empty required fields
    const emptyFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!newQuotation[field]) {
        emptyFields.push(label);
      }
    }
    
    // Check if there are items
    if (newQuotation.items.length === 0) {
      emptyFields.push('At least one item');
    } else {
      // Check if any item fields are empty
      const hasEmptyItemFields = newQuotation.items.some(
        item => !item.description || !item.quantity || !item.unitPrice
      );
      if (hasEmptyItemFields) {
        emptyFields.push('Complete item details (description, quantity, and price)');
      }
    }
    
    // If there are empty fields, show toast and return
    if (emptyFields.length > 0) {
      showErrorToast(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
      return;
    }
    
    const currentYear = new Date().getFullYear();
    const id = `QT-${String(quotations.length + 1).padStart(3, '0')}-${currentYear}`;
    const date = new Date().toISOString().split('T')[0];
    
    // Set status based on submission type
    const status = submissionType === 'send' ? 'Sent' : 'Draft';
    
    // Include related enquiry ID in the saved quotation
    const newQuotationData = {
      ...newQuotation,
      id,
      date,
      status,
      // Ensure enquiry reference is saved for database relation
      enquiryId: newQuotation.enquiryId || null,
      // Store just the _id, not the whole object in saved data
      enquiryRef: newQuotation.relatedEnquiry?._id || null
    };
    
    setQuotations([
      ...quotations,
      newQuotationData
    ]);
    
    // Show success message
    const action = submissionType === 'send' ? 'sent' : 'saved as draft';
    showSuccessToast(`Quotation successfully ${action}!`);
    
    // Reset form
    setNewQuotation({
      ...initialQuotationState,
      validUntil: calculateValidUntil('30 days')
    });
    
    // Go back to list view
    setActiveTab('list');
    
    // In production: POST the data to your API endpoint
    // saveQuotationToApi(newQuotationData);
  };
  
  // Function to save quotation data to API (implement when ready)
  const saveQuotationToApi = async (quotationData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/quotations', quotationData);
      console.log('Quotation saved:', response.data);
      // Additional handling as needed
    } catch (err) {
      console.error('Error saving quotation:', err);
      // Error handling
    }
  };
  
  // Helper functions for toast notifications
  const showToastNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };
  
  const showErrorToast = (message) => {
    showToastNotification(message, 'error');
  };
  
  const showSuccessToast = (message) => {
    showToastNotification(message, 'success');
  };
  
  // Form field update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for validity to update validUntil date
    if (name === 'validity') {
      const days = value.split(' ')[0]; // Extract days number from "30 days"
      const validUntil = calculateValidUntil(days);
      
      setNewQuotation({
        ...newQuotation,
        [name]: value,
        validUntil
      });
    } else if (['discountType', 'discountValue'].includes(name)) {
      handleDiscountChange(name, value);
    } else if (name === 'taxRate') {
      handleTaxRateChange(value);
    } else {
      setNewQuotation({
        ...newQuotation,
        [name]: value
      });
    }
  };
  
  // Handle tax rate changes
  const handleTaxRateChange = (value) => {
    const taxRate = parseFloat(value) || 0;
    
    // Calculate with current values
    const subtotal = newQuotation.subtotal;
    const discount = newQuotation.discount;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (taxRate / 100);
    const total = taxableAmount + tax;
    
    // Update state with all calculated values
    setNewQuotation({
      ...newQuotation,
      taxRate,
      tax,
      total
    });
  };
  
  // Handle discount changes
  const handleDiscountChange = (name, value) => {
    let updatedQuotation = {
      ...newQuotation,
      [name]: value
    };
    
    // Calculate new discount value
    const subtotal = updatedQuotation.subtotal;
    let discount = 0;
    
    if (name === 'discountType') {
      // When changing discount type, recalculate based on current value
      if (value === 'percentage') {
        // Converting from fixed to percentage
        discount = subtotal > 0 ? (updatedQuotation.discountValue / subtotal * 100) : 0;
        updatedQuotation.discountValue = parseFloat(discount.toFixed(2));
      } else {
        // Converting from percentage to fixed
        discount = subtotal * (updatedQuotation.discountValue / 100);
        updatedQuotation.discountValue = parseFloat(discount.toFixed(2));
      }
    } else {
      // Just updating the discount value
      const discountValue = parseFloat(value) || 0;
      updatedQuotation.discountValue = discountValue;
      
      if (updatedQuotation.discountType === 'percentage') {
        discount = subtotal * (discountValue / 100);
      } else {
        discount = discountValue;
      }
    }
    
    // Calculate tax and total
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (parseFloat(updatedQuotation.taxRate) || 0) / 100;
    const total = taxableAmount + tax;
    
    // Update state with all calculated values
    setNewQuotation({
      ...updatedQuotation,
      discount,
      tax,
      total
    });
  };
  
  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newQuotation.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Calculate item total
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].quantity) || 0;
      const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].total = quantity * unitPrice;
    }
    
    setNewQuotation({
      ...newQuotation,
      items: updatedItems
    });
    
    // Recalculate all totals
    calculateTotals(updatedItems);
  };
  
  // Add new item row
  const addItem = () => {
    setNewQuotation({
      ...newQuotation,
      items: [...newQuotation.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };
  
  // Remove item row
  const removeItem = (index) => {
    if (newQuotation.items.length === 1) return;
    
    const updatedItems = newQuotation.items.filter((_, i) => i !== index);
    setNewQuotation({
      ...newQuotation,
      items: updatedItems
    });
    
    // Recalculate all totals
    calculateTotals(updatedItems);
  };
  
  // Calculate subtotal, tax, discount, and total
  const calculateTotals = (items = newQuotation.items) => {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
    // Calculate discount
    let discount = 0;
    if (newQuotation.discountType === 'percentage') {
      discount = subtotal * (parseFloat(newQuotation.discountValue) || 0) / 100;
    } else {
      discount = parseFloat(newQuotation.discountValue) || 0;
    }
    
    // Calculate tax
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (parseFloat(newQuotation.taxRate) || 0) / 100;
    
    // Calculate total
    const total = taxableAmount + tax;
    
    setNewQuotation({
      ...newQuotation,
      items,
      subtotal,
      tax,
      discount,
      total
    });
  };
  
  // Status badge color function
  const getStatusColor = (status) => {
    switch(status) {
      case 'Draft':
        return 'bg-gray-500';
      case 'Sent':
        return 'bg-blue-500';
      case 'Approved':
        return 'bg-green-500';
      case 'Rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 rounded-lg shadow-lg px-6 py-4 flex items-center space-x-2 ${
          toastType === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
          toastType === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
          'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
        }`}>
          <span className="material-icons text-xl">
            {toastType === 'error' ? 'error' :
             toastType === 'success' ? 'check_circle' : 'warning'}
          </span>
          <p>{toastMessage}</p>
          <button onClick={() => setShowToast(false)} className="ml-4 text-gray-500 hover:text-gray-800">
            <span className="material-icons">close</span>
          </button>
        </div>
      )}
      
      {/* Tabs and Action Button */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('list')}
          >
            Quotation List
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('create')}
          >
            Create Quotation
          </button>
        </div>
        
        {activeTab === 'list' && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setActiveTab('create')}
          >
            <span className="material-icons mr-1">add</span> New Quotation
          </button>
        )}
      </div>
      
      {/* List View */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{quotation.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quotation.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quotation.enquiryId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{quotation.customer}</div>
                      <div className="text-gray-500">{quotation.contactPerson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quotation.validUntil}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(quotation.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-white text-xs rounded-full ${getStatusColor(quotation.status)}`}>
                        {quotation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <span className="material-icons text-sm">visibility</span>
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <span className="material-icons text-sm">print</span>
                        </button>
                        <button className="text-orange-600 hover:text-orange-900">
                          <span className="material-icons text-sm">send</span>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Create Quotation Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          
          
          <form id="quotationForm" onSubmit={handleSubmit} className="p-6">
            {/* Customer Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 flex items-center text-blue-700">
                <span className="material-icons mr-2 text-blue-500">person</span>
                Customer Information
              </h3>
              <div className="grid gap-x-6 gap-y-4">
                <div className="form-group bg-blue-50 p-4 rounded-lg border border-blue-100 mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="material-icons text-blue-500 mr-1 text-sm">link</span>
                    Related Enquiry
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        name="enquiryId"
                        value={newQuotation.enquiryId}
                        onChange={handleEnquiryIdChange}
                        onBlur={handleEnquiryIdBlur}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-8"
                        placeholder="Enter enquiry ID (e.g., ENQ-001)"
                      />
                      {lookupEnquiryLoading && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>
                    <button 
                      type="button" 
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md font-medium flex items-center transition-colors"
                      onClick={() => lookupEnquiryById(newQuotation.enquiryId)}
                      disabled={lookupEnquiryLoading}
                    >
                      <span className="material-icons mr-1 text-sm">search</span>
                      Find
                    </button>
                    <button 
                      type="button" 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
                      onClick={handleFindEnquiry}
                      disabled={enquiriesLoading}
                    >
                      <span className="material-icons mr-1 text-sm">visibility</span>
                      Browse
                    </button>
                  </div>
                  {newQuotation.relatedEnquiry && (
                    <div className="mt-2 p-3 bg-blue-100 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="material-icons text-blue-600 mr-2">assignment</span>
                          <div>
                            <p className="font-medium text-blue-800">{newQuotation.relatedEnquiry.id}</p>
                            <p className="text-xs text-blue-600">{newQuotation.relatedEnquiry.product}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            newQuotation.relatedEnquiry.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                            newQuotation.relatedEnquiry.status === 'Quoted' ? 'bg-yellow-100 text-yellow-800' :
                            newQuotation.relatedEnquiry.status === 'Converted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {newQuotation.relatedEnquiry.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                        <div><span className="font-semibold">Customer:</span> {newQuotation.relatedEnquiry.customer}</div>
                        <div><span className="font-semibold">Contact:</span> {newQuotation.relatedEnquiry.contactPerson}</div>
                        <div><span className="font-semibold">Quantity:</span> {newQuotation.relatedEnquiry.quantity}</div>
                        <div><span className="font-semibold">Created:</span> {new Date(newQuotation.relatedEnquiry.date).toLocaleDateString()}</div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setNewQuotation({
                              ...newQuotation,
                              enquiryId: '',
                              relatedEnquiry: null
                            });
                          }}
                          className="text-xs text-red-600 hover:text-red-800 flex items-center"
                        >
                          <span className="material-icons text-sm mr-1">link_off</span>
                          Unlink enquiry
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Link this quotation to an existing enquiry to auto-fill customer details</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="customer"
                        value={newQuotation.customer}
                        onChange={(e) => {
                          handleChange(e);
                          setCustomerSearchTerm(e.target.value);
                          setShowCustomerDropdown(true);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Search or enter company name"
                      />
                      {showCustomerDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-300">
                          <div className="sticky top-0 bg-white border-b border-gray-200">
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <span className="material-icons text-gray-500 text-sm">search</span>
                              </span>
                              <input
                                type="text"
                                className="w-full pl-10 py-2 text-sm border-0 focus:ring-0"
                                placeholder="Type to search customers..."
                                value={customerSearchTerm}
                                onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          {filteredCustomers.length === 0 ? (
                            <div className="p-2 text-center text-gray-500 text-sm">
                              No customers found
                            </div>
                          ) : (
                            <ul className="py-1">
                              {filteredCustomers.map((customer) => (
                                <li
                                  key={customer.id}
                                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex flex-col"
                                  onClick={() => handleCustomerSelect(customer)}
                                >
                                  <span className="font-medium text-blue-700">{customer.name}</span>
                                  <span className="text-sm text-gray-600">{customer.contactPerson}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end mt-1">
                      <button 
                        type="button" 
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                      >
                        <span className="material-icons text-sm mr-1">list</span> 
                        Browse customers
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={newQuotation.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Full name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <span className="material-icons text-sm">email</span>
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={newQuotation.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="example@company.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <span className="material-icons text-sm">phone</span>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={newQuotation.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+91 99999 - 88888"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="material-icons text-gray-500 mr-1 text-sm">location_on</span>
                    Address Information
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={newQuotation.streetAddress || ''}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Street address, building, suite"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={newQuotation.addressLine2 || ''}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Apartment, floor, etc. (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newQuotation.city || ''}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={newQuotation.state || ''}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="State or province"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Postal/ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={newQuotation.postalCode || ''}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Postal or ZIP code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="country"
                        value={newQuotation.country || ''}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IN">India</option>
                        <option value="JP">Japan</option>
                        <option value="CN">China</option>
                        <option value="BR">Brazil</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quotation Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 flex items-center text-blue-700">
                <span className="material-icons mr-2 text-blue-500">description</span>
                Quotation Details
              </h3>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity Period <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    name="validity"
                    value={newQuotation.validity}
                    onChange={handleChange}
                    required
                    className="w-48 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="15 days">15 days</option>
                    <option value="30 days">30 days</option>
                    <option value="45 days">45 days</option>
                    <option value="60 days">60 days</option>
                    <option value="90 days">90 days</option>
                  </select>
                  <span className="text-gray-500 text-sm flex items-center">
                    <span className="material-icons mr-1 text-blue-500">event</span>
                    Valid until: <strong className="ml-2">{newQuotation.validUntil || 'To be calculated'}</strong>
                  </span>
                </div>
              </div>
              
              {/* Items Table */}
              <div className="mt-6 mb-4">
                <h4 className="text-md font-medium mb-3 flex items-center">
                  <span className="material-icons text-blue-500 mr-1">inventory_2</span>
                  Items & Services
                </h4>
                <div className="overflow-x-auto border rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newQuotation.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Item description"
                              required
                            />
                          </td>
                          <td className="px-4 py-3 min-w-[120px]">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                              required
                            />
                          </td>
                          <td className="px-4 py-3 min-w-[140px]">
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">$</span>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                step="0.01"
                                min="0"
                                required
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 min-w-[120px]">
                            {formatCurrency(item.total)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                              disabled={newQuotation.items.length === 1}
                            >
                              <span className="material-icons">remove_circle</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="5" className="px-4 py-3">
                          <button
                            type="button"
                            onClick={addItem}
                            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <span className="material-icons text-blue-500 mr-1">add_circle</span>
                            Add Item
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Pricing Summary */}
              <div className="mt-6 mb-8">
                <h4 className="text-md font-medium mb-3 flex items-center text-blue-700">
                  <span className="material-icons mr-1 text-blue-500">payments</span>
                  Pricing Summary
                </h4>
                
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-200 shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-lg">{formatCurrency(newQuotation.subtotal)}</span>
                    </div>
                    
                    <div className="pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600 text-lg">-{formatCurrency(newQuotation.discount)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
                        <select
                          name="discountType"
                          value={newQuotation.discountType}
                          onChange={handleChange}
                          className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                        
                        <div className="relative flex-1">
                          {newQuotation.discountType === 'percentage' && (
                            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                              %
                            </span>
                          )}
                          {newQuotation.discountType === 'fixed' && (
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                              $
                            </span>
                          )}
                          <input
                            type="number"
                            name="discountValue"
                            value={newQuotation.discountValue}
                            onChange={handleChange}
                            className={`w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${newQuotation.discountType === 'fixed' ? 'pl-8' : ''}`}
                            min="0"
                            step={newQuotation.discountType === 'percentage' ? '0.1' : '0.01'}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Tax Rate:</span>
                        <div className="relative w-24">
                          <input
                            type="number"
                            name="taxRate"
                            value={newQuotation.taxRate}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-7"
                            min="0"
                            step="0.1"
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                            %
                          </span>
                        </div>
                      </div>
                      <span className="font-medium text-lg">{formatCurrency(newQuotation.tax)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(newQuotation.total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="material-icons text-blue-500 mr-1 text-sm">notes</span>
                      Notes & Additional Information
                    </label>
                    <textarea
                      name="notes"
                      value={newQuotation.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Any additional notes..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Terms & Conditions */}
              <div className="mt-6 mb-8">
                <h4 className="text-md font-medium mb-3 flex items-center text-blue-700">
                  <span className="material-icons mr-1 text-blue-500">gavel</span>
                  Terms & Conditions
                </h4>
                
                <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Terms
                      </label>
                      <select
                        name="paymentTerms"
                        value={newQuotation.paymentTerms}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Payment Terms</option>
                        <option value="100% Advance">100% Advance</option>
                        <option value="50% Advance, 50% Before Delivery">50% Advance, 50% Before Delivery</option>
                        <option value="30% Advance, 70% Before Delivery">30% Advance, 70% Before Delivery</option>
                        <option value="Net 15">Net 15 Days</option>
                        <option value="Net 30">Net 30 Days</option>
                        <option value="Net 45">Net 45 Days</option>
                        <option value="Net 60">Net 60 Days</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Terms
                      </label>
                      <select
                        name="deliveryTerms"
                        value={newQuotation.deliveryTerms}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Delivery Terms</option>
                        <option value="Ex Works">Ex Works (EXW)</option>
                        <option value="FOB">Free on Board (FOB)</option>
                        <option value="CIF">Cost, Insurance & Freight (CIF)</option>
                        <option value="DDP">Delivered Duty Paid (DDP)</option>
                        <option value="FCA">Free Carrier (FCA)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions
                    </label>
                    <textarea
                      name="termsConditions"
                      value={newQuotation.termsConditions}
                      onChange={handleChange}
                      rows="5"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter terms and conditions"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Buttons */}
            <div className="flex justify-center gap-4 mt-10 pt-6 border-t border-gray-200">
              <button
                type="submit"
                onClick={() => setSubmissionType('draft')}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center min-w-[160px]"
              >
                <span className="material-icons mr-2">save</span>
                Save as Draft
              </button>
              
              <button
                type="button"
                onClick={() => setSubmissionType('send')}
                className="px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-md hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center min-w-[160px]"
              >
                <span className="material-icons mr-2">send</span>
                Save & Send
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-6 py-3.5 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-200 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center min-w-[120px]"
              >
                <span className="material-icons mr-2">cancel</span>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Enquiry Lookup Modal */}
      {showEnquiryLookup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Select an Enquiry</h3>
              <button 
                onClick={() => setShowEnquiryLookup(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="material-icons text-gray-500">search</span>
                </span>
                <input 
                  type="text" 
                  placeholder="Search by ID, customer, contact person, or product..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-1">
              {enquiriesLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : enquiryLookupError ? (
                <div className="flex flex-col items-center justify-center h-48 text-red-500">
                  <span className="material-icons text-4xl mb-2">error_outline</span>
                  <p>{enquiryLookupError}</p>
                  <button
                    onClick={fetchEnquiries}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <span className="material-icons text-4xl mb-2">search_off</span>
                  <p>No enquiries found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 p-2">
                  {filteredEnquiries.map((enquiry) => (
                    <div 
                      key={enquiry._id || enquiry.id} 
                      className="border border-gray-200 rounded-md p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleEnquirySelect(enquiry)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium text-blue-700">{enquiry.id}</span>
                          <p className="font-medium">{enquiry.customer}</p>
                          <div className="text-sm text-gray-600">
                            <p>Contact: {enquiry.contactPerson}</p>
                            <p>{enquiry.product} • Qty: {enquiry.quantity}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            enquiry.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                            enquiry.status === 'Quoted' ? 'bg-yellow-100 text-yellow-800' :
                            enquiry.status === 'Converted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {enquiry.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(enquiry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={() => setShowEnquiryLookup(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotations; 