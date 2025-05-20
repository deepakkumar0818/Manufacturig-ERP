import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-8 lg:py-12 overflow-x-auto">
        <div className="flex flex-nowrap min-w-max space-x-8">
          {/* Company section */}
          <div className="max-w-xs">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">COMPANY NAME</h3>
            <p className="text-gray-600 text-sm">
              Our comprehensive ERP system is designed specifically for the manufacturing industry,
              with features that address your unique challenges.
            </p>
          </div>

          {/* Products section */}
          <div className="min-w-[180px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">PRODUCTS</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Real-time Monitoring</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Inventory Optimization</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Quality Control</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Resource Allocation</a></li>
            </ul>
          </div>

          {/* Useful Links section */}
          <div className="min-w-[180px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">USEFUL LINKS</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Your Account</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Become an Affiliate</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Shipping Rates</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Help</a></li>
            </ul>
          </div>

          {/* Contact section */}
          <div className="min-w-[200px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">CONTACT</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">New York, NY 10012, US</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 break-words">deepakkumar0818@gmail.com</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600">+91 7018318078</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

     

      {/* Copyright section */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">© 2024 Copyright: SavantsX Manufacturing ERP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 