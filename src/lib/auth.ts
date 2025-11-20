'use client';

import { supabase } from './supabase';

export async function signUp(email: string, password: string, name: string) {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) throw authError;

    // 2. Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email,
          name,
        });

      if (profileError) throw profileError;

      // 3. Initialize daily stats
      const today = new Date().toISOString().split('T')[0];
      const { error: statsError } = await supabase
        .from('daily_stats')
        .insert({
          user_id: authData.user.id,
          date: today,
          calories_consumed: 0,
          calories_goal: 2000,
          workouts_completed: 0,
          workouts_goal: 1,
          water_intake: 0,
          water_goal: 2000,
          mood_score: 3,
        });

      if (statsError) throw statsError;

      // 4. Add welcome badge
      const { error: badgeError } = await supabase
        .from('user_badges')
        .insert({
          user_id: authData.user.id,
          badge_name: '🎉 Bem-vindo ao TotalMe!',
        });

      if (badgeError) throw badgeError;
    }

    return { data: authData, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getDailyStats(userId: string, date: string) {
  try {
    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (error) {
      // If no stats for today, create them
      if (error.code === 'PGRST116') {
        const { data: newStats, error: createError } = await supabase
          .from('daily_stats')
          .insert({
            user_id: userId,
            date,
            calories_consumed: 0,
            calories_goal: 2000,
            workouts_completed: 0,
            workouts_goal: 1,
            water_intake: 0,
            water_goal: 2000,
            mood_score: 3,
          })
          .select()
          .single();

        if (createError) throw createError;
        return { data: newStats, error: null };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getUserBadges(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
