'use client';

import { useState } from 'react';
import { Navigation } from '@/components/custom/navigation';
import { mockDailyStats, mockUserProfile } from '@/lib/mock-data';
import { Activity, Flame, Droplet, Smile, TrendingUp, Award } from 'lucide-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workouts' | 'calories' | 'support' | 'profile'>('dashboard');

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-black to-transparent backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00E5C9] to-[#00B8A3] bg-clip-text text-transparent">
                TotalMe
              </h1>
              <p className="text-sm text-gray-400 mt-1">Olá, {mockUserProfile.name}! 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5C9] to-[#00B8A3] flex items-center justify-center text-black font-bold">
                {mockUserProfile.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            {/* Daily Progress Overview */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Seu Progresso Hoje</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Calories Card */}
                <div className="bg-gradient-to-br from-[#66FF66]/10 to-[#66FF66]/5 border border-[#66FF66]/20 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#66FF66]/20 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-[#66FF66]" />
                    </div>
                    <span className="text-sm text-gray-400">Calorias</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#66FF66]">{mockDailyStats.caloriesConsumed}</span>
                      <span className="text-sm text-gray-500">/ {mockDailyStats.caloriesGoal}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#66FF66] to-[#44DD44] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(mockDailyStats.caloriesConsumed / mockDailyStats.caloriesGoal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Workouts Card */}
                <div className="bg-gradient-to-br from-[#FF9900]/10 to-[#FF9900]/5 border border-[#FF9900]/20 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF9900]/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#FF9900]" />
                    </div>
                    <span className="text-sm text-gray-400">Treinos</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#FF9900]">{mockDailyStats.workoutsCompleted}</span>
                      <span className="text-sm text-gray-500">/ {mockDailyStats.workoutsGoal}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#FF9900] to-[#DD7700] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(mockDailyStats.workoutsCompleted / mockDailyStats.workoutsGoal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Water Intake Card */}
                <div className="bg-gradient-to-br from-[#00E5C9]/10 to-[#00E5C9]/5 border border-[#00E5C9]/20 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00E5C9]/20 flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-[#00E5C9]" />
                    </div>
                    <span className="text-sm text-gray-400">Hidratação</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#00E5C9]">{mockDailyStats.waterIntake}</span>
                      <span className="text-sm text-gray-500">ml</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#00E5C9] to-[#00B8A3] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(mockDailyStats.waterIntake / mockDailyStats.waterGoal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mood Card */}
                <div className="bg-gradient-to-br from-[#A084FF]/10 to-[#A084FF]/5 border border-[#A084FF]/20 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#A084FF]/20 flex items-center justify-center">
                      <Smile className="w-5 h-5 text-[#A084FF]" />
                    </div>
                    <span className="text-sm text-gray-400">Humor</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-6 h-6 rounded-full transition-all duration-300 ${
                            star <= mockDailyStats.moodScore
                              ? 'bg-[#A084FF] scale-110'
                              : 'bg-gray-800'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {mockDailyStats.moodScore >= 4 ? 'Ótimo!' : mockDailyStats.moodScore >= 3 ? 'Bom' : 'Pode melhorar'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Ações Rápidas</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentPage('workouts')}
                  className="bg-gradient-to-br from-[#FF9900] to-[#DD7700] rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 shadow-lg shadow-[#FF9900]/20"
                >
                  <Activity className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-lg">Iniciar Treino</h3>
                  <p className="text-sm opacity-90 mt-1">Escolha seu treino</p>
                </button>

                <button
                  onClick={() => setCurrentPage('calories')}
                  className="bg-gradient-to-br from-[#66FF66] to-[#44DD44] rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 shadow-lg shadow-[#66FF66]/20 text-black"
                >
                  <Flame className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-lg">Registrar Refeição</h3>
                  <p className="text-sm opacity-90 mt-1">Adicione suas calorias</p>
                </button>

                <button
                  onClick={() => setCurrentPage('support')}
                  className="bg-gradient-to-br from-[#A084FF] to-[#8866DD] rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 shadow-lg shadow-[#A084FF]/20"
                >
                  <Smile className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-lg">Bem-estar</h3>
                  <p className="text-sm opacity-90 mt-1">Chat e exercícios</p>
                </button>

                <button
                  onClick={() => setCurrentPage('profile')}
                  className="bg-gradient-to-br from-[#FFD700] to-[#DDBB00] rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 shadow-lg shadow-[#FFD700]/20 text-black"
                >
                  <Award className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-lg">Conquistas</h3>
                  <p className="text-sm opacity-90 mt-1">Veja seu progresso</p>
                </button>
              </div>
            </section>

            {/* Weekly Progress */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Progresso Semanal</h2>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#00E5C9]/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#00E5C9]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Você está indo bem!</h3>
                      <p className="text-sm text-gray-400">5 de 7 dias ativos</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-between">
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                          index < 5
                            ? 'bg-[#00E5C9] text-black'
                            : 'bg-gray-800 text-gray-500'
                        }`}
                      >
                        {day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Suas Conquistas</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {mockUserProfile.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/30 rounded-xl px-4 py-3 whitespace-nowrap hover:scale-105 transition-transform duration-300"
                  >
                    <span className="text-sm font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentPage === 'workouts' && (
          <div className="text-center py-20">
            <Activity className="w-16 h-16 mx-auto mb-4 text-[#FF9900]" />
            <h2 className="text-2xl font-bold mb-2">Treinos</h2>
            <p className="text-gray-400">Módulo em desenvolvimento...</p>
          </div>
        )}

        {currentPage === 'calories' && (
          <div className="text-center py-20">
            <Flame className="w-16 h-16 mx-auto mb-4 text-[#66FF66]" />
            <h2 className="text-2xl font-bold mb-2">Nutrição</h2>
            <p className="text-gray-400">Módulo em desenvolvimento...</p>
          </div>
        )}

        {currentPage === 'support' && (
          <div className="text-center py-20">
            <Smile className="w-16 h-16 mx-auto mb-4 text-[#A084FF]" />
            <h2 className="text-2xl font-bold mb-2">Bem-estar</h2>
            <p className="text-gray-400">Módulo em desenvolvimento...</p>
          </div>
        )}

        {currentPage === 'profile' && (
          <div className="text-center py-20">
            <Award className="w-16 h-16 mx-auto mb-4 text-[#FFD700]" />
            <h2 className="text-2xl font-bold mb-2">Perfil</h2>
            <p className="text-gray-400">Módulo em desenvolvimento...</p>
          </div>
        )}
      </main>

      {/* Navigation */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
