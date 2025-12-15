import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (orderId) {
      const stored = localStorage.getItem(`order_${orderId}`);
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    }
  }, [orderId]);

  // 3초 후 락커 정보 페이지로 이동
  useEffect(() => {
    if (orderId) {
      const timer = setTimeout(() => {
        navigate(`/locker/${orderId}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-white pb-24 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-5xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
        {orderData && (
          <p className="text-gray-600 mb-6">
            주문번호: {orderId}
          </p>
        )}
        <p className="text-gray-500 mb-8">락커 정보 페이지로 이동합니다...</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

