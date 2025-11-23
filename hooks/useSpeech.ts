import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeech = (language: string = 'en-US', rate: number = 1) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Easier to manage state
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => setIsListening(true);
      
      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
            setTranscript(final);
        }
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript(''); // Clear previous
      try {
          recognitionRef.current.start();
      } catch (e) {
          // If already started, stop first
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 100);
      }
    } else {
      alert("Speech Recognition not supported in this browser.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthesisRef.current) return;
    
    // Cancel current speaking
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, [language, rate]);

  const cancelSpeech = () => {
      if(synthesisRef.current) synthesisRef.current.cancel();
      setIsSpeaking(false);
  }

  return {
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    cancelSpeech
  };
};