import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Custom scrollbar hiding style
  const scrollbarHideStyle = `
    /* Hide scrollbar for Chrome, Safari and Opera */
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .hide-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }

    /* Transition styles for smooth collapse/expand */
    .sidebar-transition {
      transition: width 0.3s ease;
    }
    
    .sidebar-content-transition {
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
  `;

  // Navigation groups for the sidebar
  const navGroups = [
    {
      title: "Main",
      items: [
        { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
      ]
    },
    {
      title: "Sales & Quotes",
      items: [
        { icon: "mail", label: "Enquiries", path: "/enquiries" },
        { icon: "description", label: "Quotations", path: "/quotation" },
        { icon: "shopping_cart", label: "Sales Order", path: "/sales-order" },
      ]
    },
    {
      title: "Production",
      items: [
        { icon: "assessment", label: "Measurement Summaries", path: "/measurement-summaries" },
        { icon: "receipt", label: "Bill of Materials", path: "/bill-of-materials" },
        { icon: "work", label: "Job Order", path: "/job-order" },
        { icon: "inventory", label: "Material Requisition", path: "/material-requisition" },
      ]
    },
    {
      title: "Inventory",
      items: [
        { icon: "dashboard", label: "Inventory Dashboard", path: "/inventory/dashboard" },
        { icon: "inventory_2", label: "Inventory Items", path: "/inventory/items" },
        { icon: "sync_alt", label: "Stock Movements", path: "/inventory/movements" },
        { icon: "assignment", label: "Stock Count", path: "/inventory/count" },
      ]
    },
    {
      title: "Administration",
      items: [
        { icon: "settings", label: "Settings", path: "/settings" },
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <style>{scrollbarHideStyle}</style>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} sidebar-transition bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-lg`}>
        {/* Logo area */}
        <div className="border-b border-blue-700 flex items-center">
          <div className={`p-4 flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
            <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
              <span className="text-blue-800 text-xl">📊</span>
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-content-transition">
                <h1 className="text-xl font-bold tracking-wide">Manufacturing</h1>
                <p className="text-xs text-blue-300 mt-0.5">Enterprise ERP</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar py-4 px-2">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={`mb-4 ${groupIndex > 0 ? 'mt-6' : 'mt-2'}`}>
              {!sidebarCollapsed && (
                <h2 className="text-xs uppercase font-semibold text-blue-300 tracking-wider ml-4 mb-3 sidebar-content-transition">
                  {group.title}
                </h2>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center py-2.5 ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-blue-700 text-white shadow-md"
                          : "text-blue-100 hover:bg-blue-700/50"
                      }`}
                      title={sidebarCollapsed ? item.label : ""}
                    >
                      <span className={`flex items-center justify-center ${sidebarCollapsed ? 'w-10 h-10' : 'w-8 h-8 mr-3'} ${isActive(item.path) ? "text-blue-200" : "text-blue-400"}`}>
                        <i className="material-icons">{item.icon}</i>
                      </span>
                      {!sidebarCollapsed && (
                        <span className="font-medium sidebar-content-transition whitespace-nowrap">{item.label}</span>
                      )}
                      {!sidebarCollapsed && isActive(item.path) && (
                        <span className="ml-auto w-1.5 h-8 bg-blue-400 rounded-full sidebar-content-transition"></span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        
        {/* Toggle button */}
        <div className="mt-auto">
          <div className="border-t border-blue-700/40 px-2">
            <div className={`py-3 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between px-3'}`}>
              {!sidebarCollapsed && (
                <span className="text-xs font-medium text-blue-300">Collapse Menu</span>
              )}
              <button 
                onClick={toggleSidebar}
                className={`flex items-center justify-center ${sidebarCollapsed ? 'h-10 w-10 rounded-full bg-blue-700/50' : 'h-8 w-8 rounded-md bg-blue-700/30'} hover:bg-blue-700/70 transition-colors duration-200`}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <span className="material-icons text-blue-100" style={{ fontSize: sidebarCollapsed ? '20px' : '18px' }}>
                  {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* User Section */}
        <div className="border-t border-blue-700/40 bg-blue-900/40 p-2">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3 p-2'}`}>
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-blue-200">account_circle</span>
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-content-transition">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-blue-300">System Administrator</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            {sidebarCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="mr-4 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                title="Expand sidebar"
              >
                <span className="material-icons text-gray-500">menu</span>
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-800">
              {location.pathname === "/" ? "Dashboard" : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2).replace(/-/g, ' ')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-gray-500">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-icons">notifications</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-icons">help_outline</span>
              </button>
            </div>
            {isLoggedIn ? (
              <div className="flex items-center">
                <span className="mr-2">Admin</span>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                >
                  <span className="material-icons">person</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors shadow-sm"
              >
                Login
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 