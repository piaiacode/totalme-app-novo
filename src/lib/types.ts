// TotalMe - Types and Interfaces

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  goalType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'wellness';
  badges: string[];
  avatarUrl?: string;
}

export interface WorkoutHistory {
  id: string;
  date: Date;
  activity: string;
  durationMinutes: number;
  caloriesBurned: number;
  category: 'boxing' | 'running' | 'yoga' | 'strength' | 'cardio' | 'other';
}

export interface CalorieTracking {
  id: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  description: string;
  photoUrlMock?: string;
}

export interface CommunityPost {
  postId: string;
  userId: string;
  userName: string;
  activity: string;
  progressValue: number;
  timestamp: Date;
  likes: number;
  comments: number;
  avatarUrl?: string;
}

export interface DailyStats {
  caloriesConsumed: number;
  caloriesGoal: number;
  workoutsCompleted: number;
  workoutsGoal: number;
  moodScore: number; // 1-5
  waterIntake: number; // in ml
  waterGoal: number;
}

export interface Workout {
  id: string;
  title: string;
  category: 'boxing' | 'running' | 'yoga' | 'strength' | 'cardio' | 'other';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caloriesBurn: number;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}
