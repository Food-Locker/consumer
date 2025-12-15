import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/mongodb';
import { auth } from '../lib/firebase';
import useCartStore from '../store/cartStore';
import useSeatStore from '../store/seatStore';
import SeatSelectionModal from '../components/SeatSelectionModal';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { seatBlock, seatNumber, hasSeat } = useSeatStore();
  const [deliveryMethod, setDeliveryMethod] = useState('locker'); // 락커 배달만
  const [paymentMethod, setPaymentMethod] = useState(''); // 결제수단
  const [loading, setLoading] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [stadiumId, setStadiumId] = useState(null);

  // 첫 번째 stadium 가져오기 (주문에 stadiumId 포함용)
  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const stadiums = await api.getStadiums();
        if (stadiums.length > 0) {
          setStadiumId(stadiums[0].id);
        }
      } catch (error) {
        console.error('Error fetching stadium:', error);
      }
    };
    fetchStadium();
  }, []);

  const menuTotal = getTotal();
  const deliveryFee = deliveryMethod === 'locker' ? 1000 : deliveryMethod === 'seat' ? 2500 : 0;
  const discount = menuTotal * 0.1; // 10% 할인
  const finalTotal = menuTotal + deliveryFee - discount;

  const handlePayment = async () => {
    // 좌석 정보가 없으면 모달 표시
    if (!hasSeat()) {
      setShowSeatModal(true);
      return;
    }

    // 결제수단이 선택되지 않았으면 알림
    if (!paymentMethod) {
      alert('결제수단을 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 주문에 포함된 모든 brandId 추출 (중복 제거)
      const brandIds = [...new Set(items.map(item => item.brandId).filter(Boolean))];
      
      // MongoDB에 주문 정보 저장
      const orderData = {
        userId: auth.currentUser?.uid || 'anonymous',
        items,
        seatBlock,
        seatNumber,
        deliveryMethod,
        paymentMethod,
        total: finalTotal,
        status: 'received', // 초기 상태: 접수됨
        stadiumId: stadiumId, // 야구장 정보 추가
        brandIds: brandIds, // 주문에 포함된 브랜드 ID 배열
      };

      // MongoDB API에 주문 추가
      const order = await api.createOrder(orderData);
      const orderId = order.id;

      // localStorage에도 백업 저장 (호환성)
      localStorage.setItem(`order_${orderId}`, JSON.stringify(order));

      clearCart();
      setLoading(false);
      
      // 배달 현황 페이지로 이동
      navigate(`/delivery-status/${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setLoading(false);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">결제화면</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            수령방법
          </h2>
          <div className="bg-primary/5 dark:bg-primary/10 border-2 border-primary rounded-xl p-4 shadow-soft">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">락커 배달</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">10-15분 후 도착</p>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">1,000원</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            결제수단을 선택해주세요*
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                paymentMethod === 'card'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-soft'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">신용/체크카드</h3>
                </div>
                {paymentMethod === 'card' && (
                  <span className="text-primary">✓</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('kakao')}
              className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                paymentMethod === 'kakao'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-soft'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">카카오페이</h3>
                </div>
                {paymentMethod === 'kakao' && (
                  <span className="text-primary">✓</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('naver')}
              className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                paymentMethod === 'naver'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-soft'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">네이버페이</h3>
                </div>
                {paymentMethod === 'naver' && (
                  <span className="text-primary">✓</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('toss')}
              className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                paymentMethod === 'toss'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-soft'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">토스페이</h3>
                </div>
                {paymentMethod === 'toss' && (
                  <span className="text-primary">✓</span>
                )}
              </div>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            결제금액을 확인해주세요
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3 shadow-soft">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>메뉴 금액</span>
              <span>{menuTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>배달팁</span>
              <span>{deliveryFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-primary">
              <span>메뉴할인</span>
              <span>-{discount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="dark:text-white">최종 결제금액</span>
              <span className="text-primary">{finalTotal.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {hasSeat() ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              좌석 정보: {seatBlock}블록 {seatNumber}번
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ 결제하기 전에 좌석 정보를 입력해주세요.
            </p>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handlePayment}
          disabled={loading || !paymentMethod}
          className="w-full py-4 bg-primary text-white text-center rounded-xl font-semibold shadow-medium hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '결제 처리 중...' : '결제하기'}
        </button>
      </div>

      {/* 좌석 선택 모달 */}
      <SeatSelectionModal 
        isOpen={showSeatModal}
        onClose={() => setShowSeatModal(false)}
        required={true}
      />
    </div>
  );
};

export default PaymentPage;

