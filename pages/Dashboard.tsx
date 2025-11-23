import React from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const { stats, settings, updateSettings } = useApp();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  // Mock data filling if history is empty
  const chartData = stats.fluencyHistory.length > 0 
    ? stats.fluencyHistory 
    : [{date: 'Start', score: 0}];

  const weeklyData = [
    { name: 'Mon', hours: 0.5 },
    { name: 'Tue', hours: 1.2 },
    { name: 'Wed', hours: 0.8 },
    { name: 'Thu', hours: stats.totalTimePracticed / 3600 },
    { name: 'Fri', hours: 0 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Progress</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Time</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(stats.totalTimePracticed)}</div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Streak</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak} Days 🔥</div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Avg Score</div>
          <div className="text-2xl font-bold text-green-500">
            {stats.fluencyHistory.length > 0 
               ? Math.round(stats.fluencyHistory.reduce((a, b) => a + b.score, 0) / stats.fluencyHistory.length) 
               : 0}
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Topics</div>
            <div className="text-2xl font-bold text-primary">{stats.topicsCompleted}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fluency Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Fluency History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, fill:'#4F46E5'}} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Weekly Activity (Hours)</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="hours" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Settings Section (Simplified) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Preferences</h3>
          <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Voice Speed ({settings.voiceSpeed}x)</label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={settings.voiceSpeed}
                    onChange={(e) => updateSettings({ voiceSpeed: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
              </div>
              <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accent</label>
                  <select 
                    value={settings.voiceAccent}
                    onChange={(e) => updateSettings({ voiceAccent: e.target.value })}
                    className="w-full p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  >
                      <option value="en-US">American English</option>
                      <option value="en-GB">British English</option>
                      <option value="en-AU">Australian English</option>
                  </select>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;