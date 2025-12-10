import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";


function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] dark:from-mindmate-600 dark:via-mindmate-700 dark:to-mindmate-800 text-white py-8 sm:py-12 mt-12 sm:mt-20 shadow-2xl border-t border-purple-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Brand Identity - Full Width on Mobile */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">The MindMates</h3>
          </div>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-md mx-auto sm:mx-0">
            Your AI-powered mental health companion — here for you 24/7 with
            support, comfort, and tools that truly care.
          </p>
        </div>

        {/* Links Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          {/* Resources */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/90">
              <li><Link to="/mental-health-tips" className="hover:text-white hover:underline transition-colors">Mental Health Tips</Link></li>
              <li><Link to="/meditation-guides" className="hover:text-white hover:underline transition-colors">Meditation Guides</Link></li>
              <li><Link to="/wellness-blog" className="hover:text-white hover:underline transition-colors">Wellness Blog</Link></li>
              <li><Link to="/faqs" className="hover:text-white hover:underline transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/90">
              <li><Link to="/about" className="hover:text-white hover:underline transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white hover:underline transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:underline transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white hover:underline transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social Media - Centered on Mobile */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-3 sm:gap-4 items-center sm:items-start">
            <h4 className="text-base sm:text-lg font-semibold">Follow Us</h4>
            <div className="flex gap-4 sm:gap-5 text-xl sm:text-2xl">
              <a 
                href="https://facebook.com/themindmates" 
                aria-label="Facebook" 
                className="hover:text-blue-400 hover:scale-110 transition-all duration-200 active:scale-95" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://instagram.com/themindmates" 
                aria-label="Instagram" 
                className="hover:text-pink-400 hover:scale-110 transition-all duration-200 active:scale-95" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://twitter.com/themindmates" 
                aria-label="Twitter" 
                className="hover:text-blue-300 hover:scale-110 transition-all duration-200 active:scale-95" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://linkedin.com/company/themindmates" 
                aria-label="LinkedIn" 
                className="hover:text-blue-300 hover:scale-110 transition-all duration-200 active:scale-95" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/20 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-white/80">
          &copy; {new Date().getFullYear()} The MindMates. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;