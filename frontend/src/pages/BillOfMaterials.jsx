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
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [bomList, setBomList] = useState([]); // For multi-level BOM selection
  const [expandedComponents, setExpandedComponents] = useState([]);
  
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
    revision_history: [],
    // New fields
    bom_level: 0, // For multi-level BOM (0 = top level)
    is_sub_assembly: false,
    total_cost: 0,
    labor_cost: 0,
    overhead_cost: 0,
    material_cost: 0,
    currency: 'USD',
    alternative_components: []
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
        { id: 1, sku: 'RM-1001', name: 'Steel Sheet 1.5mm', category: 'raw-materials', unit: 'sheets', cost: 45.50, qty_available: 120 },
        { id: 2, sku: 'RM-1023', name: 'Aluminum Sheet 6061-T6', category: 'raw-materials', unit: 'sheets', cost: 65.75, qty_available: 80 },
        { id: 3, sku: 'RM-2045', name: 'Copper Wire 10 AWG', category: 'raw-materials', unit: 'meters', cost: 3.25, qty_available: 500 },
        { id: 4, sku: 'RM-3302', name: 'Stainless Steel Rod 316', category: 'raw-materials', unit: 'pieces', cost: 12.85, qty_available: 250 },
        { id: 5, sku: 'CP-2235', name: 'Bearing Assembly', category: 'components', unit: 'pieces', cost: 18.50, qty_available: 75 },
        { id: 6, sku: 'CP-4565', name: 'Hydraulic Valve 3/4"', category: 'components', unit: 'pieces', cost: 95.25, qty_available: 30 },
        { id: 7, sku: 'CP-4589', name: 'Electric Motor 2HP', category: 'components', unit: 'pieces', cost: 145.00, qty_available: 15 },
        { id: 8, sku: 'CP-8910', name: 'Hydraulic Pump XL-3', category: 'components', unit: 'pieces', cost: 225.75, qty_available: 10 }
      ]),
      
      // Fetch existing BOMs for multi-level configuration
      Promise.resolve([
        { id: 'BOM-2024-102030', product_name: 'Control Panel Assembly', product_code: 'CPA-100', revision: 'B' },
        { id: 'BOM-2024-405060', product_name: 'Hydraulic System Base', product_code: 'HSB-200', revision: 'A' },
        { id: 'BOM-2024-708090', product_name: 'Motor Mount Assembly', product_code: 'MMA-300', revision: 'C' }
      ]),
      
      // Fetch purchase orders for integration
      Promise.resolve([
        { id: 'PO-2024-001', supplier: 'Metal Supplies Inc.', status: 'Open', date: '2024-05-01' },
        { id: 'PO-2024-002', supplier: 'Industrial Components Ltd.', status: 'Ordered', date: '2024-04-28' },
        { id: 'PO-2024-003', supplier: 'Electrical Parts Co.', status: 'Received', date: '2024-04-15' }
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
              { 
                id: 1, 
                item_sku: 'CP-4565', 
                item_name: 'Hydraulic Valve 3/4"', 
                quantity: 1, 
                unit: 'pieces', 
                type: 'component', 
                notes: 'Main valve body',
                cost: 95.25,
                level: 0,
                is_assembly: false,
                lead_time: '5 days'
              },
              { 
                id: 2, 
                item_sku: 'RM-3302', 
                item_name: 'Stainless Steel Rod 316', 
                quantity: 2, 
                unit: 'pieces', 
                type: 'raw-material', 
                notes: 'For valve stem',
                cost: 12.85,
                level: 0,
                is_assembly: false,
                lead_time: '2 days'
              },
              { 
                id: 3, 
                item_sku: 'CP-2235', 
                item_name: 'Bearing Assembly', 
                quantity: 4, 
                unit: 'pieces', 
                type: 'component', 
                notes: 'Valve seat bearings',
                cost: 18.50,
                level: 0,
                is_assembly: false,
                lead_time: '3 days'
              }
            ],
            assembly_instructions: 'Assemble valve body first, then attach stems and bearings...',
            quality_requirements: 'Pressure test to 150 PSI after assembly',
            production_lead_time: '10 days',
            required_tools: ['Torque wrench', 'Calibration tools', 'Pressure testing equipment'],
            approved_by: '',
            approved_date: '',
            revision_history: [],
            bom_level: 0,
            is_sub_assembly: false,
            total_cost: 189.85,
            labor_cost: 45.00,
            overhead_cost: 28.50,
            material_cost: 116.35,
            currency: 'USD',
            alternative_components: [
              {
                original_component_id: 3,
                alternatives: [
                  { item_sku: 'CP-2236', item_name: 'Premium Bearing Assembly', cost: 28.75, notes: 'Higher quality alternative' }
                ]
              }
            ]
          })
        : Promise.resolve(null)
    ])
    .then(([ordersData, itemsData, bomsData, poData, bomData]) => {
      setSalesOrders(ordersData);
      setInventoryItems(itemsData);
      setBomList(bomsData);
      setPurchaseOrders(poData);
      
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

  // Handle number input changes
  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
    
    // Recalculate total cost if cost components change
    if(['labor_cost', 'overhead_cost', 'material_cost'].includes(name)) {
      calculateTotalCost();
    }
  };

  // Calculate the total cost based on components and other costs
  const calculateTotalCost = () => {
    setFormData(prev => {
      // Calculate material cost from components if not manually set
      const componentCost = prev.components.reduce((sum, component) => {
        return sum + (component.cost * component.quantity);
      }, 0);
      
      const materialCost = prev.material_cost || componentCost;
      const total = materialCost + prev.labor_cost + prev.overhead_cost;
      
      return {
        ...prev,
        material_cost: materialCost,
        total_cost: total
      };
    });
  };

  // Handle component list changes
  const handleComponentChange = (index, field, value) => {
    setFormData(prev => {
      const updatedComponents = [...prev.components];
      updatedComponents[index] = {
        ...updatedComponents[index],
        [field]: value
      };
      
      // If we changed the item_sku, update the item_name and cost
      if (field === 'item_sku') {
        const selectedItem = inventoryItems.find(item => item.sku === value);
        if (selectedItem) {
          updatedComponents[index].item_name = selectedItem.name;
          updatedComponents[index].unit = selectedItem.unit;
          updatedComponents[index].type = selectedItem.category;
          updatedComponents[index].cost = selectedItem.cost;
          updatedComponents[index].qty_available = selectedItem.qty_available;
        }
      }
      
      // If we changed quantity or cost, recalculate
      if (field === 'quantity' || field === 'cost') {
        // Recalculate in next tick to ensure state is updated
        setTimeout(() => calculateTotalCost(), 0);
      }
      
      return {
        ...prev,
        components: updatedComponents
      };
    });
  };

  // Add a new component to the list
  const handleAddComponent = (isSubAssembly = false) => {
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
          type: isSubAssembly ? 'sub-assembly' : 'component',
          notes: '',
          cost: 0,
          level: 0,
          is_assembly: isSubAssembly,
          lead_time: '',
          bom_id: isSubAssembly ? '' : null, // Reference to another BOM if this is a sub-assembly
          children: [] // For sub-assemblies
        }
      ]
    }));
  };

  // Toggle the expanded state of a component (for multi-level view)
  const toggleComponentExpanded = (componentId) => {
    setExpandedComponents(prev => {
      if (prev.includes(componentId)) {
        return prev.filter(id => id !== componentId);
      } else {
        return [...prev, componentId];
      }
    });
  };

  // Add a sub-component to a component (for multi-level BOM)
  const handleAddSubComponent = (parentIndex) => {
    setFormData(prev => {
      const updatedComponents = [...prev.components];
      if (!updatedComponents[parentIndex].children) {
        updatedComponents[parentIndex].children = [];
      }
      
      updatedComponents[parentIndex].children.push({
        id: Date.now(), // Unique ID
        item_sku: '',
        item_name: '',
        quantity: 1,
        unit: 'pieces',
        type: 'component',
        notes: '',
        cost: 0,
        level: updatedComponents[parentIndex].level + 1,
        is_assembly: false,
        lead_time: ''
      });
      
      return {
        ...prev,
        components: updatedComponents
      };
    });
  };

  // Remove a component from the list
  const handleRemoveComponent = (index) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index)
    }));
    
    // Recalculate total cost
    setTimeout(() => calculateTotalCost(), 0);
  };

  // Add an alternative component
  const handleAddAlternative = (originalComponentIndex) => {
    setFormData(prev => {
      const originalComponent = prev.components[originalComponentIndex];
      const alternativeExists = prev.alternative_components.find(
        alt => alt.original_component_id === originalComponent.id
      );
      
      if (alternativeExists) {
        // Add to existing alternatives
        const updatedAlternatives = prev.alternative_components.map(alt => {
          if (alt.original_component_id === originalComponent.id) {
            return {
              ...alt,
              alternatives: [
                ...alt.alternatives,
                { 
                  item_sku: '',
                  item_name: '',
                  cost: 0,
                  notes: 'Alternative component' 
                }
              ]
            };
          }
          return alt;
        });
        
        return {
          ...prev,
          alternative_components: updatedAlternatives
        };
      } else {
        // Create new alternative entry
        return {
          ...prev,
          alternative_components: [
            ...prev.alternative_components,
            {
              original_component_id: originalComponent.id,
              alternatives: [
                { 
                  item_sku: '',
                  item_name: '',
                  cost: 0,
                  notes: 'Alternative component'
                }
              ]
            }
          ]
        };
      }
    });
  };

  // Update an alternative component
  const handleAlternativeChange = (originalComponentId, alternativeIndex, field, value) => {
    setFormData(prev => {
      const updatedAlternatives = prev.alternative_components.map(alt => {
        if (alt.original_component_id === originalComponentId) {
          const updatedAltList = [...alt.alternatives];
          updatedAltList[alternativeIndex] = {
            ...updatedAltList[alternativeIndex],
            [field]: value
          };
          
          // If changing SKU, update name and cost from inventory
          if (field === 'item_sku') {
            const selectedItem = inventoryItems.find(item => item.sku === value);
            if (selectedItem) {
              updatedAltList[alternativeIndex].item_name = selectedItem.name;
              updatedAltList[alternativeIndex].cost = selectedItem.cost;
            }
          }
          
          return {
            ...alt,
            alternatives: updatedAltList
          };
        }
        return alt;
      });
      
      return {
        ...prev,
        alternative_components: updatedAlternatives
      };
    });
  };
  
  // Remove an alternative component
  const handleRemoveAlternative = (originalComponentId, alternativeIndex) => {
    setFormData(prev => {
      const updatedAlternatives = prev.alternative_components.map(alt => {
        if (alt.original_component_id === originalComponentId) {
          return {
            ...alt,
            alternatives: alt.alternatives.filter((_, idx) => idx !== alternativeIndex)
          };
        }
        return alt;
      }).filter(alt => alt.alternatives.length > 0);
      
      return {
        ...prev,
        alternative_components: updatedAlternatives
      };
    });
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

  // Handle creating a new revision
  const handleNewRevision = () => {
    const currentRevision = formData.revision;
    let nextRevision;
    
    // Simple revision progression (A -> B -> C...)
    if (currentRevision.length === 1 && currentRevision >= 'A' && currentRevision <= 'Z') {
      const charCode = currentRevision.charCodeAt(0);
      nextRevision = String.fromCharCode(charCode + 1);
    } else if (currentRevision.match(/^\d+$/)) {
      // If numeric, increment
      nextRevision = (parseInt(currentRevision) + 1).toString();
    } else {
      // For complex revisions, just append .1
      nextRevision = `${currentRevision}.1`;
    }
    
    // Add current version to revision history
    const revisionHistoryEntry = {
      revision: currentRevision,
      date: formData.last_updated,
      by: formData.created_by,
      notes: `Revised to ${nextRevision}`,
    };
    
    // Update form data with new revision
    setFormData(prev => ({
      ...prev,
      revision: nextRevision,
      revision_history: [...prev.revision_history, revisionHistoryEntry]
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
    
    // Validation for multi-level BOMs
    const subAssemblies = formData.components.filter(c => c.is_assembly);
    for (const subAssembly of subAssemblies) {
      if (!subAssembly.bom_id && !subAssembly.item_name) {
        alert('Please select a BOM reference for all sub-assemblies');
        return;
      }
    }
    
    // Ensure total cost is calculated
    calculateTotalCost();
    
    setIsLoading(true);
    
    // Update the last updated date
    const updatedFormData = {
      ...formData,
      last_updated: new Date().toISOString().split('T')[0]
    };
    
    // If status is changing to Released and there's no approval info, add it
    if (updatedFormData.status === 'Released' && !updatedFormData.approved_by) {
      updatedFormData.approved_by = updatedFormData.created_by;
      updatedFormData.approved_date = updatedFormData.last_updated;
    }
    
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
            {isEditMode && formData.status !== 'Obsolete' && (
              <button
                type="button"
                onClick={handleNewRevision}
                className="mt-2 inline-flex items-center px-2 py-1 border border-blue-300 text-xs rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                <span className="material-icons text-blue-500 mr-1" style={{ fontSize: '14px' }}>update</span>
                Create New Revision
              </button>
            )}
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
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'alternatives' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('alternatives')}
              >
                Alternatives
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${activeTab === 'costing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('costing')}
              >
                Costing
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
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Components & Materials</h3>
                      <p className="text-sm text-gray-600 mt-1">Define all components, sub-assemblies and raw materials required for this product</p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => handleAddComponent(false)}
                        className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <span className="material-icons text-blue-500 mr-2">add_circle</span>
                        Add Component
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddComponent(true)}
                        className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <span className="material-icons text-green-500 mr-2">account_tree</span>
                        Add Sub-Assembly
                      </button>
                    </div>
                  </div>
                  
                  {formData.components.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <span className="material-icons text-gray-400" style={{ fontSize: '32px' }}>inventory_2</span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No Components Added</h4>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Add components, sub-assemblies, or raw materials to create your bill of materials structure.
                      </p>
                      <div className="flex justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleAddComponent(false)}
                          className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <span className="material-icons text-blue-500 mr-2">add_circle</span>
                          Add Component
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddComponent(true)}
                          className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <span className="material-icons text-green-500 mr-2">account_tree</span>
                          Add Sub-Assembly
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
                      <div className="overflow-x-auto" style={{ maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                          <thead>
                            <tr className="bg-gray-50">
                              <th scope="col" className="w-10 px-1 py-3 text-center"></th>
                              <th scope="col" className="w-14 px-1 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                              <th scope="col" className="w-52 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                              <th scope="col" className="w-52 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                              <th scope="col" className="w-16 px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                              <th scope="col" className="w-16 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                              <th scope="col" className="w-28 px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                              <th scope="col" className="w-24 px-2 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                              <th scope="col" className="w-28 px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory</th>
                              <th scope="col" className="w-32 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Time</th>
                              <th scope="col" className="w-40 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Notes</th>
                              <th scope="col" className="w-24 px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {formData.components.map((component, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                                <td className="px-1 text-center">
                                  {component.is_assembly && (
                                    <button
                                      type="button"
                                      onClick={() => toggleComponentExpanded(component.id)}
                                      className="text-gray-500 hover:text-blue-600 focus:outline-none"
                                    >
                                      <span className="material-icons text-gray-400 hover:text-blue-500">
                                        {expandedComponents.includes(component.id) ? 'expand_more' : 'chevron_right'}
                                      </span>
                                    </button>
                                  )}
                                </td>
                                <td className="px-1 py-2 whitespace-nowrap text-sm font-medium text-gray-700 text-center">
                                  {component.level || 0}
                                </td>
                                <td className="px-2 py-2 text-sm">
                                  {component.is_assembly ? (
                                    <div className="relative">
                                      <select
                                        value={component.bom_id || ''}
                                        onChange={(e) => handleComponentChange(index, 'bom_id', e.target.value)}
                                        className="block w-full pl-2 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                        style={{
                                          WebkitAppearance: "none",
                                          MozAppearance: "none",
                                          appearance: "none"
                                        }}
                                      >
                                        <option value="">Select Sub-Assembly</option>
                                        {bomList.map(bom => (
                                          <option key={bom.id} value={bom.id}>
                                            {bom.product_code} - {bom.product_name}
                                          </option>
                                        ))}
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <span className="material-icons text-gray-400 text-sm">arrow_drop_down</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="relative inline-block w-full">
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          // Toggle dropdown visibility
                                          const dropdown = e.currentTarget.nextElementSibling;
                                          dropdown.classList.toggle('hidden');
                                          // Add click outside listener
                                          const closeDropdown = () => {
                                            dropdown.classList.add('hidden');
                                            document.removeEventListener('click', closeDropdown);
                                          };
                                          setTimeout(() => {
                                            document.addEventListener('click', closeDropdown);
                                          }, 100);
                                        }}
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex items-center"
                                      >
                                        {component.item_sku ? (
                                          <div className="flex items-center truncate">
                                            <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                              <span className="material-icons text-blue-600 text-xs">inventory</span>
                                            </div>
                                            <div className="truncate">
                                              <span className="font-medium">{component.item_sku}</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex items-center text-gray-500">
                                            <div className="h-5 w-5 bg-gray-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                              <span className="material-icons text-gray-400 text-xs">search</span>
                                            </div>
                                            <span>Select Item</span>
                                          </div>
                                        )}
                                        <span className="material-icons text-gray-400 text-sm ml-auto">arrow_drop_down</span>
                                      </button>
                                      
                                      <div className="hidden absolute z-20 mt-1 w-72 bg-white rounded-md shadow-lg border border-gray-200 left-0">
                                        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
                                          <div className="flex items-center bg-gray-50 rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                            <span className="material-icons text-gray-400 ml-2 text-sm">search</span>
                                            <input 
                                              type="text" 
                                              className="block w-full py-1.5 pl-2 pr-3 text-sm bg-gray-50 border-0 focus:outline-none focus:ring-0"
                                              placeholder="Search items..."
                                              onClick={e => e.stopPropagation()}
                                              onChange={e => {
                                                // Filter items by search term (in a real app)
                                                // For demo purposes, we'll just prevent closing on click
                                                e.stopPropagation();
                                              }}
                                            />
                                          </div>
                                        </div>
                                        
                                        <div className="max-h-60 overflow-y-auto py-1">
                                          <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                                            COMPONENTS
                                          </div>
                                          {inventoryItems
                                            .filter(item => item.category === 'components')
                                            .map(item => (
                                            <div
                                              key={item.id}
                                              className={`flex items-center px-3 py-2 cursor-pointer ${
                                                component.item_sku === item.sku ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                                              }`}
                                              onClick={() => {
                                                handleComponentChange(index, 'item_sku', item.sku);
                                              }}
                                            >
                                              <div className="mr-3 h-6 w-6 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-blue-500 text-sm">category</span>
                                              </div>
                                              <div className="overflow-hidden">
                                                <div className="font-medium truncate">{item.sku}</div>
                                                <div className="text-xs text-gray-500 truncate">{item.name}</div>
                                              </div>
                                              <div className="ml-auto text-xs text-gray-500 flex-shrink-0">
                                                {item.cost} {formData.currency}
                                              </div>
                                            </div>
                                          ))}
                                          
                                          <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 mt-1">
                                            RAW MATERIALS
                                          </div>
                                          {inventoryItems
                                            .filter(item => item.category === 'raw-materials')
                                            .map(item => (
                                            <div
                                              key={item.id}
                                              className={`flex items-center px-3 py-2 cursor-pointer ${
                                                component.item_sku === item.sku ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                                              }`}
                                              onClick={() => {
                                                handleComponentChange(index, 'item_sku', item.sku);
                                              }}
                                            >
                                              <div className="mr-3 h-6 w-6 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-yellow-600 text-sm">grid_4x4</span>
                                              </div>
                                              <div className="overflow-hidden">
                                                <div className="font-medium truncate">{item.sku}</div>
                                                <div className="text-xs text-gray-500 truncate">{item.name}</div>
                                              </div>
                                              <div className="ml-auto text-xs text-gray-500 flex-shrink-0">
                                                {item.cost} {formData.currency}
                                              </div>
                                            </div>
                                          ))}
                                          
                                          {inventoryItems.length === 0 && (
                                            <div className="px-3 py-3 text-sm text-gray-500 text-center">
                                              No items available
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="border-t border-gray-100 py-2 px-3 flex justify-between bg-gray-50">
                                          <div className="text-xs text-gray-500">
                                            {inventoryItems.length} items available
                                          </div>
                                          <button 
                                            type="button"
                                            className="text-xs text-blue-600 hover:underline"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Close dropdown
                                              e.currentTarget.closest('.relative').querySelector('div[class*="absolute"]').classList.add('hidden');
                                            }}
                                          >
                                            Close
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td className="px-2 py-2 text-sm text-gray-800 font-medium truncate max-w-[120px]" title={component.item_name || (component.is_assembly ? 'Sub-Assembly' : '-')}>
                                  {component.item_name || (component.is_assembly ? 'Sub-Assembly' : '-')}
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                  <input
                                    type="number"
                                    min="1"
                                    value={component.quantity}
                                    onChange={(e) => handleComponentChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                    className="block w-full text-center py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                  />
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                                  {component.unit}
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-center">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    component.type === 'raw-materials' 
                                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                                      : component.type === 'sub-assembly'
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                                  }`}>
                                    {component.type === 'raw-materials' 
                                      ? 'Raw Material' 
                                      : component.type === 'sub-assembly'
                                        ? 'Sub-Assembly'
                                        : 'Component'}
                                  </span>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-sm">
                                  <div className="flex items-center justify-end">
                                    <span className="text-gray-500 font-medium mr-1">{formData.currency}</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={component.cost || 0}
                                      onChange={(e) => handleComponentChange(index, 'cost', parseFloat(e.target.value) || 0)}
                                      className="block w-16 text-right py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                    />
                                  </div>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-sm text-center">
                                  <div className={`font-medium flex items-center justify-center ${
                                    component.qty_available > component.quantity * 2
                                      ? 'text-green-600'
                                      : component.qty_available >= component.quantity
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                  }`}>
                                    {component.qty_available !== undefined ? (
                                      <>
                                        <span className={`material-icons mr-1 text-sm ${
                                          component.qty_available > component.quantity * 2
                                            ? 'text-green-500'
                                            : component.qty_available >= component.quantity
                                              ? 'text-yellow-500'
                                              : 'text-red-500'
                                        }`}>
                                          {component.qty_available > component.quantity * 2
                                            ? 'check_circle'
                                            : component.qty_available >= component.quantity
                                              ? 'warning'
                                              : 'error'}
                                        </span>
                                        <span>
                                          {component.qty_available}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-gray-400">N/A</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={component.lead_time || ''}
                                    onChange={(e) => handleComponentChange(index, 'lead_time', e.target.value)}
                                    placeholder="5 days"
                                    className="block w-full py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                  />
                                </td>
                                <td className="px-2 py-2 text-sm">
                                  <input
                                    type="text"
                                    value={component.notes}
                                    onChange={(e) => handleComponentChange(index, 'notes', e.target.value)}
                                    className="block w-full py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                    placeholder="Notes"
                                  />
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-sm text-right">
                                  <div className="flex justify-center space-x-1">
                                    {component.is_assembly && (
                                      <button
                                        type="button"
                                        onClick={() => handleAddSubComponent(index)}
                                        className="text-gray-500 hover:text-green-600 focus:outline-none"
                                        title="Add Sub-Component"
                                      >
                                        <span className="material-icons bg-gray-100 hover:bg-green-100 p-1 rounded-md transition-colors text-sm">add_box</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleAddAlternative(index)}
                                      className="text-gray-500 hover:text-blue-600 focus:outline-none"
                                      title="Add Alternative"
                                    >
                                      <span className="material-icons bg-gray-100 hover:bg-blue-100 p-1 rounded-md transition-colors text-sm">shuffle</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveComponent(index)}
                                      className="text-gray-500 hover:text-red-600 focus:outline-none"
                                      title="Remove Item"
                                    >
                                      <span className="material-icons bg-gray-100 hover:bg-red-100 p-1 rounded-md transition-colors text-sm">delete</span>
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
                  
                  {formData.components.length > 0 && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2">info</span>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Total Items: {formData.components.length}</div>
                            <div className="text-xs text-gray-500">
                              {formData.components.filter(c => c.type === 'component').length} Components, 
                              {formData.components.filter(c => c.type === 'raw-materials').length} Raw Materials,
                              {formData.components.filter(c => c.type === 'sub-assembly').length} Sub-Assemblies
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="material-icons text-green-500 mr-2">paid</span>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Material Cost Total</div>
                            <div className="text-base font-semibold text-green-600">{formData.currency} {formData.material_cost.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => calculateTotalCost()}
                          >
                            <span className="material-icons text-blue-500 mr-1">refresh</span>
                            Update Costs
                          </button>
                          <button
                            type="button"
                            className="ml-3 inline-flex items-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <span className="material-icons text-blue-500 mr-1">file_download</span>
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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

            {/* Alternatives Tab */}
            {activeTab === 'alternatives' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Alternative Materials Management</h3>
                    <div className="text-sm text-gray-600">
                      Alternative components can be used as substitutes when primary components are unavailable
                    </div>
                  </div>
                  
                  {formData.alternative_components.length > 0 ? (
                    <div className="space-y-6">
                      {formData.alternative_components.map((altGroup, groupIndex) => {
                        // Find the original component
                        const originalComponent = formData.components.find(comp => comp.id === altGroup.original_component_id);
                        if (!originalComponent) return null;
                        
                        return (
                          <div key={groupIndex} className="border rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-blue-50 px-4 py-3 border-b">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-blue-800">
                                  Alternatives for: {originalComponent.item_name} ({originalComponent.item_sku})
                                </h4>
                                <span className="text-sm text-blue-600">
                                  Original Cost: {formData.currency} {originalComponent.cost.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost Diff.</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {altGroup.alternatives.map((alt, altIndex) => (
                                  <tr key={altIndex}>
                                    <td className="px-4 py-3 text-sm">
                                      <select
                                        value={alt.item_sku}
                                        onChange={(e) => handleAlternativeChange(altGroup.original_component_id, altIndex, 'item_sku', e.target.value)}
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
                                      {alt.item_name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      <div className="flex items-center">
                                        <span className="mr-1">{formData.currency}</span>
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={alt.cost || 0}
                                          onChange={(e) => handleAlternativeChange(altGroup.original_component_id, altIndex, 'cost', parseFloat(e.target.value) || 0)}
                                          className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      <span className={`font-medium ${
                                        (alt.cost - originalComponent.cost) < 0 
                                          ? 'text-green-600' 
                                          : (alt.cost - originalComponent.cost) > 0
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                      }`}>
                                        {formData.currency} {((alt.cost || 0) - originalComponent.cost).toFixed(2)}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      <input
                                        type="text"
                                        value={alt.notes || ''}
                                        onChange={(e) => handleAlternativeChange(altGroup.original_component_id, altIndex, 'notes', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Notes about this alternative"
                                      />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveAlternative(altGroup.original_component_id, altIndex)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <span className="material-icons">delete</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
                      <div className="text-gray-500 mb-3">No alternative components defined yet</div>
                      <p className="text-sm text-gray-600 mb-4">
                        Define alternative components that can be used as substitutes when primary components are unavailable or to provide options during production.
                      </p>
                      <p className="text-sm text-gray-600">
                        You can add alternatives from the Components tab by clicking the <span className="material-icons align-bottom text-blue-600">shuffle</span> icon next to any component.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Costing Tab */}
            {activeTab === 'costing' && (
              <div>
                <div className="mb-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Cost Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Calculate and analyze the cost structure of this bill of materials
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-4">Cost Components</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Currency
                            </label>
                            <select
                              name="currency"
                              value={formData.currency}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="JPY">JPY (¥)</option>
                              <option value="CAD">CAD ($)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Material Cost
                            </label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  {formData.currency === 'USD' ? '$' : 
                                   formData.currency === 'EUR' ? '€' :
                                   formData.currency === 'GBP' ? '£' :
                                   formData.currency === 'JPY' ? '¥' : '$'}
                                </span>
                              </div>
                              <input
                                type="number"
                                name="material_cost"
                                min="0"
                                step="0.01"
                                value={formData.material_cost || 0}
                                onChange={handleNumberInputChange}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Sum of all component costs (calculated automatically)
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Labor Cost
                            </label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  {formData.currency === 'USD' ? '$' : 
                                   formData.currency === 'EUR' ? '€' :
                                   formData.currency === 'GBP' ? '£' :
                                   formData.currency === 'JPY' ? '¥' : '$'}
                                </span>
                              </div>
                              <input
                                type="number"
                                name="labor_cost"
                                min="0"
                                step="0.01"
                                value={formData.labor_cost || 0}
                                onChange={handleNumberInputChange}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Overhead Cost
                            </label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  {formData.currency === 'USD' ? '$' : 
                                   formData.currency === 'EUR' ? '€' :
                                   formData.currency === 'GBP' ? '£' :
                                   formData.currency === 'JPY' ? '¥' : '$'}
                                </span>
                              </div>
                              <input
                                type="number"
                                name="overhead_cost"
                                min="0"
                                step="0.01"
                                value={formData.overhead_cost || 0}
                                onChange={handleNumberInputChange}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100 h-full">
                        <h4 className="font-medium text-green-800 mb-4">Cost Summary</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Material Cost:</span>
                            <span className="font-medium">{formData.currency} {formData.material_cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Labor Cost:</span>
                            <span className="font-medium">{formData.currency} {formData.labor_cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Overhead Cost:</span>
                            <span className="font-medium">{formData.currency} {formData.overhead_cost.toFixed(2)}</span>
                          </div>
                          
                          <div className="border-t border-green-200 pt-3 mt-3">
                            <div className="flex justify-between items-center font-medium">
                              <span className="text-gray-800">Total Cost:</span>
                              <span className="text-lg text-green-700">{formData.currency} {formData.total_cost.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          {/* Cost breakdown in percentages */}
                          <div className="mt-6 pt-4 border-t border-green-200">
                            <h5 className="text-sm font-medium text-green-800 mb-3">Cost Breakdown</h5>
                            
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block text-blue-600">
                                    Material ({((formData.material_cost / formData.total_cost) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                <div style={{ width: `${(formData.material_cost / formData.total_cost) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                              </div>
                              
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block text-purple-600">
                                    Labor ({((formData.labor_cost / formData.total_cost) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                                <div style={{ width: `${(formData.labor_cost / formData.total_cost) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                              </div>
                              
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block text-yellow-600">
                                    Overhead ({((formData.overhead_cost / formData.total_cost) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                                <div style={{ width: `${(formData.overhead_cost / formData.total_cost) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h4 className="font-medium text-orange-800 mb-4">Inventory & Purchasing</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Inventory Status</h5>
                            <div className="bg-white p-3 rounded border border-gray-200">
                              {formData.components.map((component, index) => (
                                <div key={index} className="flex justify-between items-center text-sm mb-2">
                                  <span className="truncate max-w-[60%]">{component.item_name}</span>
                                  <span className={`font-medium ${
                                    component.qty_available > component.quantity * 2
                                      ? 'text-green-600'
                                      : component.qty_available >= component.quantity
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                  }`}>
                                    {component.qty_available !== undefined 
                                      ? component.qty_available < component.quantity 
                                        ? `${component.qty_available}/${component.quantity} (Shortage)`
                                        : `${component.qty_available}/${component.quantity} (Available)`
                                      : 'N/A'}
                                  </span>
                                </div>
                              ))}
                              
                              {formData.components.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No components added yet</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Related Purchase Orders</h5>
                            {purchaseOrders.length > 0 ? (
                              <div className="space-y-2">
                                {purchaseOrders.map(po => (
                                  <div key={po.id} className="bg-white p-2 rounded border border-gray-200 flex justify-between items-center">
                                    <div>
                                      <div className="text-sm font-medium">{po.id}</div>
                                      <div className="text-xs text-gray-500">{po.supplier} - {po.date}</div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      po.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                                      po.status === 'Ordered' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {po.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-500 italic">
                                No related purchase orders
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-2">
                            <button
                              type="button"
                              className="w-full inline-flex justify-center items-center px-4 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                              <span className="material-icons text-orange-500 mr-1">shopping_cart</span>
                              Generate Purchase Requisition
                            </button>
                          </div>
                        </div>
                      </div>
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
            {formData.status !== 'Released' && (
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
            )}
            {formData.status === 'Under Review' && (
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    status: 'Released',
                    approved_by: prev.created_by,
                    approved_date: new Date().toISOString().split('T')[0]
                  }));
                  handleSubmit(new Event('click'));
                }}
              >
                Approve & Release
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default BillOfMaterials; 