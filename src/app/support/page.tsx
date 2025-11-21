'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/custom/navigation';
import { getCurrentUser, updateMoodScore } from '@/lib/auth';
import { Smile, Send, Loader2, Heart, Wind } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SupportPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workouts' | 'calories' | 'support' | 'profile'>('support');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente de bem-estar. Como você está se sentindo hoje? 😊',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive) {
      let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
      let count = 0;
      interval = setInterval(() => {
        count++;
        if (count <= 4) {
          phase = 'inhale';
        } else if (count <= 7) {
          phase = 'hold';
        } else if (count <= 11) {
          phase = 'exhale';
        } else {
          count = 0;
          phase = 'inhale';
        }
        setBreathPhase(phase);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const loadData = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser();
      if (error || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: typeof currentPage) => {
    if (page === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Entendo como você se sente. Lembre-se de que cada dia é uma nova oportunidade para cuidar de si mesmo. 💚',
        'Que bom ouvir isso! Continue assim, você está no caminho certo. 🌟',
        'É normal ter dias difíceis. O importante é não desistir. Estou aqui para ajudar! 🤗',
        'Sua saúde mental é tão importante quanto a física. Que tal fazer um exercício de respiração? 🧘',
        'Você está fazendo um ótimo trabalho! Continue se dedicando ao seu bem-estar. 💪',
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSending(false);
    }, 1500);
  };

  const handleMoodSelect = async (mood: number) => {
    setSelectedMood(mood);
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      await updateMoodScore(user.id, today, mood);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#A084FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-gradient-to-b from-black to-transparent backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#A084FF]/20 flex items-center justify-center">
              <Smile className="w-6 h-6 text-[#A084FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bem-estar</h1>
              <p className="text-sm text-gray-400">Cuide da sua mente</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        {/* Mood Tracker */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Como você está hoje?</h2>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={`flex-1 aspect-square rounded-2xl transition-all duration-300 ${
                    selectedMood === mood
                      ? 'bg-[#A084FF] scale-110'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-3xl">
                    {mood === 1 ? '😢' : mood === 2 ? '😕' : mood === 3 ? '😐' : mood === 4 ? '😊' : '😄'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Breathing Exercise */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Exercício de Respiração</h2>
          <div className="bg-gradient-to-br from-[#A084FF]/10 to-[#A084FF]/5 border border-[#A084FF]/20 rounded-2xl p-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#A084FF] to-[#8866DD] transition-all duration-1000 ${
                  breathingActive
                    ? breathPhase === 'inhale'
                      ? 'scale-100'
                      : breathPhase === 'hold'
                      ? 'scale-100'
                      : 'scale-50'
                    : 'scale-75'
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Wind className="w-12 h-12 text-white" />
              </div>
            </div>
            <p className="text-lg font-semibold mb-2 text-[#A084FF]">
              {breathingActive
                ? breathPhase === 'inhale'
                  ? 'Inspire (4s)'
                  : breathPhase === 'hold'
                  ? 'Segure (3s)'
                  : 'Expire (4s)'
                : 'Pronto para começar?'}
            </p>
            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-[#A084FF] to-[#8866DD] rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              {breathingActive ? 'Parar' : 'Iniciar'}
            </button>
          </div>
        </section>

        {/* Chat with AI */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Chat de Apoio</h2>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#A084FF] text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-[#A084FF]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-700 p-4 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A084FF]"
              />
              <button
                type="submit"
                disabled={sending || !inputMessage.trim()}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A084FF] to-[#8866DD] flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </section>

        {/* Quick Tips */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Dicas de Bem-estar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
              <Heart className="w-8 h-8 mb-3 text-[#FF6B6B]" />
              <h3 className="font-semibold mb-2">Pratique Gratidão</h3>
              <p className="text-sm text-gray-400">
                Liste 3 coisas pelas quais você é grato hoje
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
              <Wind className="w-8 h-8 mb-3 text-[#00E5C9]" />
              <h3 className="font-semibold mb-2">Respire Fundo</h3>
              <p className="text-sm text-gray-400">
                5 minutos de respiração consciente por dia
              </p>
            </div>
          </div>
        </section>
      </main>

      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
