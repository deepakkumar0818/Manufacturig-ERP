import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <>
      <style>
        {`
        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column !important;
          }
          .hero-content {
            width: 100% !important;
            padding-right: 0 !important;
            margin-bottom: 1rem;
          }
          .hero-buttons {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .hero-button {
            width: 100% !important;
            margin-right: 0 !important;
            margin-bottom: 1rem !important;
          }
          .hero-features {
            flex-direction: column !important;
          }
          .feature-card {
            margin-bottom: 1rem !important;
          }
          .dashboard-preview {
            display: none !important;
          }
        }
        `}
      </style>
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden pt-16">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-600 opacity-20 blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-60 h-60 rounded-full bg-blue-400 opacity-10 blur-xl"></div>
          <div className="absolute right-1/4 bottom-1/3 w-40 h-40 rounded-full bg-indigo-400 opacity-10 blur-xl"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20">
          {/* Strict side-by-side container */}
          <div className="flex flex-row items-center justify-between w-full hero-container">
            {/* Hero content - fixed width */}
            <div className="w-1/2 pr-8 hero-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center mb-6">
                  <div className="h-1 w-10 bg-blue-300 mr-3"></div>
                  <span className="text-blue-300 font-medium uppercase tracking-wider text-sm">Industry-Leading Solution</span>
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                  Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">Manufacturing</span> Operations
                </h1>
                
                <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                  Our comprehensive ERP system helps manufacturing businesses optimize production, 
                  reduce costs, and accelerate growth with powerful analytics and resource planning tools.
                </p>
                
                <div className="mt-10 flex flex-row items-center hero-buttons">
                  <div className="hero-button">
                    <Link 
                      to="/dashboard" 
                      className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 px-8 font-medium text-white transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_10px_20px_-10px_rgba(79,70,229,0.45)] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                    >
                      <span className="relative flex items-center">
                        <span className="mr-2 text-base font-semibold tracking-wide">Get Started</span>
                        <svg className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
                
                <div className="mt-12 pt-6 border-t border-blue-800/50">
                  <p className="text-sm text-blue-200 mb-3">Trusted by industry leaders</p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div className="text-blue-100/70 font-semibold text-lg">ACME Industries</div>
                    <div className="text-blue-100/70 font-semibold text-lg">TechManufacture</div>
                    <div className="text-blue-100/70 font-semibold text-lg">GlobalParts</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dashboard preview - fixed width, hidden on mobile */}
            <div className="w-1/2 dashboard-preview">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative max-w-lg mx-auto">
                  {/* Dashboard frame */}
                  <div className="rounded-xl overflow-hidden shadow-2xl shadow-blue-900/50 border border-blue-700/30 bg-gradient-to-b from-blue-800/50 to-blue-900/50 backdrop-blur-sm">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-white/70 text-sm">Manufacturing ERP Dashboard</div>
                    </div>
                    
                    {/* Dashboard Content */}
                    <div className="p-5">
                      {/* Stats Row */}
                      <div className="grid grid-cols-4 gap-3 mb-5">
                        {['#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map((color, i) => (
                          <div key={i} className="rounded bg-white/10 p-3">
                            <div className="h-2 w-12 rounded bg-white/20 mb-2"></div>
                            <div className="h-5 w-8 rounded bg-white/30"></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Charts Row */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="rounded bg-white/10 p-3 h-32">
                          <div className="h-2 w-10 rounded bg-white/20 mb-3"></div>
                          <div className="flex h-20 items-end space-x-2">
                            {[40, 70, 50, 90, 60, 80, 40].map((h, i) => (
                              <div key={i} className="w-full">
                                <div className="h-full rounded-t flex items-end">
                                  <div className={`w-full rounded-t bg-blue-500/50`} style={{height: `${h}%`}}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded bg-white/10 p-3 h-32">
                          <div className="h-2 w-10 rounded bg-white/20 mb-4"></div>
                          <div className="relative h-20 w-20 mx-auto">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="60 100" />
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="20 100" strokeDashoffset="-60" />
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="10 100" strokeDashoffset="-80" />
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="10 100" strokeDashoffset="-90" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Table */}
                      <div className="rounded bg-white/10 p-3">
                        <div className="h-2 w-14 rounded bg-white/20 mb-3"></div>
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                              <div className="h-3 w-20 rounded bg-white/20"></div>
                              <div className="h-3 w-10 rounded bg-white/20"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-50 blur-xl"></div>
                  <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-30 blur-xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="relative bg-gradient-to-b from-blue-900/50 to-blue-950/80 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white">Key Manufacturing Features</h2>
              <p className="mt-4 text-xl text-blue-200 max-w-3xl mx-auto">
                Designed specifically for manufacturing businesses to optimize operations
              </p>
            </motion.div>
            
            <div className="flex flex-row justify-center gap-4 lg:gap-6 hero-features">
              {[
                {
                  title: "Production Planning",
                  description: "Optimize manufacturing schedules and resource allocation with advanced planning tools",
                  icon: "precision_manufacturing"
                },
                {
                  title: "Inventory Management",
                  description: "Real-time tracking and automated replenishment to minimize stockouts and reduce waste",
                  icon: "inventory_2"
                },
                {
                  title: "Quality Control",
                  description: "Comprehensive testing workflows and quality metrics to ensure product excellence",
                  icon: "verified"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-xl p-6 md:p-8 bg-gradient-to-br from-blue-800/40 to-blue-900/40 backdrop-blur-sm border border-blue-700/30 flex-1 feature-card"
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white mb-4 md:mb-6">
                    <span className="material-icons">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-blue-200 text-sm md:text-base">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection; 