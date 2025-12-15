import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import useThemeStore from './store/themeStore'

// 테마 초기화 - 스토어가 마운트되기 전에 실행
const savedTheme = localStorage.getItem('food-locker-theme-storage');
if (savedTheme) {
  try {
    const theme = JSON.parse(savedTheme);
    if (theme.state?.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // 파싱 오류 시 기본값 사용
    document.documentElement.classList.remove('dark');
  }
} else {
  // 저장된 테마가 없으면 기본값 (라이트 모드)
  document.documentElement.classList.remove('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

