import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { getChatResponse } from '../services/geminiService';
import { Message, Sender } from '../types';
import Visualizer from '../components/Visualizer';

const Practice: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topic = searchParams.get('topic') || 'General Chat';
  
  const { settings, addPracticeTime } = useApp();
  const { isListening, transcript, startListening, stopListening, speak, isSpeaking, cancelSpeech, setTranscript } = useSpeech(settings.voiceAccent, settings.voiceSpeed);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
      addPracticeTime(sessionTime); // Save time on unmount
    };
  }, []);

  // Initial Greeting
  useEffect(() => {
    const initChat = async () => {
        setIsLoading(true);
        const greeting = await getChatResponse([], `Start a conversation about ${topic}.`, topic);
        const msg: Message = {
            id: Date.now().toString(),
            text: greeting,
            sender: Sender.AI,
            timestamp: Date.now()
        };
        setMessages([msg]);
        speak(greeting);
        setIsLoading(false);
    };
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  // Handle Speech Result
  useEffect(() => {
    if (!isListening && transcript) {
      setInputText(transcript);
    }
  }, [isListening, transcript]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (!textToSend) return;

    cancelSpeech(); // Stop AI if speaking

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: Sender.USER,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setTranscript('');
    setIsLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.sender === Sender.USER ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const responseText = await getChatResponse(history, textToSend, topic);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: Sender.AI,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
    speak(responseText);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">{topic}</h2>
          <span className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </span>
        </div>
        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-300">
          {formatTime(sessionTime)}
        </div>
        <button 
          onClick={() => navigate('/pronunciation')} 
          className="text-xs text-primary hover:underline"
        >
          Analyze Grammar
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                msg.sender === Sender.USER
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
              }`}
            >
              {msg.text}
              {msg.sender === Sender.AI && (
                  <button 
                    onClick={() => speak(msg.text)} 
                    className="ml-2 inline-block opacity-50 hover:opacity-100"
                    title="Replay"
                  >
                    🔊
                  </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
        
        {/* Visualizer when listening */}
        <div className="h-6 mb-2">
           <Visualizer isActive={isListening || isSpeaking} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse-fast shadow-red-200 shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Type or speak..."}
            className="flex-1 bg-gray-50 dark:bg-gray-900 border-none outline-none rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() && !isListening}
            className={`p-3 rounded-xl transition-colors ${
                inputText.trim() 
                ? 'bg-primary text-white hover:bg-indigo-700' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;