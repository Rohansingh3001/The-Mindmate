import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-100">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-600 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>

      <h1 className="text-4xl font-bold mb-6 text-purple-700 dark:text-purple-300">
        Privacy Policy
      </h1>

      <p className="mb-6 text-lg">
        At <strong>The MindMates</strong>, your privacy is not just a feature — it's a promise.
        We believe mental health support should be safe, confidential, and empowering.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
        <p>
          We collect only what we need to serve you better and keep your experience secure:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Basic info:</strong> Name, email, and language preference</li>
          <li><strong>Mood and journal data:</strong> Only stored locally unless synced</li>
          <li><strong>Appointments:</strong> Session bookings, therapist name, mode & date</li>
          <li><strong>Device info:</strong> Browser type, device model (for improving UX)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Data</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To personalize your dashboard and chatbot experience</li>
          <li>To book and manage therapy sessions securely</li>
          <li>To show you relevant mental health content in your preferred language</li>
          <li>To improve platform features through anonymized analytics</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Data Privacy & Security</h2>
        <p>
          We take your privacy seriously. All sensitive data is:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Encrypted in transit and at rest (Firebase + Firestore security rules)</li>
          <li>Never shared with third parties without explicit consent</li>
          <li>Stored only as long as needed to serve your mental health goals</li>
        </ul>
        <p className="mt-2">You can delete your account or request data deletion anytime.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Use of AI & Chatbot</h2>
        <p>
          Our chatbot "Ira" uses AI to provide support and guidance, not medical diagnosis.
          Conversations are not monitored in real-time, but may be used anonymously to improve responses.
        </p>
        <p className="mt-2">
          If a user shares signs of crisis (e.g. self-harm), the platform may prompt them to reach out to emergency resources or a trusted adult.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Third-Party Services</h2>
        <p>
          We may use secure third-party services like Firebase, Stripe (if payments are added), and analytics tools to improve your experience. These providers follow strict data protection standards.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Children's Privacy</h2>
        <p>
          We are committed to protecting the privacy of young users. If you're under 18, you must use The MindMates under guardian guidance or with school consent. We do not knowingly collect data from children under 13.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
        <p>
          You have full control over your data. At any point, you can:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Access your data</li>
          <li>Edit or correct inaccurate data</li>
          <li>Request account or data deletion</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">8. Changes to This Policy</h2>
        <p>
          We may update this policy as our services evolve. We will notify users via email or app banners whenever there are significant changes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
        <p>
          If you have any questions, feedback, or concerns about your privacy, feel free to contact us at:
        </p>
        <p className="mt-2 font-medium">
          📧 support@themindmates.in
        </p>
      </section>

      <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        Last updated: June 23, 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;
