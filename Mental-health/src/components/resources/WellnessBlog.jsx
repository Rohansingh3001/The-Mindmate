import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import { ArrowLeft } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Coping With Exam Stress",
    summary:
      "Practical steps to manage anxiety during exam season and perform your best.",
    date: subDays(new Date(), 3),
  },
  {
    id: 2,
    title: "Why Sleep Matters",
    summary:
      "Learn why restful sleep is essential for your mental well-being and how to improve it.",
    date: subDays(new Date(), 10),
  },
  {
    id: 3,
    title: "Building Healthy Relationships",
    summary:
      "Core communication tips to support healthier connections with friends and family.",
    date: subDays(new Date(), 20),
  },
];

export default function WellnessBlog() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-gray-900 dark:text-gray-100 space-y-14">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-600 hover:underline mb-4"
      >
        <ArrowLeft size={16} /> Go Back
      </button>

      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-5xl font-bold text-purple-700 dark:text-purple-300">
          Wellness Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Expert insights and real-world tips for living with balance — mind,
          body, and soul.
        </p>
      </header>

      {/* Blog Cards */}
      <section className="grid md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-700 rounded-xl shadow-sm hover:shadow-lg transition-all p-6 space-y-4"
          >
            <header>
              <Link to={`/blog/${post.id}`}>
                <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">
                  {post.title}
                </h2>
              </Link>
              <time className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
                {format(post.date, "PPP")}
              </time>
            </header>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {post.summary}
            </p>
            <Link
              to={`/blog/${post.id}`}
              className="inline-block text-sm font-medium text-purple-600 dark:text-purple-300 hover:underline"
            >
              Read More →
            </Link>
          </article>
        ))}
      </section>

      {/* Contribution Note */}
      <div className="text-center pt-8 text-sm text-gray-500 dark:text-gray-400">
        Want to contribute?{" "}
        <Link
          to="/contact"
          className="underline text-purple-600 dark:text-purple-300"
        >
          Reach out
        </Link>{" "}
        with your ideas or guest post pitch.
      </div>
    </div>
  );
}
