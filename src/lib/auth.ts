import { createClient } from './supabase';
import type { UserProfile, DailyStats, UserBadge, WorkoutHistory, CalorieTracking } from './supabase';

export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return { data: null, error: error.message };
  }

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        name,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }

    // Create initial daily stats
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('daily_stats')
      .insert({
        user_id: data.user.id,
        date: today,
      });
  }

  return { data, error: null };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error: error ? error.message : null };
}

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data: data as UserProfile | null, error };
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  return { data: data as UserProfile | null, error };
}

export async function getDailyStats(userId: string, date: string) {
  const supabase = createClient();
  
  // Try to get existing stats
  let { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  // If no stats exist, create them
  if (error && error.code === 'PGRST116') {
    const { data: newData, error: insertError } = await supabase
      .from('daily_stats')
      .insert({
        user_id: userId,
        date,
      })
      .select()
      .single();

    return { data: newData as DailyStats | null, error: insertError };
  }

  return { data: data as DailyStats | null, error };
}

export async function updateDailyStats(userId: string, date: string, updates: Partial<DailyStats>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('daily_stats')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('date', date)
    .select()
    .single();

  return { data: data as DailyStats | null, error };
}

export async function getUserBadges(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  return { data: data as UserBadge[] | null, error };
}

export async function addUserBadge(userId: string, badgeName: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      badge_name: badgeName,
    })
    .select()
    .single();

  return { data: data as UserBadge | null, error };
}

export async function getWorkoutHistory(userId: string, limit = 10) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  return { data: data as WorkoutHistory[] | null, error };
}

export async function addWorkout(userId: string, workout: Omit<WorkoutHistory, 'id' | 'user_id' | 'created_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('workout_history')
    .insert({
      user_id: userId,
      ...workout,
    })
    .select()
    .single();

  // Update daily stats
  if (data) {
    const { data: stats } = await getDailyStats(userId, workout.date);
    if (stats) {
      await updateDailyStats(userId, workout.date, {
        workouts_completed: stats.workouts_completed + 1,
      });
    }
  }

  return { data: data as WorkoutHistory | null, error };
}

export async function getCalorieTracking(userId: string, date: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('calorie_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: false });

  return { data: data as CalorieTracking[] | null, error };
}

export async function addCalorieEntry(userId: string, entry: Omit<CalorieTracking, 'id' | 'user_id' | 'created_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('calorie_tracking')
    .insert({
      user_id: userId,
      ...entry,
    })
    .select()
    .single();

  // Update daily stats
  if (data) {
    const { data: stats } = await getDailyStats(userId, entry.date);
    if (stats) {
      await updateDailyStats(userId, entry.date, {
        calories_consumed: stats.calories_consumed + entry.calories,
      });
    }
  }

  return { data: data as CalorieTracking | null, error };
}

export async function updateWaterIntake(userId: string, date: string, amount: number) {
  const { data: stats } = await getDailyStats(userId, date);
  if (stats) {
    return await updateDailyStats(userId, date, {
      water_intake: stats.water_intake + amount,
    });
  }
  return { data: null, error: new Error('Stats not found') };
}

export async function updateMoodScore(userId: string, date: string, score: number) {
  return await updateDailyStats(userId, date, {
    mood_score: score,
  });
}
