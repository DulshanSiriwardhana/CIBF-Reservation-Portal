import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">About Colombo Bookfair</h3>
            <p className="text-sm leading-relaxed mb-4">
              The Colombo International Bookfair is Sri Lanka's premier literary event, 
              organized by the Sri Lanka Book Publishers' Association. Join us in celebrating 
              the love of reading and knowledge.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">About the Fair</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Exhibitor Guidelines</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                <span>BMICH, Bauddhaloka Mawatha, Colombo 07, Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <span>+94 11 2 345 678</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <span>info@colombobookfair.lk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Colombo International Bookfair. All rights reserved.</p>
          <p className="mt-2">Organized by Sri Lanka Book Publishers' Association</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;