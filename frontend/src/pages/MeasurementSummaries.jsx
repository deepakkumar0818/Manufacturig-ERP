import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MeasurementSummaries = ({ id: propId, viewMode, onComplete }) => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const isEditMode = viewMode === 'edit' || !!id;
  const [formData, setFormData] = useState({
    // Reference information
    reference_id: '',
    quotation_ref: '',
    sales_order_ref: '',
    customer_name: '',
    project_name: '',
    
    // Sales Person Information
    sales_person_id: '',
    sales_person_name: '',
    sales_person_contact: '',
    sales_team: '',
    sales_region: '',
    
    // Dates
    date_measured: '',
    required_delivery_date: '',
    
    // Measurement details
    location_measured: '',
    measured_by: '',
    verified_by: '',
    
    // Product specifications
    product_type: '',
    material: '',
    finish: '',
    color: '',
    
    // Dimensions (base measurements)
    width: '',
    height: '',
    depth: '',
    thickness: '',
    
    // Additional measurements specific to the product
    measurements: [],
    
    // Special requirements
    installation_notes: '',
    special_instructions: '',
    customer_requests: '',
    
    // Sales-specific notes
    sales_notes: '',
    upsell_opportunities: '',
    cross_sell_recommendations: '',
    
    // Attachments
    attachments: [],
    
    // Status
    status: 'draft', // draft, approved, in_production, etc.
    
    // Approvals
    approved_by: '',
    approval_date: '',
    sales_manager_approval: false,
    sales_manager_name: '',
    sales_manager_approval_date: '',
    
    // Revisions
    revision_number: '1',
    revision_history: [],
    
    // Sign-offs
    sales_sign_off: false,
    production_sign_off: false,
    quality_check_sign_off: false
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [salesTeams, setSalesTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showMeasurementFields, setShowMeasurementFields] = useState(false);

  // Mock function to fetch data - would be replaced with actual API calls
  useEffect(() => {
    // Simulating API calls to fetch related data
    setIsLoading(true);
    Promise.all([
      // These would be actual API calls in a real implementation
      Promise.resolve([
        { id: '1', name: 'ABC Corp' },
        { id: '2', name: 'XYZ Industries' }
      ]),
      Promise.resolve([
        { id: 'Q001', customer_id: '1', project_name: 'Office Renovation', sales_person_id: 'SP1' },
        { id: 'Q002', customer_id: '2', project_name: 'Factory Installation', sales_person_id: 'SP2' }
      ]),
      Promise.resolve([
        { id: 'SO001', quotation_id: 'Q001', status: 'approved', sales_person_id: 'SP1' },
        { id: 'SO002', quotation_id: 'Q002', status: 'approved', sales_person_id: 'SP2' }
      ]),
      Promise.resolve([
        { id: '1', name: 'Window', fields: ['frame_width', 'frame_height', 'glass_thickness'] },
        { id: '2', name: 'Door', fields: ['door_width', 'door_height', 'handle_height'] },
        { id: '3', name: 'Cabinet', fields: ['cabinet_width', 'cabinet_height', 'shelf_spacing'] }
      ]),
      Promise.resolve([
        { id: 'SP1', name: 'John Smith', contact: '555-1234', team_id: 'ST1', region: 'North' },
        { id: 'SP2', name: 'Sarah Johnson', contact: '555-5678', team_id: 'ST1', region: 'South' },
        { id: 'SP3', name: 'Michael Brown', contact: '555-9012', team_id: 'ST2', region: 'East' },
        { id: 'SP4', name: 'Emily Davis', contact: '555-3456', team_id: 'ST2', region: 'West' }
      ]),
      Promise.resolve([
        { id: 'ST1', name: 'Commercial Sales', manager: 'Robert Wilson' },
        { id: 'ST2', name: 'Residential Sales', manager: 'Jennifer Lee' }
      ])
    ])
      .then(([customersData, quotationsData, salesOrdersData, productsData, salesPersonsData, salesTeamsData]) => {
        setCustomers(customersData);
        setQuotations(quotationsData);
        setSalesOrders(salesOrdersData);
        setProducts(productsData);
        setSalesPersons(salesPersonsData);
        setSalesTeams(salesTeamsData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for product type change - updates measurement fields
  const handleProductTypeChange = (e) => {
    const productId = e.target.value;
    const selectedProduct = products.find(p => p.id === productId);
    
    setFormData(prev => ({
      ...prev,
      product_type: productId,
      // Initialize measurements array with the product's required fields
      measurements: selectedProduct ? selectedProduct.fields.map(field => ({
        name: field,
        value: '',
        unit: 'mm'
      })) : []
    }));
    
    setShowMeasurementFields(!!selectedProduct);
  };

  // Handler for measurement field changes
  const handleMeasurementChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedMeasurements = [...prev.measurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index],
        [name]: value
      };
      return {
        ...prev,
        measurements: updatedMeasurements
      };
    });
  };

  // Handler for file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  // Handler for quotation selection
  const handleQuotationChange = (e) => {
    const quotationId = e.target.value;
    const selectedQuotation = quotations.find(q => q.id === quotationId);
    
    if (selectedQuotation) {
      const relatedCustomer = customers.find(c => c.id === selectedQuotation.customer_id);
      const relatedSalesOrder = salesOrders.find(so => so.quotation_id === quotationId);
      const relatedSalesPerson = salesPersons.find(sp => sp.id === selectedQuotation.sales_person_id);
      const relatedSalesTeam = relatedSalesPerson 
        ? salesTeams.find(st => st.id === relatedSalesPerson.team_id) 
        : null;
      
      setFormData(prev => ({
        ...prev,
        quotation_ref: quotationId,
        sales_order_ref: relatedSalesOrder ? relatedSalesOrder.id : '',
        customer_name: relatedCustomer ? relatedCustomer.id : '',
        project_name: selectedQuotation.project_name || '',
        sales_person_id: relatedSalesPerson ? relatedSalesPerson.id : '',
        sales_person_name: relatedSalesPerson ? relatedSalesPerson.name : '',
        sales_person_contact: relatedSalesPerson ? relatedSalesPerson.contact : '',
        sales_team: relatedSalesTeam ? relatedSalesTeam.id : '',
        sales_region: relatedSalesPerson ? relatedSalesPerson.region : ''
      }));
    }
  };

  // Handler for sales order selection
  const handleSalesOrderChange = (e) => {
    const salesOrderId = e.target.value;
    const selectedSalesOrder = salesOrders.find(so => so.id === salesOrderId);
    
    if (selectedSalesOrder) {
      const relatedQuotation = quotations.find(q => q.id === selectedSalesOrder.quotation_id);
      
      if (relatedQuotation) {
        const relatedCustomer = customers.find(c => c.id === relatedQuotation.customer_id);
        const relatedSalesPerson = salesPersons.find(sp => sp.id === selectedSalesOrder.sales_person_id);
        const relatedSalesTeam = relatedSalesPerson 
          ? salesTeams.find(st => st.id === relatedSalesPerson.team_id) 
          : null;
        
        setFormData(prev => ({
          ...prev,
          sales_order_ref: salesOrderId,
          quotation_ref: relatedQuotation.id,
          customer_name: relatedCustomer ? relatedCustomer.id : '',
          project_name: relatedQuotation.project_name || '',
          sales_person_id: relatedSalesPerson ? relatedSalesPerson.id : '',
          sales_person_name: relatedSalesPerson ? relatedSalesPerson.name : '',
          sales_person_contact: relatedSalesPerson ? relatedSalesPerson.contact : '',
          sales_team: relatedSalesTeam ? relatedSalesTeam.id : '',
          sales_region: relatedSalesPerson ? relatedSalesPerson.region : ''
        }));
      }
    }
  };

  // Handler for sales person selection
  const handleSalesPersonChange = (e) => {
    const salesPersonId = e.target.value;
    const selectedSalesPerson = salesPersons.find(sp => sp.id === salesPersonId);
    
    if (selectedSalesPerson) {
      const relatedSalesTeam = salesTeams.find(st => st.id === selectedSalesPerson.team_id);
      
      setFormData(prev => ({
        ...prev,
        sales_person_id: selectedSalesPerson.id,
        sales_person_name: selectedSalesPerson.name,
        sales_person_contact: selectedSalesPerson.contact,
        sales_team: relatedSalesTeam ? relatedSalesTeam.id : '',
        sales_region: selectedSalesPerson.region
      }));
    }
  };

  // Generate a unique reference ID or use the ID from params
  useEffect(() => {
    if (!formData.reference_id) {
      if (isEditMode && id) {
        // If in edit mode, we'll load the data from the server using the ID
        console.log(`Loading measurement summary with ID: ${id}`);
        // This would be an API call in a real implementation
        
        // For now, we'll just set the reference_id to the ID from the URL
        setFormData(prev => ({
          ...prev,
          reference_id: id
        }));
      } else {
        // For new measurements, generate a unique ID
        const now = new Date();
        const timestamp = now.getTime().toString().slice(-6);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const referenceId = `MS-${year}${month}-${timestamp}`;
        
        console.log('Generating new measurement ID:', referenceId);
        
        setFormData(prev => ({
          ...prev,
          reference_id: referenceId
        }));
      }
    }
  }, [id, isEditMode, viewMode, formData.reference_id]);

  // Save form data
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate sales person information is present
    if (!formData.sales_person_id) {
      alert('Please select a sales person responsible for these measurements.');
      setActiveTab('general');
      return;
    }
    
    // If submitting for approval, ensure sales sign-off
    if (formData.status === 'pending_approval' && !formData.sales_sign_off) {
      alert('Sales person sign-off is required before submitting for approval.');
      setActiveTab('approvals');
      return;
    }

    setIsLoading(true);
    
    // Record the sales person as the measured_by if not already set
    if (!formData.measured_by) {
      setFormData(prev => ({
        ...prev,
        measured_by: prev.sales_person_name
      }));
    }
    
    // This would be an API call in a real implementation
    const saveOperation = isEditMode ? 'updated' : 'created';
    console.log(`${saveOperation.charAt(0).toUpperCase() + saveOperation.slice(1)} measurement summary:`, formData);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      // Use onComplete from props if available, otherwise use navigate
      if (onComplete) {
        onComplete();
      } else {
        navigate('/measurement-summaries', { 
          state: { 
            message: `Measurement summary successfully ${saveOperation}.`,
            type: 'success' 
          }
        });
      }
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Measurement Summary</h2>
            <p className="text-gray-600 mt-1">Create and manage measurement details for manufacturing</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">Form ID: {formData.reference_id || 'New Form'}</div>
            <div className="text-xs text-gray-500 mt-1">Managed by Sales Department</div>
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
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'measurements' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('measurements')}
              >
                Measurements
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'sales_notes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('sales_notes')}
              >
                Sales Notes
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'attachments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('attachments')}
              >
                Attachments
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
                    <h3 className="text-lg font-medium text-blue-800 mb-4">Reference Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                        <input
                          type="text"
                          name="reference_id"
                          value={formData.reference_id}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input
                          type="text"
                          name="project_name"
                          value={formData.project_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Reference</label>
                        <select
                          name="quotation_ref"
                          value={formData.quotation_ref}
                          onChange={handleQuotationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a Quotation</option>
                          {quotations.map(quotation => (
                            <option key={quotation.id} value={quotation.id}>{quotation.id} - {quotation.project_name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order Reference</label>
                        <select
                          name="sales_order_ref"
                          value={formData.sales_order_ref}
                          onChange={handleSalesOrderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a Sales Order</option>
                          {salesOrders.map(salesOrder => (
                            <option key={salesOrder.id} value={salesOrder.id}>{salesOrder.id}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-2 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                        <select
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={formData.quotation_ref || formData.sales_order_ref}
                        >
                          <option value="">Select a Customer</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h3 className="text-lg font-medium text-orange-800 mb-4">Sales Person Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sales Person</label>
                        <select
                          name="sales_person_id"
                          value={formData.sales_person_id}
                          onChange={handleSalesPersonChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a Sales Person</option>
                          {salesPersons.map(salesPerson => (
                            <option key={salesPerson.id} value={salesPerson.id}>{salesPerson.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                          type="text"
                          name="sales_person_contact"
                          value={formData.sales_person_contact}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          readOnly={!!formData.sales_person_id}
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sales Team</label>
                        <select
                          name="sales_team"
                          value={formData.sales_team}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={!!formData.sales_person_id}
                        >
                          <option value="">Select a Sales Team</option>
                          {salesTeams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                        <input
                          type="text"
                          name="sales_region"
                          value={formData.sales_region}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          readOnly={!!formData.sales_person_id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                    <h3 className="text-lg font-medium text-green-800 mb-4">Measurement Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Measured</label>
                        <input
                          type="date"
                          name="date_measured"
                          value={formData.date_measured}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Delivery Date</label>
                        <input
                          type="date"
                          name="required_delivery_date"
                          value={formData.required_delivery_date}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Measured</label>
                        <input
                          type="text"
                          name="location_measured"
                          value={formData.location_measured}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., On-site, Customer premises, etc."
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Measured By</label>
                        <input
                          type="text"
                          name="measured_by"
                          value={formData.measured_by}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="col-span-2 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Verified By</label>
                        <input
                          type="text"
                          name="verified_by"
                          value={formData.verified_by}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Product Specifications</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                        <select
                          name="product_type"
                          value={formData.product_type}
                          onChange={handleProductTypeChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a Product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                        <input
                          type="text"
                          name="material"
                          value={formData.material}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Aluminum, Wood, Steel, etc."
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Finish</label>
                        <input
                          type="text"
                          name="finish"
                          value={formData.finish}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Powder coated, Anodized, etc."
                        />
                      </div>
                      
                      <div className="col-span-1 mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                          type="text"
                          name="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Black, White, RAL 9005, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Measurements Tab */}
            {activeTab === 'measurements' && (
              <div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
                  <h3 className="text-lg font-medium text-yellow-800 mb-4">Base Dimensions</h3>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width (mm)</label>
                      <input
                        type="number"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (mm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Depth (mm)</label>
                      <input
                        type="number"
                        name="depth"
                        value={formData.depth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thickness (mm)</label>
                      <input
                        type="number"
                        name="thickness"
                        value={formData.thickness}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                
                {showMeasurementFields && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
                    <h3 className="text-lg font-medium text-purple-800 mb-2">Product-Specific Measurements</h3>
                    
                    {formData.measurements.length > 0 ? (
                      <div className="space-y-4">
                        {formData.measurements.map((measurement, index) => (
                          <div key={index} className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-5">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {measurement.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </label>
                              <input
                                type="number"
                                name="value"
                                value={measurement.value}
                                onChange={(e) => handleMeasurementChange(index, e)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                              />
                            </div>
                            
                            <div className="col-span-3">
                              <select
                                name="unit"
                                value={measurement.unit}
                                onChange={(e) => handleMeasurementChange(index, e)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="mm">mm</option>
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                                <option value="inch">inch</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Please select a product type to see specific measurement fields.</p>
                    )}
                  </div>
                )}
                
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h3 className="text-lg font-medium text-indigo-800 mb-4">Special Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Installation Notes</label>
                      <textarea
                        name="installation_notes"
                        value={formData.installation_notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Add any specific installation requirements or notes"
                      ></textarea>
                    </div>
                    
                    <div className="col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        name="special_instructions"
                        value={formData.special_instructions}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Add any special instructions or requirements"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Notes Tab */}
            {activeTab === 'sales_notes' && (
              <div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-6">
                  <h3 className="text-lg font-medium text-orange-800 mb-4">Sales-Specific Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sales Notes</label>
                      <textarea
                        name="sales_notes"
                        value={formData.sales_notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Add any notes specific to the sales process"
                      ></textarea>
                    </div>
                    
                    <div className="col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Specific Requests</label>
                      <textarea
                        name="customer_requests"
                        value={formData.customer_requests}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Note any customer-specific requests or preferences"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                  <h3 className="text-lg font-medium text-green-800 mb-4">Additional Sales Opportunities</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upsell Opportunities</label>
                      <textarea
                        name="upsell_opportunities"
                        value={formData.upsell_opportunities}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Note potential upsell opportunities (premium materials, features, etc.)"
                      ></textarea>
                    </div>
                    
                    <div className="col-span-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cross-Sell Recommendations</label>
                      <textarea
                        name="cross_sell_recommendations"
                        value={formData.cross_sell_recommendations}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Suggest related products or services for cross-selling"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Attachments & Documentation</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF, DWG, DXF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Uploaded Files</h4>
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                      {formData.attachments.map((file, index) => (
                        <li key={index} className="px-4 py-3 flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                attachments: prev.attachments.filter((_, i) => i !== index)
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
              <div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
                  <h3 className="text-lg font-medium text-red-800 mb-4">Approvals & Status</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="pending_approval">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="in_production">In Production</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Revision Number</label>
                      <input
                        type="text"
                        name="revision_number"
                        value={formData.revision_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
                      <input
                        type="text"
                        name="approved_by"
                        value={formData.approved_by}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={formData.status !== 'approved' && formData.status !== 'in_production'}
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approval Date</label>
                      <input
                        type="date"
                        name="approval_date"
                        value={formData.approval_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={formData.status !== 'approved' && formData.status !== 'in_production'}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-6">
                  <h3 className="text-lg font-medium text-orange-800 mb-4">Sales Department Sign-off</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="sales_sign_off"
                            checked={formData.sales_sign_off}
                            onChange={(e) => setFormData(prev => ({...prev, sales_sign_off: e.target.checked}))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Sales Person Sign-off</span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          By checking this box, I confirm these measurements were taken correctly and are accurate.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="sales_manager_approval"
                            checked={formData.sales_manager_approval}
                            onChange={(e) => setFormData(prev => ({...prev, sales_manager_approval: e.target.checked}))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Sales Manager Approval</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional fields for sales arranged in a 2-column grid */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sales Representative</label>
                      <input
                        type="text"
                        name="sales_representative"
                        value={formData.sales_representative || formData.sales_person_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.sales_sign_off}
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sign-off Date</label>
                      <input
                        type="date"
                        name="sales_sign_off_date"
                        value={formData.sales_sign_off_date || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.sales_sign_off}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sales Manager Name</label>
                      <input
                        type="text"
                        name="sales_manager_name"
                        value={formData.sales_manager_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.sales_manager_approval}
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approval Date</label>
                      <input
                        type="date"
                        name="sales_manager_approval_date"
                        value={formData.sales_manager_approval_date || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.sales_manager_approval}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-800 mb-4">Production Department Sign-off</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="production_sign_off"
                            checked={formData.production_sign_off}
                            onChange={(e) => setFormData(prev => ({...prev, production_sign_off: e.target.checked}))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Production Feasibility Sign-off</span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          By checking this box, production confirms these measurements are feasible to manufacture.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="quality_check_sign_off"
                            checked={formData.quality_check_sign_off}
                            onChange={(e) => setFormData(prev => ({...prev, quality_check_sign_off: e.target.checked}))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Quality Check Sign-off</span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          Final quality check of measurement summary.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional fields for production arranged in a 2-column grid */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Production Manager</label>
                      <input
                        type="text"
                        name="production_manager"
                        value={formData.production_manager || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.production_sign_off}
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Production Date</label>
                      <input
                        type="date"
                        name="production_date"
                        value={formData.production_date || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.production_sign_off}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality Inspector</label>
                      <input
                        type="text"
                        name="quality_inspector"
                        value={formData.quality_inspector || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.quality_check_sign_off}
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
                      <input
                        type="date"
                        name="inspection_date"
                        value={formData.inspection_date || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.quality_check_sign_off}
                      />
                    </div>
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
              onClick={() => navigate('/measurement-summaries')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  status: 'draft'
                }));
                handleSubmit(new Event('click'));
              }}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-orange-300 rounded-md text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  status: 'draft',
                  sales_sign_off: true
                }));
                handleSubmit(new Event('click'));
              }}
            >
              Save with Sales Sign-off
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  status: 'pending_approval'
                }));
              }}
            >
              Submit for Approval
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MeasurementSummaries; 