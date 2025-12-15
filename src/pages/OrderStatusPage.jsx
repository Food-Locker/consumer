import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock } from 'lucide-react';
import { api, pollOrderStatus } from '../lib/mongodb';
import { auth } from '../lib/firebase';

const OrderStatusPage = () => {
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    // MongoDB에서 진행중인 주문 가져오기
    const fetchActiveOrders = async () => {
      try {
        const orders = await api.getOrders(auth.currentUser.uid, 'active');
        setActiveOrders(orders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching active orders:', error);
        // 에러 발생 시 localStorage에서 가져오기
        const orderKeys = Object.keys(localStorage).filter(key => key.startsWith('order_'));
        const orderList = orderKeys.map(key => {
          try {
            const order = JSON.parse(localStorage.getItem(key));
            // 진행중인 주문만 필터링
            if (order.status === 'received' || order.status === 'cooking' || order.status === 'pending') {
              return order;
            }
            return null;
          } catch {
            return null;
          }
        }).filter(Boolean);
        setActiveOrders(orderList);
        setLoading(false);
      }
    };

    fetchActiveOrders();

    // 실시간 업데이트를 위한 주기적 폴링
    const intervalId = setInterval(fetchActiveOrders, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const getStatusText = (status) => {
    const statusMap = {
      'received': '주문 접수',
      'pending': '주문 접수',
      'cooking': '조리 중',
      'completed': '완료'
    };
    return statusMap[status] || '주문 접수';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-primary text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">주문 현황</h1>
      </div>

      <div className="px-4 py-6">
        {activeOrders.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-sm w-full">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                  <Package size={64} className="text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">진행중인 주문이 없습니다</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                새로운 주문을 해보세요
              </p>
              <button
                onClick={() => navigate('/home')}
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                메뉴 둘러보기
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate(`/delivery-status/${order.id}`)}
                className="w-full bg-white border-2 border-gray-100 rounded-xl p-4 text-left hover:border-primary hover:shadow-medium transition-all duration-200 active:scale-[0.98] shadow-soft"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        주문 #{order.id.substring(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0}개 메뉴
                    </p>
                    {order.seatBlock && order.seatNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        좌석: {order.seatBlock}블록 {order.seatNumber}번
                      </p>
                    )}
                  </div>
                  <span className="text-primary font-semibold text-lg">
                    {order.total?.toLocaleString() || 0}원
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;

