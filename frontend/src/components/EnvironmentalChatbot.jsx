import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Mic, MicOff, Shield, Key, Settings, Check } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

export default function EnvironmentalChatbot({ t, lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "🌿 **Hello! I am your Environmental Safety Assistant.**\n\nAsk me anything about weather conditions (e.g. *\"hows the weather in Kumta\"*), outdoor gear, UV/AQI advice, or safety protocols!\n\n💡 *Click the ⚙️ Key icon above to paste your Gemini API Key for full conversational AI!*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechToText(
    lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : lang === 'ja' ? 'ja-JP' : lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US'
  );

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('abhayasetu_gemini_key');
      if (storedKey) setGeminiKey(storedKey);
    } catch (e) {
      console.warn('Failed to load gemini key:', e);
    }
  }, []);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const saveGeminiKey = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('abhayasetu_gemini_key', geminiKey.trim());
      setKeySaved(true);
      setTimeout(() => {
        setKeySaved(false);
        setShowSettings(false);
      }, 1200);
    } catch (err) {
      console.warn('Key save error:', err);
    }
  };

  const handleSendMessage = async (customText) => {
    let textToSend = '';
    if (typeof customText === 'string') {
      textToSend = customText;
    } else {
      textToSend = inputMessage;
    }

    if (!textToSend || typeof textToSend !== 'string' || !textToSend.trim()) return;
    const cleanText = textToSend.trim();

    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          apiKey: geminiKey.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botReply = {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: data.reply,
          provider: data.provider,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botReply]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Chat server fallback engaged:', err);
    }

    // Local response fallback
    setTimeout(() => {
      const localReplyText = generateClientNlpReply(cleanText);
      const botReply = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: localReplyText,
        provider: 'AbhayaSetu AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 400);
  };

  const presetPrompts = [
    "Hows the weather in Kumta?",
    "What gear to pack for high-wind hiking?",
    "How does UV Index affect sun safety?",
    "Action rules during a Flash Flood"
  ];

  return (
    <>
      {/* Floating Chatbot Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            zIndex: 3000,
            backgroundColor: 'var(--accent-primary)',
            color: '#FFFFFF',
            borderRadius: '50px',
            padding: '12px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '800',
            fontSize: 'var(--text-xs)',
            transition: 'all 0.2s ease',
            border: '2px solid rgba(255,255,255,0.4)'
          }}
        >
          <Bot size={22} />
          <span>Ask Environmental AI</span>
          <span style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
            boxShadow: '0 0 8px #4CAF50'
          }} />
        </button>
      )}

      {/* Floating Chat Window Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: 'calc(100vw - 40px)',
          maxWidth: '430px',
          height: '560px',
          maxHeight: 'calc(100vh - 120px)',
          backgroundColor: 'var(--bg-base)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: '16px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
          zIndex: 3000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'var(--surface)',
            borderBottom: 'var(--border-subtle)',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFF',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                  Environmental AI Assistant
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={10} style={{ color: 'var(--accent-primary)' }} />
                  {geminiKey ? 'Gemini AI Active' : 'Live Sensor & AI Engine'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  color: geminiKey ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: '50%',
                  backgroundColor: showSettings ? 'var(--surface-alt)' : 'transparent'
                }}
                title="Configure Gemini API Key"
              >
                <Settings size={18} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{ color: 'var(--text-secondary)', padding: '6px', borderRadius: '50%' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Gemini Key Settings Bar */}
          {showSettings && (
            <form onSubmit={saveGeminiKey} style={{
              backgroundColor: 'var(--surface-alt)',
              padding: '10px 14px',
              borderBottom: 'var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={13} style={{ color: 'var(--accent-primary)' }} />
                <span>Paste Your Google Gemini API Key:</span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="password"
                  className="input-textarea"
                  style={{ minHeight: '34px', height: '34px', padding: '0 10px', fontSize: '11px' }}
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '11px' }}>
                  {keySaved ? <Check size={14} /> : 'Save'}
                </button>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-primary)', opacity: 0.8 }}>
                Get a free key from Google AI Studio (aistudio.google.com)
              </span>
            </form>
          )}

          {/* Messages History Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'var(--bg-base)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={16} />
                  </div>
                )}

                <div style={{
                  backgroundColor: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--surface)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  border: msg.sender === 'user' ? 'none' : 'var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: 'var(--text-xs)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  <div>{msg.text}</div>
                  <div style={{
                    fontSize: '9px',
                    opacity: 0.7,
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <span>{msg.provider ? `• ${msg.provider}` : ''}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-alt)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <Bot size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>AI Assistant is analyzing environmental data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: 'var(--surface)',
            borderTop: 'var(--border-subtle)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {presetPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                style={{
                  fontSize: '10px',
                  backgroundColor: 'var(--bg-base)',
                  border: 'var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px',
              backgroundColor: 'var(--surface)',
              borderTop: 'var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* Mic Input Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`btn-mic ${isListening ? 'listening' : ''}`}
              style={{ padding: '8px' }}
              title={isSupported ? "Speak voice message" : "Voice not supported"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              className="input-textarea"
              style={{ minHeight: '38px', height: '38px', padding: '0 12px', borderRadius: '20px', flex: 1 }}
              placeholder={isListening ? "Listening..." : "Ask about weather in Kumta, gear, UV, AQI..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="btn-primary"
              style={{ padding: '8px 14px', borderRadius: '20px' }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function generateClientNlpReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes('gear') || lower.includes('pack') || lower.includes('bring') || lower.includes('clothes') || lower.includes('wear')) {
    return "🎒 **Recommended Outdoor Gear Guidelines:**\n- **High-Wind/Cold**: Layer up with windproof hardshell jacket, thermal base layers, wool socks, and polarized UV sunglasses.\n- **Rain/Storms**: Waterproof Gore-Tex jacket, dry-bag backpack liner, trail boots with aggressive rubber traction.\n- **Hot/Sunny**: Moisture-wicking shirt, broad-brim hat, SPF 50+ sunscreen, electrolyte hydration packs.\n- **Essential Safety Pack**: Satellite beacon/powerbank, first aid kit, headlamp, and offline topographic maps.";
  }

  if (lower.includes('uv') || lower.includes('sun') || lower.includes('burn') || lower.includes('sunscreen')) {
    return "☀️ **UV Index & Sun Protection Guide:**\n- **UV 0-2 (Low)**: Minimal protection needed.\n- **UV 3-5 (Moderate)**: Wear sunglasses and apply SPF 30+ sunscreen if outside for >45 mins.\n- **UV 6-7 (High)**: Wear a wide hat, UV-blocking sunglasses, and reapply SPF 50 every 2 hours.\n- **UV 8+ (Very High/Extreme)**: Avoid direct sun exposure between 10:00 AM and 4:00 PM. Seek shade and cover exposed skin.";
  }

  if (lower.includes('aqi') || lower.includes('air quality') || lower.includes('pollution') || lower.includes('smog') || lower.includes('smoke')) {
    return "🫁 **Air Quality Index (AQI) Health Advice:**\n- **0-50 (Good)**: Air quality is satisfactory; enjoy outdoor sports.\n- **51-100 (Moderate)**: Sensitive individuals should consider reducing prolonged outdoor exertion.\n- **101-150 (Unhealthy for Sensitive Groups)**: Wear N95 masks outdoors if sensitive to PM2.5.\n- **151-200+ (Unhealthy/Hazardous)**: Avoid strenuous outdoor activities. Run HEPA air purifiers indoors and close windows.";
  }

  if (lower.includes('earthquake') || lower.includes('quake') || lower.includes('tremor') || lower.includes('shake')) {
    return "⚡ **Earthquake Action Protocol:**\n1. **Drop, Cover, and Hold On**: Get down on your hands and knees under a sturdy table.\n2. **Protect Head**: Cover your head and neck with your arms.\n3. **Stay Indoors**: Do not run outside during shaking to avoid falling glass and debris.\n4. **Aftershocks**: Be prepared for secondary tremors; check gas valves if safe.";
  }

  if (lower.includes('flood') || lower.includes('water') || lower.includes('drown') || lower.includes('rain')) {
    return "🌊 **Flash Flood Survival Rule:**\n- **Turn Around, Don't Drown!**: Just 6 inches of moving water can knock you down, and 12 inches can sweep away a car.\n- **Move to High Ground**: Never camp or park near dry riverbeds or drainage basins during storm alerts.\n- **Utilities**: Shut off main power breakers if floodwaters enter your dwelling.";
  }

  return "👋 Hello! I am the **AbhayaSetu Environmental AI Assistant**.\n\nAsk me about:\n• Live weather for any location (e.g. *\"hows the weather in Kumta\"*)\n• Outdoor hiking gear & clothing recommendations\n• UV Index & Air Quality (AQI) advice\n• Flood & Earthquake survival rules\n\n💡 *Tip: Paste your Gemini API Key in the Chatbot settings (⚙️ icon) to unlock full conversational AI capabilities!*";
}
