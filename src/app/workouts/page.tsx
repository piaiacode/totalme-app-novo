'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/custom/navigation';
import { getCurrentUser, addWorkout, getWorkoutHistory } from '@/lib/auth';
import { Activity, Play, Clock, Flame, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import type { WorkoutHistory } from '@/lib/supabase';

const workoutCategories = [
  {
    id: 'boxing',
    name: 'Boxe',
    icon: '🥊',
    color: '#FF9900',
    duration: 30,
    calories: 350,
    description: 'Treino intenso de boxe para queimar calorias',
  },
  {
    id: 'running',
    name: 'Corrida',
    icon: '🏃',
    color: '#FF6B6B',
    duration: 45,
    calories: 400,
    description: 'Corrida ao ar livre ou esteira',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: '🧘',
    color: '#A084FF',
    duration: 60,
    calories: 200,
    description: 'Relaxamento e flexibilidade',
  },
  {
    id: 'hiit',
    name: 'HIIT',
    icon: '⚡',
    color: '#FFD700',
    duration: 20,
    calories: 300,
    description: 'Treino intervalado de alta intensidade',
  },
  {
    id: 'cycling',
    name: 'Ciclismo',
    icon: '🚴',
    color: '#00E5C9',
    duration: 50,
    calories: 450,
    description: 'Pedalada indoor ou outdoor',
  },
  {
    id: 'strength',
    name: 'Musculação',
    icon: '💪',
    color: '#66FF66',
    duration: 60,
    calories: 280,
    description: 'Treino de força e hipertrofia',
  },
];

export default function WorkoutsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workouts' | 'calories' | 'support' | 'profile'>('workouts');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const loadData = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser();
      if (error || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const { data: historyData } = await getWorkoutHistory(currentUser.id, 5);
      setHistory(historyData || []);
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

  const startWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setIsWorkoutActive(true);
    setWorkoutTime(0);
  };

  const finishWorkout = async () => {
    if (!selectedWorkout || !user) return;

    setSaving(true);
    try {
      const durationMinutes = Math.floor(workoutTime / 60);
      const caloriesBurned = Math.floor((durationMinutes / selectedWorkout.duration) * selectedWorkout.calories);

      await addWorkout(user.id, {
        date: new Date().toISOString().split('T')[0],
        activity: selectedWorkout.name,
        duration_minutes: durationMinutes,
        calories_burned: caloriesBurned,
      });

      // Reload history
      const { data: historyData } = await getWorkoutHistory(user.id, 5);
      setHistory(historyData || []);

      // Reset workout
      setIsWorkoutActive(false);
      setSelectedWorkout(null);
      setWorkoutTime(0);
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#FF9900]" />
      </div>
    );
  }

  if (isWorkoutActive && selectedWorkout) {
    return (
      <div className="min-h-screen bg-black pb-24">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <button
            onClick={() => {
              setIsWorkoutActive(false);
              setSelectedWorkout(null);
              setWorkoutTime(0);
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="text-center space-y-8">
            <div className="text-6xl mb-4">{selectedWorkout.icon}</div>
            <h1 className="text-3xl font-bold" style={{ color: selectedWorkout.color }}>
              {selectedWorkout.name}
            </h1>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-12">
              <div className="text-7xl font-bold mb-4" style={{ color: selectedWorkout.color }}>
                {formatTime(workoutTime)}
              </div>
              <p className="text-gray-400 text-lg">Tempo decorrido</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <Clock className="w-8 h-8 mx-auto mb-2 text-[#00E5C9]" />
                <p className="text-2xl font-bold">{selectedWorkout.duration} min</p>
                <p className="text-sm text-gray-400">Meta</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <Flame className="w-8 h-8 mx-auto mb-2 text-[#FF9900]" />
                <p className="text-2xl font-bold">{selectedWorkout.calories}</p>
                <p className="text-sm text-gray-400">Calorias</p>
              </div>
            </div>

            <button
              onClick={finishWorkout}
              disabled={saving || workoutTime < 60}
              className="w-full bg-gradient-to-r from-[#66FF66] to-[#44DD44] text-black font-semibold py-4 rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Finalizar Treino
                </>
              )}
            </button>
            {workoutTime < 60 && (
              <p className="text-sm text-gray-500">Mínimo 1 minuto para salvar</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-gradient-to-b from-black to-transparent backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF9900]/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#FF9900]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Treinos</h1>
              <p className="text-sm text-gray-400">Escolha seu treino</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        {/* Workout Categories */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workoutCategories.map((workout) => (
              <div
                key={workout.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => startWorkout(workout)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{workout.icon}</div>
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: `${workout.color}20` }}
                  >
                    <Play className="w-5 h-5" style={{ color: workout.color }} />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: workout.color }}>
                  {workout.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{workout.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    {workout.duration} min
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Flame className="w-4 h-4" />
                    {workout.calories} cal
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Workouts */}
        {history.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Histórico Recente</h2>
            <div className="space-y-3">
              {history.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FF9900]/20 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-[#FF9900]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{workout.activity}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(workout.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#FF9900]">{workout.duration_minutes} min</p>
                    <p className="text-sm text-gray-400">{workout.calories_burned} cal</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
