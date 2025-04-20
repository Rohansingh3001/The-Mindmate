import { FaHeadphones, FaHeartbeat, FaRegClock, FaRegThumbsUp } from 'react-icons/fa';
import { HiCheckCircle } from 'react-icons/hi';

export default function HardwareSection() {
  return (
    <section id="hardware" className="relative bg-[#f8f4ff] py-20 px-6 overflow-hidden">
      {/* Background "COMING SOON" text */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-extrabold text-[#c2baf9] opacity-20 rotate-[-10deg] tracking-wide select-none uppercase">
          Coming Soon
        </h1>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#6a4eeb] mb-4">
          Meet the MindMate Version S Speaker
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-10">
          Your personal wellness companion — the <b>MindMate Version S</b>, a pocket-sized speaker designed to help you stay emotionally balanced, calm, and connected, wherever you are.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition">
            <FaHeadphones className="text-4xl text-[#6a4eeb] mb-4" />
            <h3 className="text-xl font-semibold text-[#6a4eeb] mb-2">
              Real-Time Mood Tracking
            </h3>
            <p className="text-gray-700 text-sm">
              Listens to your voice patterns and tone to understand your mood and responds with personalized support.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition">
            <FaHeartbeat className="text-4xl text-[#6a4eeb] mb-4" />
            <h3 className="text-xl font-semibold text-[#6a4eeb] mb-2">
              Gentle Voice Support
            </h3>
            <p className="text-gray-700 text-sm">
              Offers calming affirmations, guided breathing, and friendly check-ins when you need them most.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition">
            <FaRegClock className="text-4xl text-[#6a4eeb] mb-4" />
            <h3 className="text-xl font-semibold text-[#6a4eeb] mb-2">
              Always With You
            </h3>
            <p className="text-gray-700 text-sm">
              Compact and wearable, this little speaker is designed to be your daily emotional support buddy — even offline.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-[#6a4eeb] mb-6">
            Perks of Having the MindMate Version S:
          </h3>
          <ul className="text-left space-y-4">
            <li className="flex items-center text-gray-700">
              <HiCheckCircle className="text-[#6a4eeb] mr-3 text-xl" />
              Seamless connection with your MindMate platform
            </li>
            <li className="flex items-center text-gray-700">
              <HiCheckCircle className="text-[#6a4eeb] mr-3 text-xl" />
              Supports both online and offline emotional assistance
            </li>
            <li className="flex items-center text-gray-700">
              <HiCheckCircle className="text-[#6a4eeb] mr-3 text-xl" />
              Compact design fits easily in your pocket or on your desk
            </li>
            <li className="flex items-center text-gray-700">
              <HiCheckCircle className="text-[#6a4eeb] mr-3 text-xl" />
              Helps reduce stress and anxiety with soothing sounds and guidance
            </li>
            <li className="flex items-center text-gray-700">
              <HiCheckCircle className="text-[#6a4eeb] mr-3 text-xl" />
              Long-lasting battery life for all-day support
            </li>
          </ul>
        </div>

        <div className="mt-16 bg-[#e8e4ff] py-12 px-6 rounded-xl shadow-lg">
          <h3 className="text-3xl font-semibold text-[#6a4eeb] mb-6">
            Why Should You Buy the MindMate Version S?
          </h3>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center max-w-xs">
              <FaRegThumbsUp className="text-5xl text-[#6a4eeb] mb-4" />
              <h4 className="text-xl font-semibold text-[#6a4eeb] mb-2">Improve Your Mental Well-being</h4>
              <p className="text-gray-700 text-sm">
                The MindMate helps you manage your emotional health with real-time support, keeping you balanced through life's ups and downs.
              </p>
            </div>

            <div className="text-center max-w-xs">
              <FaHeadphones className="text-5xl text-[#6a4eeb] mb-4" />
              <h4 className="text-xl font-semibold text-[#6a4eeb] mb-2">Stay Calm Anytime, Anywhere</h4>
              <p className="text-gray-700 text-sm">
                Whether you're at home or on the go, the MindMate is always ready to offer calming guidance and emotional support when you need it most.
              </p>
            </div>

            <div className="text-center max-w-xs">
              <FaHeartbeat className="text-5xl text-[#6a4eeb] mb-4" />
              <h4 className="text-xl font-semibold text-[#6a4eeb] mb-2">A Personal Wellness Companion</h4>
              <p className="text-gray-700 text-sm">
                Compact and portable, the MindMate fits into your everyday life, offering personalized assistance wherever you are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
