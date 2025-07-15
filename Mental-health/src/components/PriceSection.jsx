import { FaHeartbeat, FaRegThumbsUp, FaUsers } from 'react-icons/fa';
import { HiCheckCircle } from 'react-icons/hi';
import CountUp from 'react-countup';

export default function ServicesSection() {
  return (
    <section id="services" className="relative bg-[#f8f4ff] py-20 px-6 overflow-hidden">
      {/* Background "COMING SOON" text */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-extrabold text-[#c2baf9] opacity-20 rotate-[-10deg] tracking-wide select-none uppercase">
          Empowering Minds
        </h1>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#6a4eeb] mb-4">
          Mental Wellness, Accessible to All
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-10">
          The MindMates is a digital platform offering AI-based support, expert consultations, and a safe community — all designed to uplift mental health across India.
        </p>

        {/* Key Stats */}
        <div className="flex flex-wrap justify-center gap-10 mt-12 mb-16">
          {[
            { icon: FaUsers, label: 'Users Helped', count: 5000 },
            { icon: FaHeartbeat, label: 'Support Sessions', count: 12000 },
            { icon: FaRegThumbsUp, label: 'Positive Feedback', count: 98, suffix: '%' }
          ].map(({ icon: Icon, label, count, suffix = '' }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="text-4xl text-[#6a4eeb] mb-2" />
              <span className="text-3xl font-bold text-[#6a4eeb]">
                <CountUp end={count} duration={2} suffix={suffix} />
              </span>
              <p className="text-gray-700 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Perks Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-[#6a4eeb] mb-6">
            What You Get with The MindMates:
          </h3>
          <ul className="text-left space-y-4 max-w-3xl mx-auto">
            {[
              'AI-powered emotional support in multiple languages',
              'Daily self-check-ins and guided well-being tips',
              'Safe, moderated community spaces',
              'Doctor and therapist consultations',
              'Earn rewards for staying engaged with your wellness'
            ].map(perk => (
              <li key={perk} className="flex items-center text-gray-700">
                <HiCheckCircle className="text-[#6a4eeb] mr-3 text-xl" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-[#6a4eeb] mb-4">Our Service Plans</h3>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Start with free daily support and upgrade anytime. Our plans are built to grow with your emotional wellness journey.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8">
            {/* Free Tier */}
            <div className="bg-white border border-[#d6d0ff] p-8 rounded-2xl shadow-md hover:shadow-lg transition max-w-sm w-full">
              <h4 className="text-xl font-semibold text-[#6a4eeb] mb-2">Free Plan</h4>
              <p className="text-3xl font-bold text-[#6a4eeb] mb-4">
                ₹0<span className="text-base font-medium"> /day</span>
              </p>
              <ul className="text-left text-gray-700 space-y-3 text-sm mb-6">
                <li>✔️ 5 min/day free AI chatbot usage</li>
                <li>✔️ Multilingual emotional support</li>
                <li>✔️ Community access</li>
                <li>✔️ Self check-ins & wellness tips</li>
              </ul>
              <button className="bg-[#6a4eeb] text-white py-2 px-6 rounded-full font-medium hover:bg-[#5a3edc] transition">
                Get Started Free
              </button>
            </div>

            {/* Top-Up Option */}
            <div className="bg-white border border-[#d6d0ff] p-8 rounded-2xl shadow-md hover:shadow-lg transition max-w-sm w-full">
              <h4 className="text-xl font-semibold text-[#6a4eeb] mb-2">Chat Top-Up</h4>
              <p className="text-3xl font-bold text-[#6a4eeb] mb-4">Pay-as-you-go</p>
              <ul className="text-left text-gray-700 space-y-3 text-sm mb-6">
                <li>✔️ Add extra chat time anytime</li>
                <li>✔️ ₹10 for 10 mins</li>
                <li>✔️ ₹25 for 30 mins</li>
                <li>✔️ Track your usage</li>
              </ul>
              <button className="bg-[#6a4eeb] text-white py-2 px-6 rounded-full font-medium hover:bg-[#5a3edc] transition">
                Buy Minutes
              </button>
            </div>

            {/* Premium Subscription */}
            <div className="bg-[#6a4eeb] text-white p-8 rounded-2xl shadow-lg transform scale-105 max-w-sm w-full">
              <h4 className="text-xl font-semibold mb-2">Premium Plan</h4>
              <p className="text-3xl font-bold mb-4">
                <CountUp end={99} prefix="₹" duration={2} />/month
              </p>
              <ul className="text-left space-y-3 text-sm mb-6">
                <li>✔️ Unlimited AI chatbot access</li>
                <li>✔️ Therapist consultations</li>
                <li>✔️ Priority chat support</li>
                <li>✔️ Wellness tracking & summaries</li>
                <li>✔️ Premium community circles</li>
              </ul>
              <button className="bg-white text-[#6a4eeb] py-2 px-6 rounded-full font-medium hover:bg-gray-100 transition">
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
