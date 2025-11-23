import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-12 animate-fade-in pb-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Master English with <span className="text-primary">AI</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Improve your fluency, pronunciation, and confidence with real-time AI conversation practice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/topics')}
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Start Practicing
          </button>
          <button
             onClick={() => navigate('/dashboard')}
             className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-semibold rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            View Progress
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Real-time Conversations",
            desc: "Chat with an AI that adapts to your level and topic of choice.",
            icon: "💬",
            color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
          },
          {
            title: "Pronunciation Fixer",
            desc: "Get instant feedback on your grammar and pronunciation.",
            icon: "🎙️",
            color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
          },
          {
            title: "Daily Challenges",
            desc: "Fresh tasks every day to keep your learning streak alive.",
            icon: "📅",
            color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
          }
        ].map((feature, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Quick Access Topics */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Topics</h2>
          <button onClick={() => navigate('/topics')} className="text-primary font-medium hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Job Interview', 'Travel', 'Restaurant', 'Small Talk'].map((t) => (
            <div 
              key={t}
              onClick={() => navigate(`/practice?topic=${t}`)}
              className="cursor-pointer p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary transition group"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{t}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;