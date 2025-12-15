import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import useThemeStore from '../store/themeStore';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const { isDark, toggleTheme } = useThemeStore();

  // 컴포넌트 마운트 시 테마 초기화 확인
  useEffect(() => {
    const savedTheme = localStorage.getItem('food-locker-theme-storage');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        const savedIsDark = theme?.state?.isDark || false;
        if (savedIsDark !== isDark) {
          // 저장된 테마와 현재 상태가 다르면 동기화
          if (savedIsDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (e) {
        console.error('Theme parsing error:', e);
      }
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">설정</h1>
      </div>

      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">알림설정</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">위치확인</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={location}
              onChange={(e) => setLocation(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">언어</span>
          <span className="text-gray-600 dark:text-gray-400">KOR &gt;</span>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">온도</span>
          <span className="text-gray-600 dark:text-gray-400">&gt;</span>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">다크모드</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDark || false}
              onChange={handleToggleTheme}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors ${
              isDark 
                ? 'bg-primary peer-checked:bg-primary' 
                : 'bg-gray-200 dark:bg-gray-700 peer-checked:bg-primary'
            }`}></div>
          </label>
        </div>

        <div className="py-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white mb-1">현재버전</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">현재 최신 버전입니다.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">현재 버전 1.1.0</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 text-red-500 dark:text-red-400 text-center font-semibold"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

