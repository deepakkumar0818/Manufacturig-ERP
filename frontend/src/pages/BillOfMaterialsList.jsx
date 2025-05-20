import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BillOfMaterialsList = () => {
  const navigate = useNavigate();
  const [bomList, setBomList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionItem, setRevisionItem] = useState(null);

  // Generate sample data on component mount
  useEffect(() => {
    setIsLoading(true);
    // In a real implementation, this would be an API call
    const sampleBOMList = [
      {
        id: 'BOM-2024-001',
        product_name: 'Industrial Valve Assembly',
        product_code: 'VA-240',
        revision: 'A',
        status: 'Released',
        created_by: 'John Smith',
        created_date: '2024-05-01',
        related_sales_order: 'SO-002-2024',
        part_count: 16,
        production_lead_time: '10 days',
        last_updated: '2024-05-02'
      },
      {
        id: 'BOM-2024-002',
        product_name: 'Hydraulic Cylinder',
        product_code: 'HC-120',
        revision: 'B',
        status: 'Draft',
        created_by: 'Sarah Johnson',
        created_date: '2024-05-02',
        related_sales_order: 'SO-003-2024',
        part_count: 12,
        production_lead_time: '8 days',
        last_updated: '2024-05-03'
      },
      {
        id: 'BOM-2024-003',
        product_name: 'Control Panel Housing',
        product_code: 'CP-350',
        revision: 'A',
        status: 'Under Review',
        created_by: 'Michael Brown',
        created_date: '2024-05-03',
        related_sales_order: 'SO-001-2024',
        part_count: 24,
        production_lead_time: '14 days',
        last_updated: '2024-05-04'
      },
      {
        id: 'BOM-2024-004',
        product_name: 'Pneumatic Actuator',
        product_code: 'PA-450',
        revision: 'C',
        status: 'Released',
        created_by: 'Jennifer Lee',
        created_date: '2024-05-04',
        related_sales_order: 'SO-004-2024',
        part_count: 18,
        production_lead_time: '12 days',
        last_updated: '2024-05-05'
      },
      {
        id: 'BOM-2024-005',
        product_name: 'Gearbox Assembly',
        product_code: 'GB-550',
        revision: 'A',
        status: 'Obsolete',
        created_by: 'Robert Wilson',
        created_date: '2024-04-15',
        related_sales_order: 'SO-005-2024',
        part_count: 32,
        production_lead_time: '18 days',
        last_updated: '2024-04-20'
      }
    ];

    setTimeout(() => {
      setBomList(sampleBOMList);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter BOM list based on search query and status
  const filteredBOMList = bomList.filter(bom => {
    const matchesSearch = 
      bom.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bom.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bom.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bom.related_sales_order.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bom.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesProduct = productFilter === 'all' || bom.product_code === productFilter;
    
    return matchesSearch && matchesStatus && matchesProduct;
  });

  // Handle creating a new BOM
  const handleCreateNew = () => {
    navigate('/bill-of-materials/new');
  };

  // Handle editing a BOM
  const handleEdit = (id) => {
    navigate(`/bill-of-materials/${id}/edit`);
  };

  // Handle viewing a BOM
  const handleView = (id) => {
    navigate(`/bill-of-materials/${id}`);
  };

  // Handle releasing a BOM
  const handleRelease = () => {
    // In a real implementation, this would be an API call
    const updatedBOMList = bomList.map(bom => {
      if (selectedRecords.includes(bom.id)) {
        return {
          ...bom,
          status: 'Released',
          last_updated: new Date().toISOString().split('T')[0]
        };
      }
      return bom;
    });
    
    setBomList(updatedBOMList);
    setSelectedRecords([]);
    setReleaseNotes('');
    setShowReleaseModal(false);
  };

  // Handle creating a new revision of a BOM
  const handleCreateRevision = () => {
    // Get the BOM to revise
    const bom = bomList.find(b => b.id === revisionItem);
    if (!bom) return;
    
    // Create a new revision by incrementing the letter
    const newRevision = String.fromCharCode(bom.revision.charCodeAt(0) + 1);
    const newBOM = {
      ...bom,
      id: `${bom.id.split('-')[0]}-${bom.id.split('-')[1]}-${String(parseInt(bom.id.split('-')[2]) + 1).padStart(3, '0')}`,
      revision: newRevision,
      status: 'Draft',
      created_date: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0]
    };
    
    setBomList([...bomList, newBOM]);
    setRevisionItem(null);
    setRevisionNotes('');
    setShowRevisionModal(false);
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(filteredBOMList.map(bom => bom.id));
    } else {
      setSelectedRecords([]);
    }
  };

  // Handle individual select checkbox
  const handleSelectRow = (id) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'obsolete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Extract unique products for filtering
  const productOptions = bomList.reduce((options, bom) => {
    if (!options.includes(bom.product_code)) {
      options.push(bom.product_code);
    }
    return options;
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Bill of Materials</h2>
            <p className="text-gray-600 mt-1">Manage product structures and component specifications</p>
          </div>
          <div>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
              <span className="material-icons mr-1">add</span>
              New BOM
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Filter and search tools */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="under review">Under Review</option>
                  <option value="released">Released</option>
                  <option value="obsolete">Obsolete</option>
                </select>
              </div>

              <div>
                <label htmlFor="product-filter" className="block text-sm font-medium text-gray-700">
                  Product:
                </label>
                <select
                  id="product-filter"
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Products</option>
                  {productOptions.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md py-2 pl-3"
                  placeholder="Search by ID, product name or code..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="material-icons text-gray-400">search</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOM Actions */}
          <div className="p-4 flex flex-wrap gap-2">
            <button
              onClick={() => setShowReleaseModal(true)}
              disabled={selectedRecords.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                selectedRecords.length > 0 
                  ? 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' 
                  : 'text-gray-500 bg-gray-200 cursor-not-allowed'
              }`}
            >
              <span className="material-icons mr-1 text-sm">check_circle</span>
              Release Selected
            </button>
          </div>

          {/* BOM List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedRecords.length === filteredBOMList.length && filteredBOMList.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BOM ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rev
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBOMList.map((bom) => (
                  <tr key={bom.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedRecords.includes(bom.id)}
                        onChange={() => handleSelectRow(bom.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {bom.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{bom.product_name}</div>
                      <div className="text-gray-500 text-xs">{bom.product_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.revision}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(bom.status)}`}>
                        {bom.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.related_sales_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.part_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{bom.created_by}</div>
                      <div className="text-xs text-gray-500">{bom.created_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.last_updated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleView(bom.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <span className="material-icons">visibility</span>
                        </button>
                        <button 
                          onClick={() => handleEdit(bom.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button 
                          onClick={() => {
                            setRevisionItem(bom.id);
                            setShowRevisionModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-900"
                          title="Create revision"
                        >
                          <span className="material-icons">history</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBOMList.length === 0 && (
                  <tr>
                    <td colSpan="10" className="px-6 py-10 text-center text-sm text-gray-500">
                      No bill of materials found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Release Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Release Bill of Materials
              </h3>
            </div>
            <div className="p-6">
              <p className="mb-4 text-sm text-gray-600">
                You are about to release {selectedRecords.length} bill of material{selectedRecords.length > 1 ? 's' : ''}.
                This will mark them as approved for production use.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Notes (Optional)
                </label>
                <textarea
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Add any notes about this release..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowReleaseModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={handleRelease}
                >
                  Confirm Release
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Revision
              </h3>
            </div>
            <div className="p-6">
              <p className="mb-4 text-sm text-gray-600">
                You are about to create a new revision of the selected bill of materials.
                This will generate a new version for modifications while preserving the original.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revision Notes (Required)
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Explain the reason for this revision..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setRevisionItem(null);
                    setShowRevisionModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleCreateRevision}
                  disabled={!revisionNotes.trim()}
                >
                  Create Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillOfMaterialsList; 