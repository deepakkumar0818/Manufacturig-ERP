import { useState, useEffect } from 'react';

const SalesOrder = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error'); // error, success, warning
  const [orderStatus, setOrderStatus] = useState('draft'); // draft, pending, confirmed, in-production, completed
  
  // Sample sales order data for the list
  const [salesOrders, setSalesOrders] = useState([
    {
      id: 'SO-001-2024',
      date: '2024-04-28',
      quotationId: 'QT-001-2024',
      customer: 'ABC Manufacturing',
      contactPerson: 'John Smith',
      email: 'john@abcmanufacturing.com',
      phone: '+1 234-567-8901',
      deliveryDate: '2024-05-15',
      items: [
        { id: 1, description: 'Custom Machinery Parts', quantity: 50, unitPrice: 120, total: 6000 }
      ],
      subtotal: 6000,
      tax: 600,
      discount: 300,
      total: 6300,
      status: 'Pending',
      termsConditions: 'Standard manufacturing terms apply',
      notes: 'Requires precision machining'
    },
    {
      id: 'SO-002-2024',
      date: '2024-04-25',
      quotationId: 'QT-002-2024',
      customer: 'XYZ Industries',
      contactPerson: 'Jane Doe',
      email: 'jane@xyzindustries.com',
      phone: '+1 987-654-3210',
      deliveryDate: '2024-05-20',
      items: [
        { id: 1, description: 'Industrial Valves', quantity: 25, unitPrice: 320, total: 8000 }
      ],
      subtotal: 8000,
      tax: 800,
      discount: 0,
      total: 8800,
      status: 'Confirmed',
      termsConditions: 'Payment due within 30 days of delivery',
      notes: 'High-pressure tolerance required'
    },
    {
      id: 'SO-003-2024',
      date: '2024-04-22',
      quotationId: 'QT-003-2024',
      customer: 'Acme Corp',
      contactPerson: 'Robert Johnson',
      email: 'robert@acmecorp.com',
      phone: '+1 456-789-0123',
      deliveryDate: '2024-05-10',
      items: [
        { id: 1, description: 'Metal Fabrication - Sheet Metal Components', quantity: 100, unitPrice: 45, total: 4500 },
        { id: 2, description: 'Assembly Service', quantity: 1, unitPrice: 500, total: 500 }
      ],
      subtotal: 5000,
      tax: 500,
      discount: 250,
      total: 5250,
      status: 'In Production',
      termsConditions: '50% advance payment required',
      notes: 'Priority production requested'
    }
  ]);
  
  // State for new sales order form
  const [newOrder, setNewOrder] = useState({
    quotationId: '',
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
    deliveryDate: '',
    priority: 'normal', // low, normal, high, urgent
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
  });
  
  // Component mount effect to initialize delivery date
  useEffect(() => {
    // Set delivery date 14 days from now by default
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 14);
    const formattedDate = deliveryDate.toISOString().split('T')[0];
    
    setNewOrder({
      ...newOrder,
      deliveryDate: formattedDate
    });
  }, []);
  
  // Form submission handler
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
      country: 'Country',
      deliveryDate: 'Delivery Date'
    };
    
    // Check for empty required fields
    const emptyFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!newOrder[field]) {
        emptyFields.push(label);
      }
    }
    
    // Check if there are items
    if (newOrder.items.length === 0) {
      emptyFields.push('At least one item');
    } else {
      // Check if any item fields are empty
      const hasEmptyItemFields = newOrder.items.some(
        item => !item.description || !item.quantity || !item.unitPrice
      );
      if (hasEmptyItemFields) {
        emptyFields.push('Complete item details (description, quantity, and price)');
      }
    }
    
    // If there are empty fields, show toast and return
    if (emptyFields.length > 0) {
      showToastNotification(`Please fill in the following required fields: ${emptyFields.join(', ')}`, 'error');
      return;
    }
    
    const currentYear = new Date().getFullYear();
    const id = `SO-${String(salesOrders.length + 1).padStart(3, '0')}-${currentYear}`;
    const date = new Date().toISOString().split('T')[0];
    
    // Set status based on order status
    const status = orderStatus === 'draft' ? 'Pending' : 'Confirmed';
    
    setSalesOrders([
      ...salesOrders,
      {
        ...newOrder,
        id,
        date,
        status
      }
    ]);
    
    // Show success message
    const action = orderStatus === 'draft' ? 'saved as draft' : 'confirmed';
    showToastNotification(`Sales Order successfully ${action}!`, 'success');
    
    // Reset form
    setNewOrder({
      quotationId: '',
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
      deliveryDate: '',
      priority: 'normal',
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
    });
    
    // Go back to list view
    setActiveTab('list');
  };
  
  // Handle save and confirm
  const handleSaveAndConfirm = () => {
    setOrderStatus('confirmed');
    // Trigger form submission
    document.getElementById('orderForm').requestSubmit();
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
    
    if (['discountType', 'discountValue'].includes(name)) {
      handleDiscountChange(name, value);
    } else if (name === 'taxRate') {
      handleTaxRateChange(value);
    } else {
      setNewOrder({
        ...newOrder,
        [name]: value
      });
    }
  };
  
  // Handle tax rate changes
  const handleTaxRateChange = (value) => {
    const taxRate = parseFloat(value) || 0;
    
    // Calculate with current values
    const subtotal = newOrder.subtotal;
    const discount = newOrder.discount;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (taxRate / 100);
    const total = taxableAmount + tax;
    
    // Update state with all calculated values
    setNewOrder({
      ...newOrder,
      taxRate,
      tax,
      total
    });
  };
  
  // Handle discount changes
  const handleDiscountChange = (name, value) => {
    let updatedOrder = {
      ...newOrder,
      [name]: value
    };
    
    // Calculate new discount value
    const subtotal = updatedOrder.subtotal;
    let discount = 0;
    
    if (name === 'discountType') {
      // When changing discount type, recalculate based on current value
      if (value === 'percentage') {
        // Converting from fixed to percentage
        discount = subtotal > 0 ? (updatedOrder.discountValue / subtotal * 100) : 0;
        updatedOrder.discountValue = parseFloat(discount.toFixed(2));
      } else {
        // Converting from percentage to fixed
        discount = subtotal * (updatedOrder.discountValue / 100);
        updatedOrder.discountValue = parseFloat(discount.toFixed(2));
      }
    } else {
      // Just updating the discount value
      const discountValue = parseFloat(value) || 0;
      updatedOrder.discountValue = discountValue;
      
      if (updatedOrder.discountType === 'percentage') {
        discount = subtotal * (discountValue / 100);
      } else {
        discount = discountValue;
      }
    }
    
    // Calculate tax and total
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (parseFloat(updatedOrder.taxRate) || 0) / 100;
    const total = taxableAmount + tax;
    
    // Update state with all calculated values
    setNewOrder({
      ...updatedOrder,
      discount,
      tax,
      total
    });
  };
  
  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
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
    
    setNewOrder({
      ...newOrder,
      items: updatedItems
    });
    
    // Recalculate all totals
    calculateTotals(updatedItems);
  };
  
  // Add new item row
  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };
  
  // Remove item row
  const removeItem = (index) => {
    if (newOrder.items.length === 1) return;
    
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({
      ...newOrder,
      items: updatedItems
    });
    
    // Recalculate all totals
    calculateTotals(updatedItems);
  };
  
  // Calculate subtotal, tax, discount, and total
  const calculateTotals = (items = newOrder.items) => {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
    // Calculate discount
    let discount = 0;
    if (newOrder.discountType === 'percentage') {
      discount = subtotal * (parseFloat(newOrder.discountValue) || 0) / 100;
    } else {
      discount = parseFloat(newOrder.discountValue) || 0;
    }
    
    // Calculate tax
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (parseFloat(newOrder.taxRate) || 0) / 100;
    
    // Calculate total
    const total = taxableAmount + tax;
    
    setNewOrder({
      ...newOrder,
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
      case 'Pending':
        return 'bg-yellow-500';
      case 'Confirmed':
        return 'bg-blue-500';
      case 'In Production':
        return 'bg-purple-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Cancelled':
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
        <div className={`fixed top-4 right-4 z-50 w-96 rounded-lg shadow-xl p-5 ${
          toastType === 'error' ? 'bg-red-100 text-red-800 border-red-300' : 
          toastType === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 
          'bg-yellow-100 text-yellow-800 border-yellow-300'
        } border-2 animate-fade-in`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toastType === 'error' && <span className="material-icons text-red-600 text-2xl">error_outline</span>}
              {toastType === 'success' && <span className="material-icons text-green-600 text-2xl">check_circle</span>}
              {toastType === 'warning' && <span className="material-icons text-yellow-600 text-2xl">warning</span>}
            </div>
            <div className="ml-4 w-full flex-1">
              <p className="text-base font-medium">{toastMessage}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-transparent text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowToast(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs and Action Button */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('list')}
          >
            Sales Order List
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('create')}
          >
            Create Sales Order
          </button>
        </div>
        
        {activeTab === 'list' && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setActiveTab('create')}
          >
            <span className="material-icons mr-1">add</span> New Sales Order
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quotationId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-gray-500">{order.contactPerson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliveryDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-white text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
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
      
      {/* Create Sales Order Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-bold text-blue-700 flex items-center">
              <span className="material-icons mr-2 text-blue-500">shopping_cart</span>
              Create New Sales Order
            </h2>
            <p className="text-sm text-blue-600 mt-1">Create a new sales order by filling out the information below</p>
          </div>
          
          <form id="orderForm" onSubmit={handleSubmit} className="p-6">
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
                    Related Quotation
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="quotationId"
                      value={newOrder.quotationId}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter quotation ID if applicable"
                    />
                    <button 
                      type="button" 
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md font-medium flex items-center transition-colors"
                    >
                      <span className="material-icons mr-1 text-sm">search</span>
                      Find
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Link this sales order to an existing quotation to auto-fill customer details</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer"
                      value={newOrder.customer}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Company name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={newOrder.contactPerson}
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
                        value={newOrder.email}
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
                        value={newOrder.phone}
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
                        value={newOrder.streetAddress || ''}
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
                        value={newOrder.addressLine2 || ''}
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
                        value={newOrder.city || ''}
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
                        value={newOrder.state || ''}
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
                        value={newOrder.postalCode || ''}
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
                        value={newOrder.country || ''}
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
            
            {/* Sales Order Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 flex items-center text-blue-700">
                <span className="material-icons mr-2 text-blue-500">description</span>
                Sales Order Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <span className="material-icons text-blue-500">event</span>
                      </span>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={newOrder.deliveryDate}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Expected delivery date for this order</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      name="priority"
                      value={newOrder.priority}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Production priority for this order</p>
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
                      {newOrder.items.map((item, index) => (
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
                              disabled={newOrder.items.length === 1}
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
                      <span className="font-medium text-lg">{formatCurrency(newOrder.subtotal)}</span>
                    </div>
                    
                    <div className="pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600 text-lg">-{formatCurrency(newOrder.discount)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
                        <select
                          name="discountType"
                          value={newOrder.discountType}
                          onChange={handleChange}
                          className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                        
                        <div className="relative flex-1">
                          {newOrder.discountType === 'percentage' && (
                            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                              %
                            </span>
                          )}
                          {newOrder.discountType === 'fixed' && (
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                              $
                            </span>
                          )}
                          <input
                            type="number"
                            name="discountValue"
                            value={newOrder.discountValue}
                            onChange={handleChange}
                            className={`w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${newOrder.discountType === 'fixed' ? 'pl-8' : ''}`}
                            min="0"
                            step={newOrder.discountType === 'percentage' ? '0.1' : '0.01'}
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
                            value={newOrder.taxRate}
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
                      <span className="font-medium text-lg">{formatCurrency(newOrder.tax)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(newOrder.total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="material-icons text-blue-500 mr-1 text-sm">notes</span>
                      Notes & Additional Information
                    </label>
                    <textarea
                      name="notes"
                      value={newOrder.notes}
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
                        value={newOrder.paymentTerms}
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
                        value={newOrder.deliveryTerms}
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
                      value={newOrder.termsConditions}
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
                onClick={() => setOrderStatus('draft')}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center min-w-[160px]"
              >
                <span className="material-icons mr-2">save</span>
                Save as Draft
              </button>
              
              <button
                type="button"
                onClick={handleSaveAndConfirm}
                className="px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-md hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center min-w-[180px]"
              >
                <span className="material-icons mr-2">check_circle</span>
                Save & Confirm
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
    </div>
  );
};

export default SalesOrder; 