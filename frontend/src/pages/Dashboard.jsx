/* eslint-disable */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
/* eslint-enable */

const Dashboard = () => {
  // State for real-time data
  const [enquiryStats, setEnquiryStats] = useState([
    { status: 'Open', count: 0, color: 'bg-blue-500' },
    { status: 'Quoted', count: 0, color: 'bg-green-500' },
    { status: 'Converted', count: 0, color: 'bg-yellow-500' },
    { status: 'Closed', count: 0, color: 'bg-red-500' },
  ]);
  
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Fetch enquiry data on component mount
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/enquiries');
        const enquiries = response.data;
        
        // Calculate stats
        const statsCounts = {
          'Open': 0,
          'Quoted': 0,
          'Converted': 0,
          'Closed': 0
        };
        
        // Count enquiries by status
        enquiries.forEach(enquiry => {
          if (statsCounts[enquiry.status] !== undefined) {
            statsCounts[enquiry.status]++;
          } else {
            // Default to Open if status is not recognized
            statsCounts['Open']++;
          }
        });
        
        // Update state with real data
        setEnquiryStats([
          { status: 'Open', count: statsCounts['Open'], color: 'bg-blue-500' },
          { status: 'Quoted', count: statsCounts['Quoted'], color: 'bg-green-500' },
          { status: 'Converted', count: statsCounts['Converted'], color: 'bg-yellow-500' },
          { status: 'Closed', count: statsCounts['Closed'], color: 'bg-red-500' },
        ]);
        
        setTotalEnquiries(enquiries.length);
      } catch (error) {
        console.error('Error fetching enquiry data:', error);
        // Keep existing dummy data on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnquiries();
  }, []);
  
  // Calculate percentages for pie chart segments
  const calculatePercentage = (count) => {
    if (totalEnquiries === 0) return 0;
    return (count / totalEnquiries) * 100;
  };
  
  const calculateDashArray = (count) => {
    if (totalEnquiries === 0) return "0 251.2";
    const percentage = calculatePercentage(count);
    const dashLength = (percentage / 100) * 251.2;
    return `${dashLength} 251.2`;
  };

  // Add animation keyframes at the top of the component
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    @keyframes simpleAppear {
      0% { opacity: 0; stroke-width: 0; }
      100% { opacity: 1; stroke-width: 20; }
    }
    
    .pie-segment {
      animation: simpleAppear 0.8s cubic-bezier(0.26, 0.86, 0.44, 0.98) forwards;
      transition: stroke-width 0.3s ease, opacity 0.3s ease;
    }
    
    .pie-container:hover .pie-segment {
      opacity: 0.7;
    }
    
    .pie-container:hover .segment-1:hover {
      stroke-width: 23;
      opacity: 1;
    }
    
    .pie-container:hover .segment-2:hover {
      stroke-width: 23;
      opacity: 1;
    }
    
    .pie-container:hover .segment-3:hover {
      stroke-width: 23;
      opacity: 1;
    }
    
    .pie-container:hover .segment-4:hover {
      stroke-width: 23;
      opacity: 1;
    }
    
    .segment-1 { animation-delay: 0s; }
    .segment-2 { animation-delay: 0.2s; }
    .segment-3 { animation-delay: 0.4s; }
    .segment-4 { animation-delay: 0.6s; }
    
    @keyframes scaleX {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
    
    .progress-bar {
      animation: scaleX 1.2s ease-out forwards;
      transform-origin: left;
    }
    
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.3s; }
    .delay-3 { animation-delay: 0.5s; }
  `;

  // Update the stats with real enquiry data
  const stats = [
    { id: 1, title: 'Enquiries', count: totalEnquiries, icon: 'mail', color: 'bg-blue-500', path: '/enquiries' },
    { id: 2, title: 'Quotations', count: 8, icon: 'description', color: 'bg-green-500', path: '/quotation' },
    { id: 3, title: 'Sales Orders', count: 15, icon: 'shopping_cart', color: 'bg-yellow-500', path: '/sales-orders' },
    { id: 4, title: 'Job Orders', count: 5, icon: 'engineering', color: 'bg-red-500', path: '/job-order' },
  ];

  const recentQuotations = [
    { id: 'ABC C023', customer: 'ABC Corp', date: '04/23/2024', status: 'Approved' },
    { id: 'XYZ Ltd', customer: 'XYZ Ltd', date: '04/22/2024', status: 'Approved' },
    { id: 'DEF Industries', customer: 'DEF Indurid', date: '04/21/2024', status: 'Pending' },
    { id: 'LMN Co', customer: 'LMN Co', date: '04/20/2024', status: 'Pending' },
  ];

  const salesOrders = {
    confirmed: { count: 18, percent: 45 },
    pending: { count: 14, percent: 35 },
    cancelled: { count: 8, percent: 20 },
    total: 40
  };

  const jobOrders = {
    inProgress: { count: 11, percent: 55 },
    completed: { count: 6, percent: 30 },
    onHold: { count: 3, percent: 15 },
    total: 20
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Pending':
        return status === 'Pending' && new Date().getDate() % 2 === 0 
          ? 'bg-green-500 text-white' 
          : 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <style>{animationStyles}</style>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link to={stat.path} key={stat.id} className="block">
            <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white mr-4 transition-transform duration-500 hover:rotate-12`}>
                  <span className="material-icons">{stat.icon}</span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                  <p className="text-3xl font-bold">{loading && stat.id === 1 ? '...' : stat.count}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div className="flex flex-col lg:flex-row gap-6" style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Enquiries by Status */}
        <div className="flex-none" style={{ width: '220px' }}>
          <div className="bg-white rounded-lg shadow overflow-hidden h-full">
            <div className="p-3 h-full flex flex-col">
              <h3 className="text-sm font-medium mb-2 text-center">Enquiries by Status</h3>
              
              <div className="flex justify-center my-3">
                <div className="relative w-28 h-28">
                  {/* Chart Circle */}
                  <div className="w-28 h-28 rounded-full border-2 border-transparent bg-gray-100 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-sm font-medium">{totalEnquiries}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Chart Segments */}
                  <div className="absolute top-0 left-0 w-full h-full pie-container">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {!loading && (
                        <>
                          {/* Open Segment */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent" 
                            stroke="#3B82F6" 
                            strokeWidth="20" 
                            strokeDasharray={calculateDashArray(enquiryStats[0].count)} 
                            className="pie-segment segment-1" 
                          />
                          
                          {/* Quoted Segment */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent" 
                            stroke="#10B981" 
                            strokeWidth="20" 
                            strokeDasharray={calculateDashArray(enquiryStats[1].count)} 
                            strokeDashoffset={`-${(calculatePercentage(enquiryStats[0].count) / 100) * 251.2}`}
                            className="pie-segment segment-2" 
                          />
                          
                          {/* Converted Segment */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent" 
                            stroke="#FBBF24" 
                            strokeWidth="20" 
                            strokeDasharray={calculateDashArray(enquiryStats[2].count)} 
                            strokeDashoffset={`-${((calculatePercentage(enquiryStats[0].count) + calculatePercentage(enquiryStats[1].count)) / 100) * 251.2}`}
                            className="pie-segment segment-3" 
                          />
                          
                          {/* Closed Segment */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent" 
                            stroke="#EF4444" 
                            strokeWidth="20" 
                            strokeDasharray={calculateDashArray(enquiryStats[3].count)} 
                            strokeDashoffset={`-${((calculatePercentage(enquiryStats[0].count) + calculatePercentage(enquiryStats[1].count) + calculatePercentage(enquiryStats[2].count)) / 100) * 251.2}`}
                            className="pie-segment segment-4" 
                          />
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {enquiryStats.map((stat, index) => (
                    <div key={index} className="flex items-center bg-gray-50 p-1 rounded">
                      <span className={`w-3 h-3 ${stat.color} rounded-full mr-1 flex-shrink-0`}></span>
                      <span className="whitespace-nowrap overflow-hidden text-overflow-ellipsis font-medium">
                        {stat.status}: {loading ? '...' : stat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="flex-1" style={{ width: 'calc(100% - 240px)' }}>
          <div className="bg-white rounded-lg shadow overflow-hidden h-full">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Quotations</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quotation ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentQuotations.map((quote, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-blue-600">{quote.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{quote.customer}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{quote.date}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(quote.status)}`}>
                            {quote.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Orders & Job Orders by Status */}
      <div className="flex flex-row lg:flex-row gap-4 w-full">
        {/* Sales Orders by Status */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5 h-full">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Sales Orders by Status</h3>
            <div className="space-y-4 mt-6">
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">Confirmed</div>
                <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full progress-bar delay-1" style={{ width: `${salesOrders.confirmed.percent}%` }}></div>
                </div>
                <div className="ml-3 text-sm font-medium w-12 text-right">{salesOrders.confirmed.count}</div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">Pending</div>
                <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full progress-bar delay-2" style={{ width: `${salesOrders.pending.percent}%` }}></div>
                </div>
                <div className="ml-3 text-sm font-medium w-12 text-right">{salesOrders.pending.count}</div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">Cancelled</div>
                <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full progress-bar delay-3" style={{ width: `${salesOrders.cancelled.percent}%` }}></div>
                </div>
                <div className="ml-3 text-sm font-medium w-12 text-right">{salesOrders.cancelled.count}</div>
              </div>
              <div className="text-sm text-right mr-3 font-medium">Total: {salesOrders.total}</div>
            </div>
          </div>
        </div>
        
        {/* Job Orders by Status */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5 h-full">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">Job Orders by Status</h3>
            <div className="space-y-4 mt-6">
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">In Progress</div>
                <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full progress-bar delay-1" style={{ width: `${jobOrders.inProgress.percent}%` }}></div>
                </div>
                <div className="ml-3 text-sm font-medium w-12 text-right">{jobOrders.inProgress.count}</div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">Completed</div>
                <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full progress-bar delay-2" style={{ width: `${jobOrders.completed.percent}%` }}></div>
                </div>
                <div className="ml-3 text-sm font-medium w-12 text-right">{jobOrders.completed.count}</div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium">On Hold</div>
                <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full progress-bar delay-3" style={{ width: `${jobOrders.onHold.percent}%` }}></div>
                </div>
                <div className="ml-3 text-sm font-medium w-12 text-right">{jobOrders.onHold.count}</div>
              </div>
              <div className="text-sm text-right mr-3 font-medium">Total: {jobOrders.total}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 