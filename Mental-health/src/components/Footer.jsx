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
              <a href="/tips" className="hover:text-white/70">
                Mental Health Tips
              </a>
            </li>
            <li>
              <a href="/meditation" className="hover:text-white/70">
                Meditation Guides
              </a>
            </li>
            <li>
              <a href="/wellness" className="hover:text-white/70">
                Wellness Blog
              </a>
            </li>
            <li>
              <a href="/faqs" className="hover:text-white/70">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              <a href="/about" className="hover:text-white/70">
                About Us
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:text-white/70">
                Careers
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white/70">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white/70">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-4 items-start">
          <h4 className="text-lg font-semibold">Follow Us</h4>
          <div className="flex gap-5 text-2xl">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition"
            >
              <FaLinkedin />
            </a>
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
