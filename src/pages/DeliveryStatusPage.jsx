import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, UtensilsCrossed, CheckCircle2, Package } from 'lucide-react';
import { api, pollOrderStatus } from '../lib/mongodb';

const DeliveryStatusPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 주문 상태 정의
  const statuses = [
    {
      id: 'received',
      label: '대기',
      title: '주문이 접수되었습니다.',
      icon: Clock,
      status: '진행중'
    },
    {
      id: 'cooking',
      label: '조리중',
      title: '현재 조리 중입니다.',
      icon: UtensilsCrossed,
      status: '대기'
    },
    {
      id: 'completed',
      label: '조리 완료',
      title: '조리가 완료되었습니다.',
      icon: CheckCircle2,
      status: '대기'
    },
    {
      id: 'delivered',
      label: '배달 완료',
      title: '락커에서 수령 가능합니다.',
      icon: Package,
      status: '대기'
    }
  ];

  // MongoDB에서 주문 상태 실시간 감지 (폴링)
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // 초기 로드
    const fetchOrder = async () => {
      try {
        const orderData = await api.getOrder(orderId);
        setOrder(orderData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        // 에러 발생 시 localStorage에서 가져오기
        const localOrder = localStorage.getItem(`order_${orderId}`);
        if (localOrder) {
          try {
            const orderData = JSON.parse(localOrder);
            setOrder(orderData);
          } catch (e) {
            console.error('Error parsing local order:', e);
          }
        }
        setLoading(false);
      }
    };

    fetchOrder();

    // 실시간 업데이트를 위한 폴링
    const stopPolling = pollOrderStatus(orderId, (orderData) => {
      setOrder(orderData);
    }, 2000);

    return () => stopPolling();
  }, [orderId]);

  // 현재 주문 상태에 따라 상태 카드 업데이트
  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    
    const status = order.status || 'received';
    const statusMap = {
      'received': 0,
      'pending': 0,
      'cooking': 1,
      'completed': 2,
      'delivered': 3,
      'done': 3
    };
    
    return statusMap[status] || 0;
  };

  const currentStatusIndex = getCurrentStatusIndex();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-primary text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="px-4 py-4 border-b border-gray-200">
          <button onClick={() => navigate('/home')} className="mr-4">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600">주문 정보를 찾을 수 없습니다.</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-semibold"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-32">
      {/* Header */}
      <div className="bg-primary px-4 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/home')}
            className="mr-4"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white flex-1">배달 현황</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 배달 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
            <Package size={64} className="text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* 메인 메시지 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            주문이 접수되었습니다!
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            관리자 확인 후 조리가 시작됩니다.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          {/* 배달 상태 섹션 */}
          <div className="flex items-center mb-4">
            <Package size={20} className="text-gray-700 dark:text-gray-300 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">배달 상태</h3>
          </div>

          {/* 상태 카드들 */}
          <div className="space-y-3">
            {statuses.map((statusItem, index) => {
              const Icon = statusItem.icon;
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div
                  key={statusItem.id}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    isCurrent
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : isActive
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${
                        isCurrent
                          ? 'text-primary'
                          : isActive
                          ? 'text-primary/50'
                          : 'text-gray-400'
                      }`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {statusItem.title}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      isCurrent
                        ? 'text-primary'
                        : isActive
                        ? 'text-primary/70'
                        : 'text-gray-400'
                    }`}>
                      {isCurrent ? '진행중' : isActive ? '완료' : '대기'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 mobile-container">
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 bg-primary text-white text-center rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default DeliveryStatusPage;

