import React, { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { analyzePronunciation } from '../services/geminiService';
import { PronunciationResult } from '../types';
import { useApp } from '../context/AppContext';

const Pronunciation: React.FC = () => {
  const { settings, saveConversationScore } = useApp();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeech(settings.voiceAccent);
  
  const [targetText, setTargetText] = useState("");
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
     if(!isListening && transcript.length > 5) {
         handleAnalyze();
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const handleAnalyze = async () => {
    if (!transcript) return;
    setIsAnalyzing(true);
    
    // If user typed a target sentence, pass it. Otherwise, free analysis.
    const res = await analyzePronunciation(transcript, targetText || undefined);
    setResult(res);
    saveConversationScore(res.fluencyScore);
    
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pronunciation Lab</h2>
        <p className="text-gray-500">Speak a sentence or paste one to practice.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Sentence (Optional)</label>
            <input 
                type="text" 
                value={targetText}
                onChange={(e) => setTargetText(e.target.value)}
                placeholder="e.g. The quick brown fox jumps over the lazy dog."
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>

        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
           {transcript ? (
               <p className="text-xl text-center font-medium text-gray-800 dark:text-gray-200 px-4">"{transcript}"</p>
           ) : (
               <p className="text-gray-400">Press mic to start speaking...</p>
           )}
        </div>

        <div className="flex justify-center">
            <button
                onClick={isListening ? stopListening : startListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30' : 'bg-primary hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
                }`}
            >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="text-center text-primary animate-pulse font-medium">Analyzing speech patterns...</div>
      )}

      {result && !isAnalyzing && (
        <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <div className="text-sm text-gray-500">Overall</div>
                    <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>{result.score}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <div className="text-sm text-gray-500">Fluency</div>
                    <div className={`text-3xl font-bold ${getScoreColor(result.fluencyScore)}`}>{result.fluencyScore}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <div className="text-sm text-gray-500">Grammar</div>
                    <div className={`text-3xl font-bold ${getScoreColor(result.pronunciationScore)}`}>{result.pronunciationScore}</div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Feedback</h4>
                    <p className="text-gray-600 dark:text-gray-300">{result.feedback}</p>
                </div>
                
                {result.mistakes.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-red-500 mb-2">Areas for Improvement</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {result.mistakes.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                )}

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 text-sm mb-1">Better Version</h4>
                    <p className="text-green-900 dark:text-green-100 italic">"{result.correctedVersion}"</p>
                </div>
            </div>
            
            <button 
                onClick={() => { setResult(null); setTranscript(''); }}
                className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
                Try Another
            </button>
        </div>
      )}
    </div>
  );
};

export default Pronunciation;