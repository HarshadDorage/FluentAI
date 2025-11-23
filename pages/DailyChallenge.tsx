import React, { useState, useEffect } from 'react';
import { generateDailyChallenges } from '../services/geminiService';
import { DailyChallenge as IDailyChallenge } from '../types';
import { useSpeech } from '../hooks/useSpeech';

const DailyChallenge: React.FC = () => {
  const [challenges, setChallenges] = useState<IDailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { isListening, transcript, startListening, stopListening } = useSpeech();
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have today's challenges in local storage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('daily_challenges');
    const storedDate = localStorage.getItem('daily_challenges_date');

    if (stored && storedDate === today) {
      setChallenges(JSON.parse(stored));
      setLoading(false);
    } else {
      fetchNewChallenges();
    }
  }, []);

  const fetchNewChallenges = async () => {
    setLoading(true);
    const newChallenges = await generateDailyChallenges();
    setChallenges(newChallenges);
    localStorage.setItem('daily_challenges', JSON.stringify(newChallenges));
    localStorage.setItem('daily_challenges_date', new Date().toDateString());
    setLoading(false);
  };

  const verifyChallenge = (id: string, text: string) => {
      // Simple verification: length check or keyword match would go here.
      // For this demo, we mark as done if they spoke enough words.
      if (text.split(' ').length > 3) {
          const updated = challenges.map(c => c.id === id ? { ...c, completed: true } : c);
          setChallenges(updated);
          localStorage.setItem('daily_challenges', JSON.stringify(updated));
          setActiveChallengeId(null);
      }
  };

  useEffect(() => {
      if (!isListening && transcript && activeChallengeId) {
          verifyChallenge(activeChallengeId, transcript);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Challenges</h2>
          <p className="text-gray-500">Complete 5 tasks to keep your streak!</p>
        </div>
        <button 
            onClick={fetchNewChallenges} 
            className="text-sm text-primary hover:underline"
            disabled={loading}
        >
            Refresh Tasks
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
                key={challenge.id}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                    challenge.completed 
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 opacity-75' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
                }`}
            >
              <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 ${
                        challenge.type === 'speak' ? 'bg-blue-100 text-blue-700' :
                        challenge.type === 'translate' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                        {challenge.type}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{challenge.question}</h3>
                    {activeChallengeId === challenge.id && (
                        <p className="text-primary mt-2 text-sm animate-pulse">Listening... {transcript}</p>
                    )}
                  </div>
                  
                  {challenge.completed ? (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                          ✓
                      </div>
                  ) : (
                      <button 
                        onClick={() => {
                            if (activeChallengeId === challenge.id) {
                                stopListening();
                                setActiveChallengeId(null);
                            } else {
                                setActiveChallengeId(challenge.id);
                                startListening();
                            }
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors ${
                            activeChallengeId === challenge.id ? 'bg-red-500' : 'bg-primary hover:bg-indigo-700'
                        }`}
                      >
                          {activeChallengeId === challenge.id ? 'Stop' : 'Start'}
                      </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;