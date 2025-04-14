import { useEffect, useRef } from "react";

export default function Testimonial() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let scrollAmount = 0;
    let animationFrame;

    const animate = () => {
      scrollAmount += 0.5; // speed
      marquee.scrollLeft = scrollAmount;
      if (scrollAmount >= marquee.scrollWidth / 2) {
        scrollAmount = 0;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const testimonials = [
    { name: "Aarav Mehta", feedback: "Amazing experience! Highly recommended." },
    { name: "Ishita Verma", feedback: "Super helpful and very easy to use." },
    { name: "Rahul Sharma", feedback: "This changed how I approach mental wellness." },
    { name: "Priya Nair", feedback: "Mind Flow AIs is a game-changer!" },
    { name: "Kabir Rao", feedback: "Smooth UI and feels very personal." },
    { name: "Sneha Iyer", feedback: "I feel heard and supported here." },
    { name: "Ananya Das", feedback: "Love the animations and flow!" },
    { name: "Rohit Khanna", feedback: "Just what I needed—thank you!" },
  ];

  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <div id="testimonials" className="bg-[#f5f0ff] py-16 px-6">
      <h2 className="text-center text-3xl font-bold text-[#8f71ff] mb-12">
        What Our Users Say
      </h2>

      <div
        ref={marqueeRef}
        className="flex overflow-hidden whitespace-nowrap"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
        }}
      >
        {loopedTestimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md px-6 py-8 mx-4 sm:w-[18rem] md:w-[24rem] lg:w-[32rem] inline-block"
          >
            <div className="flex gap-1 text-yellow-500 mb-2">
              {Array(5)
                .fill(0)
                .map((_, j) => (
                  <svg
                    key={j}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967h4.175c.969 0 1.371 1.24.588 1.81l-3.379 2.455 1.287 3.966c.3.922-.755 1.688-1.54 1.117L10 13.011l-3.379 2.455c-.784.571-1.838-.195-1.539-1.117l1.287-3.966-3.379-2.455c-.784-.57-.38-1.81.588-1.81h4.175L9.05 2.927z" />
                  </svg>
                ))}
            </div>
            <p className="text-gray-700 text-base mb-4 break-words">
              "{t.feedback}"
            </p>
            <span className="text-sm font-semibold text-[#8f71ff]">
              — {t.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
