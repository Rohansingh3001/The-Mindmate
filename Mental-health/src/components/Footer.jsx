import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

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
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">Mental Health Tips</span>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">Meditation Guides</span>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">Wellness Blog</span>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">FAQs</span>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">About Us</span>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">Careers</span>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">Contact</span>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed select-none">Privacy Policy</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-4 items-start">
          <h4 className="text-lg font-semibold">Follow Us</h4>
          <div className="flex gap-5 text-2xl opacity-60 cursor-not-allowed select-none">
            <span aria-label="Facebook"><FaFacebook /></span>
            <span aria-label="Instagram"><FaInstagram /></span>
            <span aria-label="Twitter"><FaTwitter /></span>
            <span aria-label="LinkedIn"><FaLinkedin /></span>
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
