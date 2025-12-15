import { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/mongodb';
import { auth } from '../lib/firebase';
import { getImagePath } from '../utils/imageUtils';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        // MongoDB에서 모든 주문 가져오기 (상태 필터 없이)
        const allOrders = await api.getOrders(auth.currentUser.uid, null);
        // 완료된 주문만 필터링 (completed, delivered 상태)
        const completedOrders = allOrders.filter(
          order => order.status === 'completed' || order.status === 'delivered'
        );
        // 최신 주문부터 정렬
        completedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(completedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // 에러 발생 시 localStorage에서 가져오기 (호환성)
        const orderKeys = Object.keys(localStorage).filter(key => key.startsWith('order_'));
        const orderList = orderKeys.map(key => {
          try {
            return JSON.parse(localStorage.getItem(key));
          } catch {
            return null;
          }
        }).filter(Boolean);
        setOrders(orderList);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>
      </div>

      <div className="px-4 py-6">
        {orders.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-sm w-full">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Receipt size={64} className="text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">주문 내역이 없습니다</h2>
              <p className="text-sm text-gray-500 mb-6">
                주문한 내역이 여기에 표시됩니다
              </p>
              <Link 
                to="/home" 
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                메뉴 둘러보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items?.[0];
              const itemName = firstItem?.name || '메뉴';
              const itemImage = getImagePath(itemName) || '/hamburger.png';
              return (
                <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-soft hover:shadow-medium transition-all">
                  <div className="flex items-start gap-4 mb-2">
                    {firstItem && (
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={itemImage} 
                          alt={itemName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/hamburger.png';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {order.items?.length || 0}개 메뉴
                      </h3>
                      {firstItem && (
                        <p className="text-sm text-gray-600">{itemName}</p>
                      )}
                      {order.seatBlock && order.seatNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          좌석: {order.seatBlock}블록 {order.seatNumber}번
                        </p>
                      )}
                    </div>
                    <span className="text-primary font-semibold">
                      {order.total?.toLocaleString() || 0}원
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('ko-KR') : ''}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

