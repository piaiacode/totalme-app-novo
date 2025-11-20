'use client';

import { Home, Dumbbell, Apple, Heart, User } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: 'dashboard' | 'workouts' | 'calories' | 'support' | 'profile';
  onNavigate: (page: 'dashboard' | 'workouts' | 'calories' | 'support' | 'profile') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, icon: Home, label: 'Início', color: '#00E5C9' },
    { id: 'workouts' as const, icon: Dumbbell, label: 'Treinos', color: '#FF9900' },
    { id: 'calories' as const, icon: Apple, label: 'Nutrição', color: '#66FF66' },
    { id: 'support' as const, icon: Heart, label: 'Bem-estar', color: '#A084FF' },
    { id: 'profile' as const, icon: User, label: 'Perfil', color: '#FFD700' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center gap-1 min-w-[60px] transition-all duration-300 ease-in-out group"
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'scale-110'
                      : 'group-hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${item.color}20` : 'transparent',
                  }}
                >
                  <Icon
                    className="w-6 h-6 transition-colors duration-300"
                    style={{
                      color: isActive ? item.color : '#6b7280',
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{
                    color: isActive ? item.color : '#9ca3af',
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
