import { useState } from 'react';
import { Link } from 'react-router-dom';

const InventoryDashboard = () => {
  // Summary statistics
  const inventorySummary = {
    totalItems: 128,
    totalValue: 87450.75,
    lowStock: 12,
    outOfStock: 5,
    recentlyAdded: 8,
    categories: {
      rawMaterials: 42,
      components: 36,
      finishedGoods: 31,
      packaging: 19
    }
  };

  // Item categories for the cards
  const categories = [
    { 
      name: 'Raw Materials', 
      count: inventorySummary.categories.rawMaterials,
      icon: 'category',
      color: 'bg-blue-500',
      path: '/inventory/items?category=raw-materials'
    },
    { 
      name: 'Components', 
      count: inventorySummary.categories.components,
      icon: 'build',
      color: 'bg-green-500',
      path: '/inventory/items?category=components'
    },
    { 
      name: 'Finished Goods', 
      count: inventorySummary.categories.finishedGoods,
      icon: 'inventory_2',
      color: 'bg-purple-500',
      path: '/inventory/items?category=finished-goods'
    },
    { 
      name: 'Packaging', 
      count: inventorySummary.categories.packaging,
      icon: 'inventory',
      color: 'bg-amber-500',
      path: '/inventory/items?category=packaging'
    }
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h1>
        <div className="flex space-x-3">
          <Link 
            to="/inventory/items/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <span className="material-icons mr-1">add</span> Add Item
          </Link>
          <Link 
            to="/inventory/items" 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <span className="material-icons mr-1">view_list</span> View All
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-3xl font-bold text-gray-800">{inventorySummary.totalItems}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <span className="material-icons text-blue-600">inventory_2</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Inventory Value</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(inventorySummary.totalValue)}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <span className="material-icons text-green-600">payments</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-3xl font-bold text-yellow-600">{inventorySummary.lowStock}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <span className="material-icons text-yellow-600">warning</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{inventorySummary.outOfStock}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <span className="material-icons text-red-600">error</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} to={category.path} className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-all p-6 flex items-center">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white mr-4`}>
                  <span className="material-icons">{category.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{category.name}</p>
                  <p className="text-2xl font-bold">{category.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex justify-between items-center">
            <h3 className="font-medium text-yellow-800 flex items-center">
              <span className="material-icons mr-2 text-yellow-600">warning</span>
              Low Stock Items
            </h3>
            <Link to="/inventory/items?filter=low-stock" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">RM-1023</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Aluminum Sheet 6061-T6</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">5 units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20 units</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">CP-4589</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Electric Motor 2HP</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">12 units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 units</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">RM-3302</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Stainless Steel Rod 316</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">18 units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25 units</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">PK-7821</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cardboard Box (Large)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">8 units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50 units</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <h3 className="font-medium text-blue-800 flex items-center">
              <span className="material-icons mr-2 text-blue-600">history</span>
              Recent Inventory Activity
            </h3>
            <Link to="/inventory/transactions" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="p-4 divide-y divide-gray-100">
            <div className="py-3">
              <div className="flex justify-between">
                <div className="flex">
                  <span className="mr-2 text-green-500 material-icons">add_circle</span>
                  <div>
                    <p className="text-sm font-medium">Stock Received</p>
                    <p className="text-xs text-gray-500">FG-5566 - Industrial Control Panel</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">+15 units</p>
                  <p className="text-xs text-gray-500">Today, 10:23 AM</p>
                </div>
              </div>
            </div>
            <div className="py-3">
              <div className="flex justify-between">
                <div className="flex">
                  <span className="mr-2 text-red-500 material-icons">remove_circle</span>
                  <div>
                    <p className="text-sm font-medium">Stock Allocated</p>
                    <p className="text-xs text-gray-500">CP-2235 - Bearing Assembly</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">-8 units</p>
                  <p className="text-xs text-gray-500">Today, 9:45 AM</p>
                </div>
              </div>
            </div>
            <div className="py-3">
              <div className="flex justify-between">
                <div className="flex">
                  <span className="mr-2 text-blue-500 material-icons">sync</span>
                  <div>
                    <p className="text-sm font-medium">Stock Adjusted</p>
                    <p className="text-xs text-gray-500">RM-1001 - Steel Plate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">+3 units</p>
                  <p className="text-xs text-gray-500">Yesterday, 3:12 PM</p>
                </div>
              </div>
            </div>
            <div className="py-3">
              <div className="flex justify-between">
                <div className="flex">
                  <span className="mr-2 text-purple-500 material-icons">inventory_2</span>
                  <div>
                    <p className="text-sm font-medium">New Item Added</p>
                    <p className="text-xs text-gray-500">CP-8910 - Hydraulic Pump XL-3</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Initial: 25 units</p>
                  <p className="text-xs text-gray-500">Yesterday, 11:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard; 