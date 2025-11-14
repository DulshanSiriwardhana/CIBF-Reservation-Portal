import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaMapMarkedAlt, FaCheckCircle, FaUsers } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaBook className="text-4xl text-primary-600" />,
      title: 'Browse Stalls',
      description: 'Explore available stalls with detailed information about size and pricing.'
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-primary-600" />,
      title: 'Interactive Map',
      description: 'Visualize stall locations and choose the perfect spot for your business.'
    },
    {
      icon: <FaCheckCircle className="text-4xl text-primary-600" />,
      title: 'Easy Booking',
      description: 'Reserve up to 3 stalls with our simple and secure booking system.'
    },
    {
      icon: <FaUsers className="text-4xl text-primary-600" />,
      title: 'Vendor Support',
      description: 'Get dedicated support for all your exhibition requirements.'
    },
  ];

  const stallTypes = [
    { name: 'Small Stall', size: '10 sq.m', price: 'Rs. 10,000 - 20,000', color: 'bg-blue-500' },
    { name: 'Medium Stall', size: '20 sq.m', price: 'Rs. 25,000 - 45,000', color: 'bg-green-500' },
    { name: 'Large Stall', size: '30 sq.m', price: 'Rs. 50,000 - 100,000', color: 'bg-purple-500' },
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to Colombo International Bookfair
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Sri Lanka's Premier Literary Event - Reserve Your Stall Today!
            </p>
            <p className="text-lg mb-10 text-primary-50">
              Join hundreds of publishers and vendors in celebrating the love of reading
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/stalls" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all duration-200 shadow-lg">
                Browse Available Stalls
              </Link>
              <Link to="/map" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200">
                View Stall Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stall Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Stall Categories
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose from three stall sizes to perfectly fit your exhibition needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stallTypes.map((stall, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`${stall.color} h-32 flex items-center justify-center`}>
                  <FaBook className="text-white text-6xl" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{stall.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Size:</span>
                      {stall.size}
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Price:</span>
                      {stall.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl text-primary-100">Exhibitors</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50,000+</div>
              <div className="text-xl text-primary-100">Visitors</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10 Days</div>
              <div className="text-xl text-primary-100">Exhibition Period</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Ready to Reserve Your Stall?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't miss this opportunity to showcase your publications at Sri Lanka's biggest bookfair
          </p>
          <Link to="/stalls" className="btn-primary text-lg px-10 py-4 inline-block">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
