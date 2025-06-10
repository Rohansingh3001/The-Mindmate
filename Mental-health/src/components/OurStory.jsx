import React from "react";
import { motion } from "framer-motion";
import {
  HeartCrack,
  Sparkles,
  Eye,
  Handshake,
  Languages,
  Bot,
  Users,
  ShieldCheck,
} from "lucide-react";

const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const icons = {
  "A Generation Under Pressure": <HeartCrack className="text-indigo-600 w-6 h-6" />,
  "Our Mission": <Sparkles className="text-indigo-600 w-6 h-6" />,
  "Our Vision": <Eye className="text-indigo-600 w-6 h-6" />,
  "Our Commitments": <Handshake className="text-indigo-600 w-6 h-6" />,
};

const whyUsItems = [
  {
    title: "Multilingual Support",
    description: "Mental health care in Hindi, Tamil, and English to ensure everyone can express themselves freely.",
    icon: <Languages className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "AI + Human Touch",
    description: "Smart chatbot for instant help, backed by real human therapists and community support.",
    icon: <Bot className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Community Driven",
    description: "A safe space for peer conversations, shared healing, and collective growth.",
    icon: <Users className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Privacy First",
    description: "Secure conversations, anonymous support, and data handled with complete care.",
    icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
  },
];

const OurStory = () => {
  const sections = [
    {
      title: "A Generation Under Pressure",
      content: `In today’s fast-paced world, stress isn’t limited to one phase of life — it’s everywhere. Teenagers are burdened with unrealistic expectations, social pressure, and constant comparison. College students juggle academics, placements, and personal identity struggles while feeling isolated in crowded campuses. Corporate employees face burnout, long hours, and a work culture that often glorifies overexertion. Competitive exam aspirants battle anxiety, fear of failure, and loneliness in silence. As we chase marks, money, and milestones, we’re unknowingly degrading the most crucial asset we have — our mental health. Mind Mates was born to flip this narrative, to say: it’s okay to not be okay, and even better to do something about it.`,
    },
    {
      title: "Our Mission",
      content: `At Mind Mates, our mission is to democratize access to compassionate, intelligent mental health support. We aim to build a safe ecosystem where every individual — regardless of language, background, or geography — can find someone (or something) to talk to, lean on, and grow with. Through empathetic AI, human connection, and innovative technology, we strive to empower people to take control of their mental well-being and break the stigma around seeking help.`,
    },
    {
      title: "Our Vision",
      content: `We envision a world where mental health care is not a privilege, but a basic right — a world where your location doesn’t decide your access to healing. Our goal is to become India’s most trusted mental wellness companion, seamlessly blending AI-driven support, peer connection, and professional care. From a college hostel in Bihar to a startup office in Bangalore, Mind Mates will be there — listening, learning, and lifting lives.`,
    },
    {
      title: "Our Commitments",
      content: `We are committed to building a platform grounded in empathy, ethics, and inclusivity. We will continuously listen to our users, evolve with science-backed practices, and maintain transparency in how our AI and data function. Above all, we commit to never replacing the human element in healing — only enhancing it. Our promise is simple: to be there when you need us most, without judgment, without delay.`,
    },
  ];

  return (
    <section
      className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 bg-gradient-to-br from-[#f4edfc] to-[#e7ddfb]"
      id="our-story"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-purple-800 drop-shadow-sm mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          🧾 Our Story
        </motion.h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            className="bg-white rounded-xl shadow-md p-6 sm:p-8 hover:shadow-lg transition-all duration-300 border border-purple-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
            variants={sectionFade}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-2 flex items-center gap-3">
              {icons[section.title]}
              {section.title}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed tracking-wide">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Why Us Section */}
      <div className="max-w-4xl mx-auto text-center mt-20">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-purple-800 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🌟 Why Choose Mind Mates?
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        {whyUsItems.map((item, index) => (
          <motion.div
            key={item.title}
            className="bg-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg transition-all duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
            variants={sectionFade}
          >
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
              <h3 className="text-lg font-semibold text-indigo-700">
                {item.title}
              </h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurStory;
