import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Real-time Production Monitoring",
    description: "Track production progress in real-time with detailed dashboards showing machine status, work orders, and bottlenecks.",
    icon: "monitoring",
    color: "bg-blue-500"
  },
  {
    title: "Inventory Optimization",
    description: "AI-powered inventory forecasting to minimize stockouts and reduce excess inventory costs.",
    icon: "inventory_2",
    color: "bg-green-500"
  },
  {
    title: "Quality Control & Assurance",
    description: "Implement rigorous quality checks and generate compliance reports automatically.",
    icon: "verified",
    color: "bg-yellow-500"
  },
  {
    title: "Resource Allocation",
    description: "Optimize workforce and equipment allocation based on real-time production demands.",
    icon: "group_work",
    color: "bg-purple-500"
  },
  {
    title: "Supply Chain Integration",
    description: "Seamlessly connect with suppliers and customers through integrated portals and APIs.",
    icon: "link",
    color: "bg-red-500"
  },
  {
    title: "Advanced Analytics",
    description: "Make data-driven decisions with powerful analytics and customizable reporting tools.",
    icon: "insights",
    color: "bg-indigo-500"
  }
];

// Guaranteed responsive styling with inline styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem'
};

const featureContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  margin: '0 -1rem'
};

// Use media queries through component logic and dynamic styling
const FeatureSection = () => {
  // Function to determine card width based on screen size
  const getCardStyle = () => {
    const baseStyle = {
      padding: '0 1rem',
      marginBottom: '2rem',
      boxSizing: 'border-box'
    };
    
    // Use window.innerWidth to determine the correct width
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        return { ...baseStyle, width: '33.333333%' }; // 3 cards per row on laptop/desktop
      } else if (window.innerWidth >= 640) {
        return { ...baseStyle, width: '50%' }; // 2 cards per row on tablet
      }
    }
    
    return { ...baseStyle, width: '100%' }; // 1 card per row on mobile (default)
  };

  const [cardStyle, setCardStyle] = React.useState({
    padding: '0 1rem',
    marginBottom: '2rem',
    boxSizing: 'border-box',
    width: '33.333333%' // Default for desktop
  });

  // Update card width on window resize
  React.useEffect(() => {
    // Set initial width
    setCardStyle(getCardStyle());
    
    // Update on resize
    const handleResize = () => {
      setCardStyle(getCardStyle());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <section id="features" className="py-24 bg-white">
      <div style={containerStyle}>
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Powerful Features for Modern Manufacturing</h2>
          <p className="mt-4 text-xl text-gray-600">
            Our comprehensive ERP system is designed specifically for the manufacturing industry,
            with features that address your unique challenges.
          </p>
        </motion.div>

        {/* Feature Cards with guaranteed responsive layout */}
        <div style={featureContainerStyle}>
          {features.map((feature, index) => (
            <div key={index} style={cardStyle}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4 sm:mb-6`}>
                    <span className="material-icons">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </div>
            ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl overflow-hidden shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 flex items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Streamline Your Entire Manufacturing Process
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  From raw material procurement to final product delivery, our ERP system provides
                  end-to-end visibility and control over your manufacturing processes.
                </p>
                <ul className="space-y-4">
                  {[
                    "Reduce operational costs by up to 25%",
                    "Improve production efficiency by 30%",
                    "Decrease inventory holding costs by 20%",
                    "Enhance quality control and reduce defects"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-0 flex items-center justify-center">
              <div className="relative w-full max-w-md py-8">
                  {/* Factory illustration or dashboard screenshot would go here */}
                <div className="aspect-w-16 aspect-h-9 bg-blue-800 rounded-lg shadow-xl overflow-hidden relative mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-icons text-white text-6xl">precision_manufacturing</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Animated elements */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-indigo-300 rounded-full animate-ping animation-delay-500"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection; 