import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-[#6a4eeb] text-white py-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
        {/* Mind Mate Description */}
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h3 className="text-3xl font-bold mb-2">Mind Mate</h3>
          <p className="text-lg">Your AI mental health companion, providing support and guidance whenever you need it.</p>
        </div>

        {/* Resources Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 md:mb-0 text-center md:text-left">
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul>
              <li><a href="/mental-health-tips" className="hover:text-gray-200">Mental Health Tips</a></li>
              <li><a href="/meditation-guides" className="hover:text-gray-200">Meditation Guides</a></li>
              <li><a href="/wellness-blog" className="hover:text-gray-200">Wellness Blog</a></li>
              <li><a href="/faqs" className="hover:text-gray-200">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul>
              <li><a href="/about-us" className="hover:text-gray-200">About Us</a></li>
              <li><a href="/careers" className="hover:text-gray-200">Careers</a></li>
              <li><a href="/contact" className="hover:text-gray-200">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-gray-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-6 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-200 transition duration-300 ease-in-out">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-200 transition duration-300 ease-in-out">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-200 transition duration-300 ease-in-out">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-200 transition duration-300 ease-in-out">
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="border-t border-gray-200 pt-4 mt-8 text-center">
        <p className="text-sm text-gray-300">&copy; 2025 Mind Mate. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
