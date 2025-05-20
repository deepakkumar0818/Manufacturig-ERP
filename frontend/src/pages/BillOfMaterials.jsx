import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BillOfMaterials = () => {
  const navigate = useNavigate();
  const { id, action } = useParams();
  const isEditMode = action === 'edit' || !!id;
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [salesOrders, setSalesOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  
  // Form data state
  const [formData, setFormData] = useState({
    id: '',
    product_name: '',
    product_code: '',
    revision: 'A',
    status: 'Draft',
    description: '',
    notes: '',
    related_sales_order: '',
    created_by: 'Admin User', // Would come from auth in real app
    created_date: new Date().toISOString().split('T')[0],
    last_updated: new Date().toISOString().split('T')[0],
    components: [],
    assembly_instructions: '',
    quality_requirements: '',
    production_lead_time: '',
    required_tools: [],
    approved_by: '',
    approved_date: '',
    revision_history: []
  });
  
  // Fetch data on component mount
  useEffect(() => {
    setIsLoading(true);
    
    // Mock API calls in parallel
    Promise.all([
      // Fetch sales orders
      Promise.resolve([
        { id: 'SO-001-2024', customer: 'ABC Manufacturing', date: '2024-04-28' },
        { id: 'SO-002-2024', customer: 'XYZ Industries', date: '2024-04-25' },
        { id: 'SO-003-2024', customer: 'Acme Corp', date: '2024-04-22' },
        { id: 'SO-004-2024', customer: 'Global Solutions', date: '2024-04-20' },
        { id: 'SO-005-2024', customer: 'Tech Industries', date: '2024-04-18' }
      ]),
      
      // Fetch inventory items
      Promise.resolve([
        { id: 1, sku: 'RM-1001', name: 'Steel Sheet 1.5mm', category: 'raw-materials', unit: 'sheets' },
        { id: 2, sku: 'RM-1023', name: 'Aluminum Sheet 6061-T6', category: 'raw-materials', unit: 'sheets' },
        { id: 3, sku: 'RM-2045', name: 'Copper Wire 10 AWG', category: 'raw-materials', unit: 'meters' },
        { id: 4, sku: 'RM-3302', name: 'Stainless Steel Rod 316', category: 'raw-materials', unit: 'pieces' },
        { id: 5, sku: 'CP-2235', name: 'Bearing Assembly', category: 'components', unit: 'pieces' },
        { id: 6, sku: 'CP-4565', name: 'Hydraulic Valve 3/4"', category: 'components', unit: 'pieces' },
        { id: 7, sku: 'CP-4589', name: 'Electric Motor 2HP', category: 'components', unit: 'pieces' },
        { id: 8, sku: 'CP-8910', name: 'Hydraulic Pump XL-3', category: 'components', unit: 'pieces' }
      ]),
      
      // Fetch BOM data if in edit mode
      isEditMode 
        ? Promise.resolve({
            id: id,
            product_name: 'Industrial Valve Assembly',
            product_code: 'VA-240',
            revision: 'A',
            status: 'Draft',
            description: 'Complete valve assembly for industrial applications',
            notes: 'Assembly requires precision calibration',
            related_sales_order: 'SO-002-2024',
            created_by: 'John Smith',
            created_date: '2024-05-01',
            last_updated: '2024-05-02',
            components: [
              { id: 1, item_sku: 'CP-4565', item_name: 'Hydraulic Valve 3/4"', quantity: 1, unit: 'pieces', type: 'component', notes: 'Main valve body' },
              { id: 2, item_sku: 'RM-3302', item_name: 'Stainless Steel Rod 316', quantity: 2, unit: 'pieces', type: 'raw-material', notes: 'For valve stem' },
              { id: 3, item_sku: 'CP-2235', item_name: 'Bearing Assembly', quantity: 4, unit: 'pieces', type: 'component', notes: 'Valve seat bearings' }
            ],
            assembly_instructions: 'Assemble valve body first, then attach stems and bearings...',
            quality_requirements: 'Pressure test to 150 PSI after assembly',
            production_lead_time: '10 days',
            required_tools: ['Torque wrench', 'Calibration tools', 'Pressure testing equipment'],
            approved_by: '',
            approved_date: '',
            revision_history: []
          })
        : Promise.resolve(null)
    ])
    .then(([ordersData, itemsData, bomData]) => {
      setSalesOrders(ordersData);
      setInventoryItems(itemsData);
      
      if (bomData) {
        setFormData(bomData);
      } else if (!isEditMode) {
        // Generate new BOM ID for new entries
        const timestamp = new Date().getTime().toString().slice(-6);
        const year = new Date().getFullYear();
        const newId = `BOM-${year}-${timestamp}`;
        
        setFormData(prev => ({
          ...prev,
          id: newId
        }));
      }
      
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }, [id, isEditMode]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle component list changes
  const handleComponentChange = (index, field, value) => {
    setFormData(prev => {
      const updatedComponents = [...prev.components];
      updatedComponents[index] = {
        ...updatedComponents[index],
        [field]: value
      };
      
      // If we changed the item_sku, update the item_name
      if (field === 'item_sku') {
        const selectedItem = inventoryItems.find(item => item.sku === value);
        if (selectedItem) {
          updatedComponents[index].item_name = selectedItem.name;
          updatedComponents[index].unit = selectedItem.unit;
          updatedComponents[index].type = selectedItem.category;
        }
      }
      
      return {
        ...prev,
        components: updatedComponents
      };
    });
  };

  // Add a new component to the list
  const handleAddComponent = () => {
    setFormData(prev => ({
      ...prev,
      components: [
        ...prev.components,
        {
          id: prev.components.length + 1,
          item_sku: '',
          item_name: '',
          quantity: 1,
          unit: 'pieces',
          type: 'component',
          notes: ''
        }
      ]
    }));
  };

  // Remove a component from the list
  const handleRemoveComponent = (index) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index)
    }));
  };

  // Handle adding a required tool
  const handleAddTool = (tool) => {
    if (tool && !formData.required_tools.includes(tool)) {
      setFormData(prev => ({
        ...prev,
        required_tools: [...prev.required_tools, tool]
      }));
    }
  };

  // Handle removing a required tool
  const handleRemoveTool = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      required_tools: prev.required_tools.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.product_name || !formData.product_code) {
      alert('Please enter a product name and code');
      return;
    }
    
    if (formData.components.length === 0) {
      alert('Please add at least one component to the BOM');
      return;
    }
    
    setIsLoading(true);
    
    // Update the last updated date
    const updatedFormData = {
      ...formData,
      last_updated: new Date().toISOString().split('T')[0]
    };
    
    // In a real app, this would be an API call to save data
    setTimeout(() => {
      console.log('Saved BOM:', updatedFormData);
      setIsLoading(false);
      navigate('/bill-of-materials');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? 'Edit Bill of Materials' : 'Create Bill of Materials'}
            </h2>
            <p className="text-gray-600 mt-1">Define component structure and assembly requirements</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">BOM ID: {formData.id || 'New BOM'}</div>
            <div className="text-xs text-gray-500 mt-1">Revision: {formData.revision}</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6 -mb-px">
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('general')}
              >
                General Information
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'components' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('components')}
              >
                Components
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'production' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('production')}
              >
                Production Details
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'approvals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('approvals')}
              >
                Approvals
              </button>
            </nav>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* General Information Tab */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <h3 className="text-lg font-medium text-blue-800 mb-4">Product Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                        <input
                          type="text"
                          name="product_name"
                          value={formData.product_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Code*</label>
                        <input
                          type="text"
                          name="product_code"
                          value={formData.product_code}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="col-span-2 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Provide a detailed description of the product"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-lg font-medium text-green-800 mb-4">Sales Order Connection</h3>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Related Sales Order</label>
                      <select
                        name="related_sales_order"
                        value={formData.related_sales_order}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Not linked to a Sales Order</option>
                        {salesOrders.map(order => (
                          <option key={order.id} value={order.id}>
                            {order.id} - {order.customer}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Linking to a sales order will associate this BOM with a specific customer order
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Status Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">BOM Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Released">Released</option>
                          <option value="Obsolete">Obsolete</option>
                        </select>
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Revision</label>
                        <input
                          type="text"
                          name="revision"
                          value={formData.revision}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          readOnly={isEditMode}
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                        <input
                          type="text"
                          name="created_by"
                          value={formData.created_by}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          readOnly
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                        <input
                          type="date"
                          name="created_date"
                          value={formData.created_date}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h3 className="text-lg font-medium text-orange-800 mb-4">Additional Information</h3>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add any special notes or considerations for this BOM"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Components Tab */}
            {activeTab === 'components' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Components & Materials</h3>
                    <button
                      type="button"
                      onClick={handleAddComponent}
                      className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <span className="material-icons text-blue-500 mr-1">add_circle</span>
                      Add Component
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto border rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.components.map((component, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm">
                              <select
                                value={component.item_sku}
                                onChange={(e) => handleComponentChange(index, 'item_sku', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Item</option>
                                {inventoryItems.map(item => (
                                  <option key={item.id} value={item.sku}>
                                    {item.sku} - {item.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {component.item_name || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="number"
                                min="1"
                                value={component.quantity}
                                onChange={(e) => handleComponentChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {component.unit}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                component.type === 'raw-materials' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {component.type === 'raw-materials' ? 'Raw Material' : 'Component'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <input
                                type="text"
                                value={component.notes}
                                onChange={(e) => handleComponentChange(index, 'notes', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Optional notes"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveComponent(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <span className="material-icons">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                        
                        {formData.components.length === 0 && (
                          <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                              No components added yet. Click the "Add Component" button to add items.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Production Details Tab */}
            {activeTab === 'production' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
                    <h3 className="text-lg font-medium text-purple-800 mb-4">Assembly Instructions</h3>
                    
                    <div className="mb-3">
                      <textarea
                        name="assembly_instructions"
                        value={formData.assembly_instructions}
                        onChange={handleInputChange}
                        rows="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Provide detailed assembly instructions and sequence..."
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500">
                        Include steps, references to assembly diagrams, and special procedures
                      </p>
                    </div>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                    <h3 className="text-lg font-medium text-teal-800 mb-4">Quality Requirements</h3>
                    
                    <div className="mb-3">
                      <textarea
                        name="quality_requirements"
                        value={formData.quality_requirements}
                        onChange={handleInputChange}
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Specify quality standards, inspections, and testing requirements..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
                    <h3 className="text-lg font-medium text-yellow-800 mb-4">Production Specifications</h3>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Production Lead Time
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="production_lead_time"
                          value={formData.production_lead_time}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 10 days"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h3 className="text-lg font-medium text-red-800 mb-4">Required Tools</h3>
                    
                    <div className="mb-3">
                      <div className="flex">
                        <input
                          type="text"
                          id="tool-input"
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add required tool or equipment..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTool(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100"
                          onClick={() => {
                            const input = document.getElementById('tool-input');
                            handleAddTool(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.required_tools.map((tool, index) => (
                        <div 
                          key={index}
                          className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-300 text-sm"
                        >
                          <span>{tool}</span>
                          <button
                            type="button"
                            className="ml-2 text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveTool(index)}
                          >
                            <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
                          </button>
                        </div>
                      ))}
                      
                      {formData.required_tools.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No tools specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <h3 className="text-lg font-medium text-blue-800 mb-4">Approval Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
                        <input
                          type="text"
                          name="approved_by"
                          value={formData.approved_by}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Name of approver"
                          disabled={formData.status !== 'Released'}
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Approval Date</label>
                        <input
                          type="date"
                          name="approved_date"
                          value={formData.approved_date}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={formData.status !== 'Released'}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        {formData.status === 'Released' 
                          ? 'This BOM has been approved for production. Further changes will require a new revision.'
                          : 'This BOM has not yet been approved for production.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-lg font-medium text-green-800 mb-4">Revision History</h3>
                    
                    {formData.revision_history.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {formData.revision_history.map((revision, index) => (
                          <div key={index} className="py-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Rev {revision.revision}</span>
                              <span className="text-xs text-gray-500">{revision.date}</span>
                            </div>
                            <p className="text-sm mt-1">{revision.notes}</p>
                            <div className="text-xs text-gray-500 mt-1">By: {revision.by}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No revision history available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/bill-of-materials')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  status: 'Draft'
                }));
                handleSubmit(new Event('click'));
              }}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  status: 'Under Review'
                }));
              }}
            >
              Submit for Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BillOfMaterials; 