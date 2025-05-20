import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InventoryItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Simulate loading data
  useEffect(() => {
    // This would be replaced with actual API call
    setTimeout(() => {
      setItems(inventoryData);
      setFilteredItems(inventoryData);
      setLoading(false);
    }, 500);
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let result = [...items];
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        item.sku.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      switch(statusFilter) {
        case 'in-stock':
          result = result.filter(item => item.stockQuantity > 0);
          break;
        case 'low-stock':
          result = result.filter(item => item.stockQuantity <= item.minStockLevel && item.stockQuantity > 0);
          break;
        case 'out-of-stock':
          result = result.filter(item => item.stockQuantity === 0);
          break;
        default:
          break;
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle numbers vs strings
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
        return sortDirection === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      } else {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
    });
    
    setFilteredItems(result);
  }, [items, searchTerm, categoryFilter, statusFilter, sortField, sortDirection]);

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get stock status class for color-coding
  const getStockStatusClass = (item) => {
    if (item.stockQuantity === 0) {
      return 'text-red-600 bg-red-100';
    } else if (item.stockQuantity <= item.minStockLevel) {
      return 'text-yellow-600 bg-yellow-100';
    } else {
      return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Items</h1>
          <div className="text-sm text-gray-500">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to="/inventory/items/import" 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <span className="material-icons mr-1">upload</span> Import
          </Link>
          
          <Link 
            to="/inventory/items/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <span className="material-icons mr-1">add</span> Add Item
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-gray-400">search</span>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by name, SKU, or location"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              <option value="raw-materials">Raw Materials</option>
              <option value="components">Components</option>
              <option value="finished-goods">Finished Goods</option>
              <option value="packaging">Packaging</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-gray-500 mb-1">Stock Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
            <select
              id="sort"
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="sku-asc">SKU (A-Z)</option>
              <option value="sku-desc">SKU (Z-A)</option>
              <option value="stockQuantity-asc">Stock: Low to High</option>
              <option value="stockQuantity-desc">Stock: High to Low</option>
              <option value="unitPrice-asc">Price: Low to High</option>
              <option value="unitPrice-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading inventory items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-icons text-gray-400 text-5xl">inventory_2</span>
            <p className="mt-2 text-gray-600">No items found matching your filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="mt-3 text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sku')}
                  >
                    <div className="flex items-center">
                      SKU
                      {sortField === 'sku' && (
                        <span className="material-icons ml-1 text-xs">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <span className="material-icons ml-1 text-xs">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('stockQuantity')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortField === 'stockQuantity' && (
                        <span className="material-icons ml-1 text-xs">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('unitPrice')}
                  >
                    <div className="flex items-center">
                      Unit Price
                      {sortField === 'unitPrice' && (
                        <span className="material-icons ml-1 text-xs">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/inventory/items/${item.id}`} className="hover:underline">
                        {item.sku}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs">
                        {item.category === 'raw-materials' && 'Raw Materials'}
                        {item.category === 'components' && 'Components'}
                        {item.category === 'finished-goods' && 'Finished Goods'}
                        {item.category === 'packaging' && 'Packaging'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-md ${getStockStatusClass(item)} text-xs font-medium`}>
                        {item.stockQuantity} {item.unit}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">
                        (Min: {item.minStockLevel})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/inventory/items/${item.id}`} className="text-blue-600 hover:text-blue-900">
                          <span className="material-icons text-sm">visibility</span>
                        </Link>
                        <Link to={`/inventory/items/${item.id}/edit`} className="text-green-600 hover:text-green-900">
                          <span className="material-icons text-sm">edit</span>
                        </Link>
                        <button className="text-blue-600 hover:text-blue-900">
                          <span className="material-icons text-sm">inventory</span>
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
        )}
      </div>
    </div>
  );
};

// Sample inventory data
const inventoryData = [
  {
    id: 1,
    sku: 'RM-1001',
    name: 'Steel Sheet 1.5mm',
    category: 'raw-materials',
    stockQuantity: 35,
    minStockLevel: 20,
    unit: 'sheets',
    unitPrice: 85.50,
    location: 'Warehouse A, Rack 12'
  },
  {
    id: 2,
    sku: 'RM-1023',
    name: 'Aluminum Sheet 6061-T6',
    category: 'raw-materials',
    stockQuantity: 5,
    minStockLevel: 20,
    unit: 'sheets',
    unitPrice: 120.75,
    location: 'Warehouse A, Rack 14'
  },
  {
    id: 3,
    sku: 'RM-2045',
    name: 'Copper Wire 10 AWG',
    category: 'raw-materials',
    stockQuantity: 150,
    minStockLevel: 50,
    unit: 'meters',
    unitPrice: 5.25,
    location: 'Warehouse B, Section C'
  },
  {
    id: 4,
    sku: 'RM-3302',
    name: 'Stainless Steel Rod 316',
    category: 'raw-materials',
    stockQuantity: 18,
    minStockLevel: 25,
    unit: 'pieces',
    unitPrice: 45.80,
    location: 'Warehouse A, Rack 5'
  },
  {
    id: 5,
    sku: 'CP-2235',
    name: 'Bearing Assembly',
    category: 'components',
    stockQuantity: 64,
    minStockLevel: 30,
    unit: 'pieces',
    unitPrice: 22.50,
    location: 'Warehouse C, Bin 104'
  },
  {
    id: 6,
    sku: 'CP-4565',
    name: 'Hydraulic Valve 3/4"',
    category: 'components',
    stockQuantity: 42,
    minStockLevel: 15,
    unit: 'pieces',
    unitPrice: 115.20,
    location: 'Warehouse C, Bin 87'
  },
  {
    id: 7,
    sku: 'CP-4589',
    name: 'Electric Motor 2HP',
    category: 'components',
    stockQuantity: 12,
    minStockLevel: 15,
    unit: 'pieces',
    unitPrice: 189.99,
    location: 'Warehouse C, Section E'
  },
  {
    id: 8,
    sku: 'CP-8910',
    name: 'Hydraulic Pump XL-3',
    category: 'components',
    stockQuantity: 25,
    minStockLevel: 10,
    unit: 'pieces',
    unitPrice: 320.50,
    location: 'Warehouse C, Section G'
  },
  {
    id: 9,
    sku: 'FG-5566',
    name: 'Industrial Control Panel',
    category: 'finished-goods',
    stockQuantity: 15,
    minStockLevel: 8,
    unit: 'pieces',
    unitPrice: 1250.00,
    location: 'Warehouse D, Aisle 2'
  },
  {
    id: 10,
    sku: 'FG-6601',
    name: 'Automated Assembly Unit',
    category: 'finished-goods',
    stockQuantity: 0,
    minStockLevel: 5,
    unit: 'pieces',
    unitPrice: 4500.00,
    location: 'Warehouse D, Aisle 5'
  },
  {
    id: 11,
    sku: 'FG-7720',
    name: 'Conveyor System 10m',
    category: 'finished-goods',
    stockQuantity: 3,
    minStockLevel: 2,
    unit: 'sets',
    unitPrice: 2750.00,
    location: 'Warehouse D, Bay 7'
  },
  {
    id: 12,
    sku: 'PK-7821',
    name: 'Cardboard Box (Large)',
    category: 'packaging',
    stockQuantity: 8,
    minStockLevel: 50,
    unit: 'pieces',
    unitPrice: 4.50,
    location: 'Warehouse B, Section A'
  },
  {
    id: 13,
    sku: 'PK-7822',
    name: 'Cardboard Box (Medium)',
    category: 'packaging',
    stockQuantity: 65,
    minStockLevel: 50,
    unit: 'pieces',
    unitPrice: 3.25,
    location: 'Warehouse B, Section A'
  },
  {
    id: 14,
    sku: 'PK-7900',
    name: 'Pallet Wrap Film',
    category: 'packaging',
    stockQuantity: 32,
    minStockLevel: 20,
    unit: 'rolls',
    unitPrice: 18.75,
    location: 'Warehouse B, Section B'
  },
  {
    id: 15,
    sku: 'PK-8010',
    name: 'Bubble Wrap (Large Roll)',
    category: 'packaging',
    stockQuantity: 27,
    minStockLevel: 15,
    unit: 'rolls',
    unitPrice: 22.99,
    location: 'Warehouse B, Section B'
  }
];

export default InventoryItems; 