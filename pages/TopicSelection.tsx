import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topic } from '../types';

const topics: Topic[] = [
  { id: '1', title: 'Daily Conversation', description: 'Casual chat about life, hobbies, and interests.', icon: '👋', difficulty: 'Beginner', color: 'bg-blue-500' },
  { id: '2', title: 'Job Interview', description: 'Practice answering common interview questions.', icon: '💼', difficulty: 'Advanced', color: 'bg-indigo-500' },
  { id: '3', title: 'Travel & Directions', description: 'Asking for directions, booking hotels, airports.', icon: '✈️', difficulty: 'Intermediate', color: 'bg-green-500' },
  { id: '4', title: 'Restaurant', description: 'Ordering food, asking for bill, dietary needs.', icon: '🍔', difficulty: 'Beginner', color: 'bg-orange-500' },
  { id: '5', title: 'Office Work', description: 'Meetings, emails, and professional etiquette.', icon: '🏢', difficulty: 'Intermediate', color: 'bg-slate-500' },
  { id: '6', title: 'Movies & TV', description: 'Discussing entertainment and pop culture.', icon: '🎬', difficulty: 'Intermediate', color: 'bg-red-500' },
  { id: '7', title: 'Debate', description: 'Argue a point of view on a specific subject.', icon: '⚖️', difficulty: 'Advanced', color: 'bg-purple-500' },
  { id: '8', title: 'Shopping', description: 'Buying clothes, bargaining, returning items.', icon: '🛍️', difficulty: 'Beginner', color: 'bg-pink-500' },
];

const TopicSelection: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose a Topic</h2>
          <p className="text-gray-500 dark:text-gray-400">Select a scenario to start practicing.</p>
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => navigate(`/practice?topic=${encodeURIComponent(topic.title)}`)}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${topic.color}`}></div>
            
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{topic.icon}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                ${topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                  topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                {topic.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{topic.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{topic.description}</p>
            
            <div className="mt-6 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Start Conversation 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        ))}

        {/* Random Topic Card */}
        <div
            onClick={() => navigate(`/practice?topic=Random`)}
            className="group flex flex-col items-center justify-center bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white text-center"
          >
            <span className="text-4xl mb-4">🎲</span>
            <h3 className="text-xl font-bold mb-2">Random Topic</h3>
            <p className="text-indigo-100 text-sm">Let AI decide what to talk about!</p>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;