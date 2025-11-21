import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Legacy export for compatibility
export const supabase = createClient();

// Types for database
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  weight?: number;
  height?: number;
  goal_type?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutHistory {
  id: string;
  user_id: string;
  date: string;
  activity: string;
  duration_minutes: number;
  calories_burned: number;
  created_at: string;
}

export interface CalorieTracking {
  id: string;
  user_id: string;
  date: string;
  meal_type: string;
  calories: number;
  description: string;
  photo_url?: string;
  created_at: string;
}

export interface DailyStats {
  id: string;
  user_id: string;
  date: string;
  calories_consumed: number;
  calories_goal: number;
  workouts_completed: number;
  workouts_goal: number;
  water_intake: number;
  water_goal: number;
  mood_score: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
}
