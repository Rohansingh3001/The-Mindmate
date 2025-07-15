import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";


function Footer() {
  return (
    <footer className="bg-[#6a4eeb] text-white py-12 mt-20 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid gap-12 md:grid-cols-4">
        {/* Brand Identity */}
        <div className="md:col-span-1">
          <h3 className="text-3xl font-extrabold mb-3">The MindMates</h3>
          <p className="text-base text-white/80 leading-relaxed">
            Your AI-powered mental health companion — here for you 24/7 with
            support, comfort, and tools that truly care.
          </p>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li><Link to="/mental-health-tips" className="hover:underline">Mental Health Tips</Link></li>
            <li><Link to="/meditation-guides" className="hover:underline">Meditation Guides</Link></li>
            <li><Link to="/wellness-blog" className="hover:underline">Wellness Blog</Link></li>
            <li><Link to="/faqs" className="hover:underline">FAQs</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-4 items-start">
          <h4 className="text-lg font-semibold">Follow Us</h4>
          <div className="flex gap-5 text-2xl">
            <a href="https://facebook.com/themindmates" aria-label="Facebook" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com/themindmates" aria-label="Instagram" className="hover:text-pink-500" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com/themindmates" aria-label="Twitter" className="hover:text-blue-400" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com/company/themindmates" aria-label="LinkedIn" className="hover:text-blue-700" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm text-white/70">
        &copy; {new Date().getFullYear()} The MindMates. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
