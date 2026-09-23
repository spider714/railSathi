import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2, RefreshCw, Lightbulb, Globe } from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { cn } from '@/utils/cn';
import { useLanguageStore } from '@/store/language';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

interface AiAssistantPanelProps {
  journey?: LiveJourney;
}

const PROMPTS_EN = [
  '🍱 Food recommendations at upcoming stations?',
  '⏱️ Will delay increase or decrease?',
  '🏔️ Scenic highlights on this route?',
  '🚉 Station facilities & waiting rooms info',
];

const PROMPTS_HI = [
  '🍱 आगामी स्टेशनों पर भोजन की सिफारिशें?',
  '⏱️ क्या देरी बढ़ेगी या घटेगी?',
  '🏔️ इस मार्ग के प्रमुख दृश्य?',
  '🚉 स्टेशन सुविधाएं और प्रतीक्षालय की जानकारी',
];

export function AiAssistantPanel({ journey }: AiAssistantPanelProps) {
  const { language, toggleLanguage } = useLanguageStore();
  const isHi = language === 'hi';

  const defaultPrompts = isHi ? PROMPTS_HI : PROMPTS_EN;

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: journey
        ? isHi
          ? `नमस्ते! मैं **RailSathi AI** हूँ, **${journey.name} (#${journey.number})** के लिए आपका डिजिटल यात्रा साथी।\n\nमुझसे अपने मार्ग के भोजन स्टॉप, देरी के पूर्वानुमान, स्टेशन सुविधाओं या सुंदर दृश्यों के बारे में पूछें!`
          : `Hello! I am **RailSathi AI**, your intelligent travel companion for **${journey.name} (#${journey.number})**.\n\nAsk me about food stops, delay insights, station facilities, or scenic views along your route!`
        : isHi
        ? `नमस्ते! मैं **RailSathi AI** हूँ, आपका ट्रेन यात्रा सहायक।\n\nमुझसे ट्रेन यात्रा, भोजन सिफारिशों, देरी के पूर्वानुमान या स्टेशन सुविधाओं के बारे में हिंदी या अंग्रेजी में पूछें!`
        : `Hello! I am **RailSathi AI**, your Indian Railways travel assistant.\n\nAsk me anything about train journeys, e-catering, delay predictions, or station facilities!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          trainId: journey?.number || journey?.trainId,
          language,
          history: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const assistantMsg: AiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: data.data.answer,
          isFallback: data.data.isFallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: isHi
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
            : 'I ran into an issue getting insights right now. Please try again shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel flex flex-col rounded-3xl overflow-hidden shadow-glass border border-rose-500/20 h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-rose-500/10 via-background to-background border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rail-blue text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              RailSathi AI Companion
              <span className="rounded-full bg-rose-500/15 border border-rose-500/30 text-rail-blue text-[10px] font-extrabold px-2 py-0.5">
                Gemini AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isHi
                ? 'वास्तविक समय यात्रा सिफारिशें और देरी पूर्वानुमान'
                : 'Real-time travel recommendations & delay intelligence'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-rail-blue hover:text-white transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
            title="Switch language / भाषा बदलें"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{isHi ? 'हिंदी' : 'EN'}</span>
          </button>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome',
                  role: 'assistant',
                  text: journey
                    ? isHi
                      ? `चैट रीसेट हो गई! **${journey.name} (#${journey.number})** के बारे में कुछ भी पूछें।`
                      : `Chat reset! Ask me anything about **${journey.name} (#${journey.number})**.`
                    : isHi
                    ? 'चैट रीसेट हो गई! ट्रेन यात्रा के बारे में पूछें।'
                    : 'Chat reset! Ask me anything about Indian Railways travel.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg"
            title="Clear Chat"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex items-start gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm',
                msg.role === 'user'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'bg-rail-blue text-white'
              )}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={cn(
                'max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed space-y-1 shadow-sm',
                msg.role === 'user'
                  ? 'bg-rail-blue text-white rounded-tr-xs'
                  : 'glass-panel border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
              )}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
              <div
                className={cn(
                  'text-[10px] text-right font-medium opacity-70',
                  msg.role === 'user' ? 'text-rose-100' : 'text-slate-400'
                )}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rail-blue text-white text-xs font-bold animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div className="glass-panel rounded-2xl p-3.5 rounded-tl-xs border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-rail-blue" />
              <span>
                {isHi
                  ? 'RailSathi AI ट्रेन स्थिति और मार्ग का विश्लेषण कर रहा है...'
                  : 'RailSathi AI is analyzing train status & route...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-4 py-2 bg-slate-500/5 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-2 text-[11px] whitespace-nowrap">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
          {defaultPrompts.map((promptText, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSend(promptText)}
              className="rounded-full bg-slate-200/70 dark:bg-slate-800/70 px-3 py-1 text-slate-700 dark:text-slate-300 hover:bg-rail-blue hover:text-white transition-colors flex-shrink-0 font-medium"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-background border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isHi
              ? 'भोजन, देरी, दृश्यों, सुविधाओं के बारे में पूछें...'
              : 'Ask RailSathi AI about food, delays, scenic spots...'
          }
          className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rail-blue/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-rail-blue text-white font-bold shadow-glow hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-rail-blue transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
