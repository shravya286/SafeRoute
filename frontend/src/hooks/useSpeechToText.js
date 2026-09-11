import { useState, useEffect, useRef } from 'react';

export function useSpeechToText(lang = 'en-US') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [lang]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
}
