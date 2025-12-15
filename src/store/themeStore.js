import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => {
        const newIsDark = !state.isDark;
        // HTML 요소에 dark 클래스 추가/제거
        if (newIsDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark: newIsDark };
      }),
      setTheme: (isDark) => {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDark });
      },
      initTheme: () => {
        // 초기 테마 적용
        const saved = localStorage.getItem('food-locker-theme-storage');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const isDark = parsed?.state?.isDark || false;
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {
            // 파싱 오류 시 기본값 사용
            document.documentElement.classList.remove('dark');
          }
        }
      }
    }),
    {
      name: 'food-locker-theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Theme rehydration error:', error);
          return;
        }
        // 초기 로드 시 테마 적용
        if (state?.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  )
);

export default useThemeStore;

