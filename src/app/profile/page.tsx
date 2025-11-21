'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/custom/navigation';
import { getCurrentUser, getUserProfile, updateUserProfile, getUserBadges, signOut } from '@/lib/auth';
import { Award, User, Target, TrendingUp, Loader2, Save, LogOut, Edit2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workouts' | 'calories' | 'support' | 'profile'>('profile');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    goal_type: '',
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

      const { data: profileData } = await getUserProfile(currentUser.id);
      setProfile(profileData);
      if (profileData) {
        setFormData({
          name: profileData.name || '',
          weight: profileData.weight?.toString() || '',
          height: profileData.height?.toString() || '',
          goal_type: profileData.goal_type || '',
        });
      }

      const { data: badgesData } = await getUserBadges(currentUser.id);
      setBadges(badgesData || []);
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

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.id, {
        name: formData.name,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        goal_type: formData.goal_type || undefined,
      });

      const { data: updatedProfile } = await getUserProfile(user.id);
      setProfile(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const calculateBMI = () => {
    if (profile?.weight && profile?.height) {
      const heightInMeters = profile.height / 100;
      const bmi = profile.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#FFD700]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-gradient-to-b from-black to-transparent backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                <User className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Perfil</h1>
                <p className="text-sm text-gray-400">Suas informações</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        {/* Profile Info */}
        <section>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#DDBB00] flex items-center justify-center text-black text-3xl font-bold">
                  {profile?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.name || 'Usuário'}</h2>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
              >
                <Edit2 className="w-5 h-5 text-[#FFD700]" />
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Altura (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Objetivo</label>
                  <select
                    value={formData.goal_type}
                    onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="">Selecione...</option>
                    <option value="lose_weight">Perder Peso</option>
                    <option value="gain_muscle">Ganhar Massa</option>
                    <option value="maintain">Manter Forma</option>
                    <option value="improve_health">Melhorar Saúde</option>
                  </select>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#DDBB00] text-black font-semibold py-4 rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#FFD700]">
                    {profile?.weight || '--'}
                  </p>
                  <p className="text-sm text-gray-400">Peso (kg)</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#FFD700]">
                    {profile?.height || '--'}
                  </p>
                  <p className="text-sm text-gray-400">Altura (cm)</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#FFD700]">
                    {calculateBMI() || '--'}
                  </p>
                  <p className="text-sm text-gray-400">IMC</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Goal */}
        {profile?.goal_type && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Seu Objetivo</h2>
            <div className="bg-gradient-to-br from-[#00E5C9]/10 to-[#00E5C9]/5 border border-[#00E5C9]/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00E5C9]/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#00E5C9]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {profile.goal_type === 'lose_weight' && 'Perder Peso'}
                  {profile.goal_type === 'gain_muscle' && 'Ganhar Massa Muscular'}
                  {profile.goal_type === 'maintain' && 'Manter Forma'}
                  {profile.goal_type === 'improve_health' && 'Melhorar Saúde'}
                </h3>
                <p className="text-sm text-gray-400">Continue focado no seu objetivo!</p>
              </div>
            </div>
          </section>
        )}

        {/* Badges */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#FFD700]" />
            Conquistas
          </h2>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform"
                >
                  <Award className="w-12 h-12 mx-auto mb-3 text-[#FFD700]" />
                  <h3 className="font-semibold mb-1">{badge.badge_name}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(badge.earned_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Nenhuma conquista ainda</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete treinos e metas para ganhar badges!
              </p>
            </div>
          )}
        </section>

        {/* Stats Summary */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#00E5C9]" />
            Resumo Geral
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-[#FF9900] mb-2">{badges.length}</p>
              <p className="text-sm text-gray-400">Conquistas</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-[#00E5C9] mb-2">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </p>
              <p className="text-sm text-gray-400">Membro desde</p>
            </div>
          </div>
        </section>
      </main>

      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
