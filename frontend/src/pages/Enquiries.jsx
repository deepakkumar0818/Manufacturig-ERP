import { useState } from 'react';

const Enquiries = () => {
  const [activeTab, setActiveTab] = useState('list');
  
  // Sample enquiry data for the list
  const [enquiries, setEnquiries] = useState([
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
    {
      id: 'ENQ-002',
      date: '2024-04-23',
      customer: 'XYZ Industries',
      contactPerson: 'Jane Doe',
      phone: '+1 987-654-3210',
      email: 'jane@xyzindustries.com',
      status: 'Quoted',
      product: 'Industrial Valves',
      quantity: 25,
      expectedDelivery: '2024-06-15',
      notes: 'High-pressure tolerance required'
    },
    {
      id: 'ENQ-003',
      date: '2024-04-20',
      customer: 'Acme Corp',
      contactPerson: 'Robert Johnson',
      phone: '+1 456-789-0123',
      email: 'robert@acmecorp.com',
      status: 'Closed',
      product: 'Metal Fabrication',
      quantity: 100,
      expectedDelivery: '2024-05-10',
      notes: 'Rejected due to timeline constraints'
    }
  ]);
  
  // State for new enquiry form
  const [newEnquiry, setNewEnquiry] = useState({
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
  
  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `ENQ-${String(enquiries.length + 1).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    
    setEnquiries([
      ...enquiries,
      {
        ...newEnquiry,
        id,
        date,
        status: 'Open'
      }
    ]);
    
    // Reset form
    setNewEnquiry({
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
    
    // Go back to list view
    setActiveTab('list');
  };
  
  // Form field update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle multi-select for additional services
    if (name === 'additionalServices') {
      // Get all selected options from multi-select
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setNewEnquiry({
        ...newEnquiry,
        [name]: selectedOptions
      });
    } else {
      setNewEnquiry({
        ...newEnquiry,
        [name]: value
      });
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
  
  return (
    <div className="space-y-6">
      {/* Tabs and Action Button */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('list')}
          >
            Enquiry List
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('create')}
          >
            Create Enquiry
          </button>
        </div>
        
        {activeTab === 'list' && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setActiveTab('create')}
          >
            <span className="material-icons mr-1">add</span> New Enquiry
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
                        <button className="text-blue-600 hover:text-blue-900">
                          <span className="material-icons text-sm">visibility</span>
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <span className="material-icons text-sm">edit</span>
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
      
      {/* Create Enquiry Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        
          
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
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer"
                      value={newEnquiry.customer}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      value={newEnquiry.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Full name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6">
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
                        value={newEnquiry.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                        value={newEnquiry.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+1 (123) 456-7890"
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
                    value={newEnquiry.address}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Street address"
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
                      value={newEnquiry.city}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={newEnquiry.state}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="State/Province"
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={newEnquiry.zipCode}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Zip/Postal code"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry/Sector
                  </label>
                  <select
                    name="industry"
                    value={newEnquiry.industry}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    Product/Service <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={newEnquiry.product}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="E.g., CNC Machining, Metal Fabrication"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={newEnquiry.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Number of units"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Material
                  </label>
                  <input
                    type="text"
                    name="preferredMaterial"
                    value={newEnquiry.preferredMaterial}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="E.g., Aluminum, Steel, Plastic"
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={newEnquiry.budget}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    value={newEnquiry.specs}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Material specifications, dimensions, tolerances, etc."
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
                        value={newEnquiry.expectedDelivery}
                        onChange={handleChange}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Timeline
                    </label>
                    <select
                      name="projectTimeline"
                      value={newEnquiry.projectTimeline}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      value={newEnquiry.additionalServices}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      value={newEnquiry.referenceSource}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    value={newEnquiry.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Any additional information or special requirements..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Form Buttons */}
            <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[170px] flex items-center justify-center"
              >
                <span className="material-icons mr-2">send</span>
                Submit Enquiry
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-10 py-3.5 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-200 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 min-w-[170px] flex items-center justify-center"
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

export default Enquiries; 