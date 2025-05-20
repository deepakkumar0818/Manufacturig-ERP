import { useState, useRef, useEffect } from 'react';

// Add CSS animations for toast
const styles = document.createElement('style');
styles.innerHTML = `
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out forwards;
}
`;
document.head.appendChild(styles);

// Style variables to reuse
const inputClasses = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-500/50 transition-colors";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

// Toast component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' 
    ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300' 
    : 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300';

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg border ${bgColor} max-w-md animate-fade-in-down`}>
      <div className="flex items-center">
        {type === 'error' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        <p className="text-sm font-medium">{message}</p>
        <button 
          onClick={onClose} 
          className="ml-auto pl-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const DemoRequestForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    interestedIn: [],
    message: '',
    privacyPolicy: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });
  
  const totalSteps = 3;
  const dropdownRef = useRef(null);

  // Show toast notification
  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const interestOptions = [
    { value: 'Production Planning', label: 'Production Planning & Scheduling' },
    { value: 'Inventory Management', label: 'Inventory Management' },
    { value: 'Quality Control', label: 'Quality Control & Assurance' },
    { value: 'Supply Chain Management', label: 'Supply Chain Management' },
    { value: 'Analytics & Reporting', label: 'Analytics & Reporting' },
    { value: 'Maintenance Management', label: 'Maintenance Management' },
    { value: 'Compliance & Documentation', label: 'Compliance & Documentation' },
  ];

  useEffect(() => {
    // Handle clicking outside of dropdown to close it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle scroll locking when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleInterestToggle = (value) => {
    setFormData(prev => {
      if (prev.interestedIn.includes(value)) {
        return { ...prev, interestedIn: prev.interestedIn.filter(item => item !== value) };
      } else {
        return { ...prev, interestedIn: [...prev.interestedIn, value] };
      }
    });
  };

  const nextStep = () => {
    // Validate current step fields
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        showToast('Please fill in all required fields in the Contact section');
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showToast('Please enter a valid email address');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.companyName || !formData.jobTitle || !formData.companySize || !formData.industry) {
        showToast('Please fill in all required fields in the Company section');
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    
    // Clear any active element focus to ensure buttons remain responsive
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    
    // Clear any active element focus to ensure buttons remain responsive
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validate required fields
    if (currentStep === 3) {
      // Validate all required fields before submission
      if (!formData.firstName || !formData.lastName || !formData.email ||
          !formData.companyName || !formData.jobTitle || !formData.companySize ||
          !formData.industry || !formData.privacyPolicy) {
        showToast('Please fill in all required fields and agree to the privacy policy');
        return;
      }
      
      setSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
        
        // Reset after showing success message
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            companyName: '',
            jobTitle: '',
            companySize: '',
            industry: '',
            interestedIn: [],
            message: '',
            privacyPolicy: false
          });
          setCurrentStep(1);
        }, 3000);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Toast notification */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
        <div 
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-xl w-full mx-auto relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >          
          {/* Header */}
          <div className="relative p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Schedule Your Demo</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="p-4">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mx-auto">
                  Your demo request has been submitted successfully.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                  Our team will contact you shortly.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Step indicator */}
                <div className="mb-4 relative">
                  <div className="flex items-center justify-between relative z-10">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-medium text-xs mb-1 shadow-sm transition-all duration-300 ${
                          currentStep > step 
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                            : currentStep === step
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-2 ring-blue-100 dark:ring-blue-900/30'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {currentStep > step ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            step
                          )}
                        </div>
                        <span className={`text-xs font-medium ${currentStep >= step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {step === 1 ? "Contact" : step === 2 ? "Company" : "Interests"}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="absolute left-0 right-0 top-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0">
                    {/* Active progress bar */}
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
                      style={{ 
                        width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Form content */}
                {/* Step 1: Basic Contact Information */}
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses} htmlFor="firstName">
                          First Name*
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                          placeholder="John"
                        />
                      </div>
                      
                      <div>
                        <label className={labelClasses} htmlFor="lastName">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                          placeholder="Smith"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses} htmlFor="email">
                          Business Email*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                          placeholder="john.smith@company.com"
                        />
                      </div>
                      
                      <div>
                        <label className={labelClasses} htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                )}
              
                {/* Step 2: Company Details */}
                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses} htmlFor="companyName">
                          Company Name*
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                          placeholder="Acme Industries"
                        />
                      </div>
                      
                      <div>
                        <label className={labelClasses} htmlFor="jobTitle">
                          Job Title*
                        </label>
                        <input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                          placeholder="Operations Manager"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses} htmlFor="companySize">
                          Company Size*
                        </label>
                        <select
                          id="companySize"
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1001+">1001+ employees</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={labelClasses} htmlFor="industry">
                          Industry*
                        </label>
                        <select
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        >
                          <option value="">Select industry</option>
                          <option value="Automotive">Automotive</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Aerospace">Aerospace</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Pharmaceuticals">Pharmaceuticals</option>
                          <option value="Chemicals">Chemicals</option>
                          <option value="Plastics & Packaging">Plastics & Packaging</option>
                          <option value="Metals & Mining">Metals & Mining</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Interests and Comments */}
                {currentStep === 3 && (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClasses}>
                        I'm interested in (select all that apply)
                      </label>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className={`${inputClasses} flex justify-between items-center`}
                        >
                          <span className={formData.interestedIn.length ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                            {formData.interestedIn.length 
                              ? `${formData.interestedIn.length} option${formData.interestedIn.length > 1 ? 's' : ''} selected` 
                              : 'Select your areas of interest'}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {dropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {interestOptions.map((option, index) => (
                              <div 
                                key={option.value}
                                className={`px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center ${index > 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}
                                onClick={() => handleInterestToggle(option.value)}
                              >
                                <div className={`h-4 w-4 flex items-center justify-center rounded-sm border ${formData.interestedIn.includes(option.value) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-500'} mr-2`}>
                                  {formData.interestedIn.includes(option.value) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-gray-800 dark:text-gray-200 text-sm">{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Display selected options */}
                      {formData.interestedIn.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {formData.interestedIn.map(value => {
                            const option = interestOptions.find(opt => opt.value === value);
                            return (
                              <div 
                                key={value}
                                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs flex items-center"
                              >
                                <span className="truncate max-w-[160px]">{option?.label}</span>
                                <button 
                                  type="button" 
                                  className="ml-1 text-blue-500 hover:text-blue-700 p-0.5"
                                  onClick={() => handleInterestToggle(value)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className={labelClasses} htmlFor="message">
                        Additional Comments
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={2}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Share any specific requirements..."
                        className={inputClasses}
                      ></textarea>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        id="privacy-policy"
                        name="privacyPolicy"
                        type="checkbox"
                        required
                        checked={formData.privacyPolicy}
                        onChange={handleChange}
                        className="h-4 w-4 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="privacy-policy" className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                        I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">privacy policy</a> and consent to being contacted.
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with buttons - fixed */}
          {!submitted && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent default to ensure immediate response
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </span>
                    </button>
                  )}
                </div>
                
                <div>
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent default to ensure immediate response
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
                    >
                      <span className="flex items-center">
                        Continue
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent default to ensure immediate response
                      }}
                      disabled={submitting}
                      className={`px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm ${
                        submitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <span className="flex items-center">
                          Submit Request
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h15" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DemoRequestForm; 