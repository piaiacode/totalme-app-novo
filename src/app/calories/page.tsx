'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/custom/navigation';
import { getCurrentUser, addCalorieEntry, getCalorieTracking } from '@/lib/auth';
import { Flame, Plus, Coffee, Sun, Moon, Loader2, X } from 'lucide-react';
import type { CalorieTracking } from '@/lib/supabase';

const mealTypes = [
  { id: 'breakfast', name: 'Café da Manhã', icon: Coffee, color: '#FFD700' },
  { id: 'lunch', name: 'Almoço', icon: Sun, color: '#FF9900' },
  { id: 'dinner', name: 'Jantar', icon: Moon, color: '#A084FF' },
  { id: 'snack', name: 'Lanche', icon: Flame, color: '#66FF66' },
];

export default function CaloriesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workouts' | 'calories' | 'support' | 'profile'>('calories');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<CalorieTracking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: 'breakfast',
    calories: '',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser();
      if (error || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const today = new Date().toISOString().split('T')[0];
      const { data: entriesData } = await getCalorieTracking(currentUser.id, today);
      setEntries(entriesData || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.calories || !formData.description) return;

    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await addCalorieEntry(user.id, {
        date: today,
        meal_type: formData.meal_type,
        calories: parseInt(formData.calories),
        description: formData.description,
      });

      // Reload entries
      const { data: entriesData } = await getCalorieTracking(user.id, today);
      setEntries(entriesData || []);

      // Reset form
      setFormData({
        meal_type: 'breakfast',
        calories: '',
        description: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#66FF66]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-gradient-to-b from-black to-transparent backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#66FF66]/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#66FF66]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Nutrição</h1>
                <p className="text-sm text-gray-400">Acompanhe suas calorias</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#66FF66] to-[#44DD44] flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Plus className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        {/* Total Today */}
        <section>
          <div className="bg-gradient-to-br from-[#66FF66]/10 to-[#66FF66]/5 border border-[#66FF66]/20 rounded-3xl p-8 text-center">
            <Flame className="w-12 h-12 mx-auto mb-4 text-[#66FF66]" />
            <h2 className="text-5xl font-bold text-[#66FF66] mb-2">{totalCalories}</h2>
            <p className="text-gray-400">Calorias consumidas hoje</p>
          </div>
        </section>

        {/* Meal Types Quick Add */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Adicionar Refeição</h2>
          <div className="grid grid-cols-2 gap-4">
            {mealTypes.map((meal) => {
              const Icon = meal.icon;
              return (
                <button
                  key={meal.id}
                  onClick={() => {
                    setFormData({ ...formData, meal_type: meal.id });
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:scale-105 transition-all duration-300 text-left"
                >
                  <Icon className="w-8 h-8 mb-3" style={{ color: meal.color }} />
                  <h3 className="font-semibold" style={{ color: meal.color }}>
                    {meal.name}
                  </h3>
                </button>
              );
            })}
          </div>
        </section>

        {/* Today's Entries */}
        {entries.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Hoje</h2>
            <div className="space-y-3">
              {entries.map((entry) => {
                const mealType = mealTypes.find((m) => m.id === entry.meal_type);
                const Icon = mealType?.icon || Flame;
                return (
                  <div
                    key={entry.id}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mealType?.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: mealType?.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{entry.description}</h3>
                        <p className="text-sm text-gray-400">{mealType?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#66FF66]">{entry.calories}</p>
                      <p className="text-sm text-gray-400">cal</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Add Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Adicionar Refeição</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Refeição</label>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypes.map((meal) => (
                    <button
                      key={meal.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, meal_type: meal.id })}
                      className={`p-3 rounded-xl border transition-all ${
                        formData.meal_type === meal.id
                          ? 'border-[#66FF66] bg-[#66FF66]/10'
                          : 'border-gray-700 bg-gray-800'
                      }`}
                    >
                      <p className="text-sm font-medium">{meal.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Pão com ovo"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#66FF66]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Calorias</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="Ex: 350"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#66FF66]"
                  required
                  min="1"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-[#66FF66] to-[#44DD44] text-black font-semibold py-4 rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Adicionar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
