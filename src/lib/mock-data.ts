// TotalMe - Mock Data

import { UserProfile, WorkoutHistory, CalorieTracking, CommunityPost, DailyStats, Workout } from './types';

export const mockUserProfile: UserProfile = {
  name: 'Alex Silva',
  weight: 75,
  height: 175,
  goalType: 'weight_loss',
  badges: ['🔥 7 dias seguidos', '💪 50 treinos', '🥗 Nutrição em dia'],
};

export const mockDailyStats: DailyStats = {
  caloriesConsumed: 1450,
  caloriesGoal: 2000,
  workoutsCompleted: 1,
  workoutsGoal: 2,
  moodScore: 4,
  waterIntake: 1500,
  waterGoal: 2000,
};

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Boxe para Iniciantes',
    category: 'boxing',
    duration: 30,
    difficulty: 'beginner',
    caloriesBurn: 300,
    description: 'Aprenda os fundamentos do boxe com combinações básicas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Corrida Intervalada',
    category: 'running',
    duration: 25,
    difficulty: 'intermediate',
    caloriesBurn: 250,
    description: 'Treino HIIT de corrida para queimar gordura',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Yoga Matinal',
    category: 'yoga',
    duration: 20,
    difficulty: 'beginner',
    caloriesBurn: 120,
    description: 'Desperte seu corpo com alongamentos suaves',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Treino de Força',
    category: 'strength',
    duration: 45,
    difficulty: 'advanced',
    caloriesBurn: 400,
    description: 'Construa músculos com exercícios compostos',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
  },
];

export const mockWorkoutHistory: WorkoutHistory[] = [
  {
    id: '1',
    date: new Date(2024, 0, 15),
    activity: 'Boxe para Iniciantes',
    durationMinutes: 30,
    caloriesBurned: 300,
    category: 'boxing',
  },
  {
    id: '2',
    date: new Date(2024, 0, 14),
    activity: 'Corrida Intervalada',
    durationMinutes: 25,
    caloriesBurned: 250,
    category: 'running',
  },
];

export const mockCalorieTracking: CalorieTracking[] = [
  {
    id: '1',
    date: new Date(),
    mealType: 'breakfast',
    calories: 450,
    description: 'Ovos mexidos com torrada integral e abacate',
    photoUrlMock: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    date: new Date(),
    mealType: 'lunch',
    calories: 600,
    description: 'Frango grelhado com arroz integral e salada',
    photoUrlMock: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    date: new Date(),
    mealType: 'snack',
    calories: 200,
    description: 'Iogurte grego com frutas vermelhas',
    photoUrlMock: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  },
];

export const mockCommunityFeed: CommunityPost[] = [
  {
    postId: '1',
    userId: 'user1',
    userName: 'Maria Santos',
    activity: 'Completou 5km de corrida',
    progressValue: 85,
    timestamp: new Date(Date.now() - 3600000),
    likes: 24,
    comments: 5,
  },
  {
    postId: '2',
    userId: 'user2',
    userName: 'João Costa',
    activity: 'Atingiu meta de calorias',
    progressValue: 100,
    timestamp: new Date(Date.now() - 7200000),
    likes: 18,
    comments: 3,
  },
];
