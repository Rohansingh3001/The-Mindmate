import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can integrate EmailJS, Firebase, or backend here
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-gray-900 dark:text-gray-100">

      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-600 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-300 mb-2">
          Contact Us 📬
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We’re here to listen, support, and collaborate. Let’s talk.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="text-purple-500" />
            <div>
              <h3 className="font-semibold">Our Office</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Kolkata, India (Remote-first)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="text-purple-500" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                +91 123456789 (Mon–Fri, 10am–6pm)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="text-purple-500" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                hello@themindmates.in
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-purple-200 dark:border-purple-700"
        >
          {!submitted ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300"
              >
                <Send size={16} />
                Send Message
              </button>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                Thank you! 💌
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We’ve received your message and will be in touch soon.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
