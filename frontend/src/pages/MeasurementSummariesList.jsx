import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MeasurementSummariesList = () => {
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSummaries, setSelectedSummaries] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  // Mock data for departments/recipients
  const recipients = [
    { id: 'prod1', name: 'Production Department', email: 'production@example.com' },
    { id: 'eng1', name: 'Engineering Team', email: 'engineering@example.com' },
    { id: 'quality1', name: 'Quality Control', email: 'quality@example.com' },
    { id: 'install1', name: 'Installation Team', email: 'installation@example.com' },
    { id: 'manager1', name: 'Sales Manager', email: 'sales.manager@example.com' }
  ];

  // Mock function to fetch measurement summaries
  useEffect(() => {
    // This would be an API call in a real implementation
    setIsLoading(true);
    // Simulating API delay
    setTimeout(() => {
      const mockSummaries = [
        {
          id: 'MS-123456',
          customer_name: 'ABC Corp',
          project_name: 'Office Renovation',
          date_measured: '2023-06-15',
          required_delivery_date: '2023-07-30',
          sales_person_name: 'John Smith',
          product_type: 'Window',
          status: 'pending_approval',
          created_at: '2023-06-15T10:30:00',
          sent_to: ['Production Department', 'Engineering Team']
        },
        {
          id: 'MS-123457',
          customer_name: 'XYZ Industries',
          project_name: 'Factory Installation',
          date_measured: '2023-06-18',
          required_delivery_date: '2023-08-10',
          sales_person_name: 'Sarah Johnson',
          product_type: 'Door',
          status: 'approved',
          created_at: '2023-06-18T14:45:00',
          sent_to: ['Production Department']
        },
        {
          id: 'MS-123458',
          customer_name: 'Acme Co',
          project_name: 'Retail Store Shelving',
          date_measured: '2023-06-20',
          required_delivery_date: '2023-07-25',
          sales_person_name: 'Michael Brown',
          product_type: 'Cabinet',
          status: 'draft',
          created_at: '2023-06-20T09:15:00',
          sent_to: []
        },
        {
          id: 'MS-123459',
          customer_name: 'Global Enterprises',
          project_name: 'Corporate HQ Remodel',
          date_measured: '2023-06-22',
          required_delivery_date: '2023-09-01',
          sales_person_name: 'Emily Davis',
          product_type: 'Window',
          status: 'in_production',
          created_at: '2023-06-22T11:20:00',
          sent_to: ['Production Department', 'Installation Team', 'Quality Control']
        }
      ];
      
      setSummaries(mockSummaries);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handler for selecting a summary (checkbox)
  const handleSelectSummary = (id) => {
    setSelectedSummaries(prev => {
      if (prev.includes(id)) {
        return prev.filter(summaryId => summaryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handler for selecting all summaries
  const handleSelectAll = () => {
    if (selectedSummaries.length === filteredSummaries.length) {
      setSelectedSummaries([]);
    } else {
      setSelectedSummaries(filteredSummaries.map(summary => summary.id));
    }
  };

  // Filter summaries based on status and search query
  const filteredSummaries = summaries.filter(summary => {
    const matchesStatus = filterStatus === 'all' || summary.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      summary.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.sales_person_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Handler for sending summaries
  const handleSendSummaries = () => {
    if (!selectedRecipient) {
      alert('Please select a recipient');
      return;
    }

    // This would be an API call in a real implementation
    console.log(`Sending summaries ${selectedSummaries.join(', ')} to ${selectedRecipient}`);
    
    // Update the sent_to field for selected summaries
    const selectedRecipientObj = recipients.find(r => r.id === selectedRecipient);
    setSummaries(prev => 
      prev.map(summary => {
        if (selectedSummaries.includes(summary.id)) {
          return {
            ...summary,
            sent_to: [...summary.sent_to, selectedRecipientObj.name]
          };
        }
        return summary;
      })
    );
    
    // Close modal and reset selection
    setShowSendModal(false);
    setSelectedSummaries([]);
    setSelectedRecipient('');
    
    // Show success message
    alert(`Measurement summaries have been sent to ${selectedRecipientObj.name}`);
  };

  // Function to get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_production':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format status for display
  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Direct navigation handlers to replace props
  const handleCreateNew = () => {
    navigate('/measurement-summaries/new');
  };

  const handleViewSummary = (id) => {
    navigate(`/measurement-summaries/${id}`);
  };

  const handleEditSummary = (id) => {
    navigate(`/measurement-summaries/${id}/edit`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Measurement Summaries
            </h2>
            <p className="text-gray-600 mt-1">View, send, and manage all measurement summaries</p>
          </div>
          <div>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
              <span className="material-icons mr-1">add</span>
              New Measurement
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
                  Filter Status:
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="in_production">In Production</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search:
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, customer, project..."
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSendModal(true)}
                disabled={selectedSummaries.length === 0}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                  selectedSummaries.length > 0 
                    ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                    : 'text-gray-500 bg-gray-200 cursor-not-allowed'
                }`}
              >
                <span className="material-icons mr-1">send</span>
                Send Selected
              </button>
              <div className="text-sm text-gray-500">
                {selectedSummaries.length} selected
              </div>
            </div>
          </div>

          {/* Table of measurement summaries */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedSummaries.length === filteredSummaries.length && filteredSummaries.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer & Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Person
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent To
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSummaries.length > 0 ? (
                  filteredSummaries.map((summary) => (
                    <tr key={summary.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedSummaries.includes(summary.id)}
                            onChange={() => handleSelectSummary(summary.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{summary.id}</div>
                        <div className="text-sm text-gray-500">{summary.product_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{summary.customer_name}</div>
                        <div className="text-sm text-gray-500">{summary.project_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{summary.sales_person_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Measured: {summary.date_measured}</div>
                        <div className="text-sm text-gray-500">Required: {summary.required_delivery_date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(summary.status)}`}>
                          {formatStatus(summary.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {summary.sent_to.length > 0 ? (
                            summary.sent_to.map((recipient, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {recipient}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500 italic">Not sent yet</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewSummary(summary.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="View details"
                          >
                            <span className="material-icons">visibility</span>
                          </button>
                          <button 
                            onClick={() => handleEditSummary(summary.id)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                            title="Edit measurement"
                          >
                            <span className="material-icons">edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSummaries([summary.id]);
                              setShowSendModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            title="Send to department"
                          >
                            <span className="material-icons">send</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No measurement summaries found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Send Measurement Summaries
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Recipient
                </label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a recipient...</option>
                  {recipients.map(recipient => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Summaries ({selectedSummaries.length})
                </label>
                <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                  {selectedSummaries.map(id => {
                    const summary = summaries.find(s => s.id === id);
                    return (
                      <div key={id} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                        <span className="font-medium">{id}</span>
                        <span className="text-gray-500">{summary?.customer_name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowSendModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleSendSummaries}
                >
                  Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementSummariesList; 