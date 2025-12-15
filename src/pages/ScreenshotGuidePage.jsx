import { Link } from 'react-router-dom';
import { Camera, Home, Search, ShoppingCart, CreditCard, Package, Receipt, User } from 'lucide-react';

const ScreenshotGuidePage = () => {
  const pages = [
    {
      category: '인증',
      items: [
        { path: '/', name: 'SplashPage', icon: Camera, description: '스플래시 화면' },
        { path: '/signin', name: 'SignInPage', icon: Camera, description: '로그인' },
        { path: '/signup', name: 'SignUpPage', icon: Camera, description: '회원가입' },
      ]
    },
    {
      category: '메인',
      items: [
        { path: '/home', name: 'HomePage', icon: Home, description: '홈 - 카테고리 및 메뉴' },
        { path: '/search', name: 'SearchPage', icon: Search, description: '야구장 검색 및 메뉴 탐색' },
      ]
    },
    {
      category: '주문',
      items: [
        { path: '/cart', name: 'CartPage', icon: ShoppingCart, description: '장바구니' },
        { path: '/payment', name: 'PaymentPage', icon: CreditCard, description: '결제 화면' },
        { path: '/order/status', name: 'OrderStatusPage', icon: Package, description: '주문 현황' },
        { path: '/order/history', name: 'OrderHistoryPage', icon: Receipt, description: '주문 내역' },
      ]
    },
    {
      category: '기타',
      items: [
        { path: '/mypage', name: 'MyPage', icon: User, description: '마이페이지' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">화면 캡처 가이드</h1>
          <p className="text-gray-600">각 페이지로 이동하여 스크린샷을 캡처하세요</p>
        </div>

        <div className="space-y-6">
          {pages.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl p-5 shadow-soft">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-2">
                {category.items.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.path}
                      to={page.path}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{page.name}</h3>
                          <p className="text-sm text-gray-500">{page.description}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 font-mono">{page.path}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 캡처 팁</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 브라우저 개발자 도구 (F12) → 디바이스 모드 사용</li>
            <li>• 모바일 화면 크기로 설정 (예: iPhone 12 Pro)</li>
            <li>• 스크린샷은 <code className="bg-blue-100 px-1 rounded">screenshots</code> 폴더에 저장</li>
            <li>• 파일명 형식: <code className="bg-blue-100 px-1 rounded">페이지명_설명.png</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotGuidePage;

