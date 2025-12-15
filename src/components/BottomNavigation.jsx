import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/home', icon: Home, label: '홈' },
    { path: '/cart', icon: ShoppingCart, label: '장바구니' },
    { path: '/order/status', icon: Package, label: '주문 현황' },
    { path: '/mypage', icon: User, label: '마이페이지' },
  ];

  const isActive = (path) => {
    if (path === '/home') {
      return currentPath === '/home' || currentPath === '/search';
    }
    if (path === '/order/status') {
      return currentPath === '/order/status' || currentPath.startsWith('/delivery-status');
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 safe-area-bottom z-50 mobile-container shadow-[0_-2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={24} className={`transition-all duration-200 ${active ? 'text-primary scale-110' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className={`text-xs mt-1 transition-all duration-200 ${active ? 'text-primary font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

