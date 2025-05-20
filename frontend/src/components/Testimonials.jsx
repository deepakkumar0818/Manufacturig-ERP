import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "John Smith",
    role: "Production Manager, ACME Industries",
    quote: "This ERP system has transformed our manufacturing processes. We've reduced production time by 30% and inventory costs by 25%.",
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    name: "Sarah Johnson",
    role: "COO, TechManufacture",
    quote: "The insights we get from the manufacturing ERP dashboard have been invaluable. Our decision-making is faster and more data-driven now.",
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    name: "Michael Chen",
    role: "Director of Operations, GlobalParts",
    quote: "The implementation was smooth and the support team is exceptional. We now have complete visibility into our supply chain.",
    image: "https://randomuser.me/api/portraits/men/3.jpg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Industry leaders trust our manufacturing ERP system to optimize their operations
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-500 hover:shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="relative h-12 w-12 mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-full w-full object-cover rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <blockquote>
                  <svg className="h-8 w-8 text-blue-400 mb-3 opacity-30" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-700 text-lg leading-relaxed italic">"{testimonial.quote}"</p>
                </blockquote>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Verified Customer</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 