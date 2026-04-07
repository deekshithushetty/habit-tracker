import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark', // 'light' | 'dark' | 'system'
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      // Selected date for home page (default: today)
      selectedDate: new Date().toISOString().split('T')[0],
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Insights period filter
      insightsPeriod: 'month',
      setInsightsPeriod: (period) => set({ insightsPeriod: period }),

      // Tasks filter
      tasksFilter: 'all', // 'all' | 'daily' | 'weekly' | category name
      setTasksFilter: (filter) => set({ tasksFilter: filter }),

      // Modal states
      isNewHabitModalOpen: false,
      openNewHabitModal: () => set({ isNewHabitModalOpen: true }),
      closeNewHabitModal: () => set({ isNewHabitModalOpen: false }),

      editingHabit: null,
      setEditingHabit: (habit) => set({ editingHabit: habit }),
      clearEditingHabit: () => set({ editingHabit: null })
    }),
    {
      name: 'habit-tracker-ui',
      partialize: (state) => ({
        theme: state.theme,
        insightsPeriod: state.insightsPeriod
      })
    }
  )
);

// Apply theme to document
const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = JSON.parse(localStorage.getItem('habit-tracker-ui') || '{}');
  const theme = stored.state?.theme || 'dark';
  applyTheme(theme);
}