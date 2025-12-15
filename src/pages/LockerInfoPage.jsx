import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Smartphone } from 'lucide-react';

const LockerInfoPage = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [lockerInfo, setLockerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Firebase에서 주문 정보 가져오기
    const orderRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(orderRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setOrderData({
          id: docSnapshot.id,
          ...data
        });

        // 락커 정보가 있으면 가져오기
        if (data.lockerNumber || data.locker) {
          setLockerInfo({
            lockerNumber: data.lockerNumber || data.locker?.number || Math.floor(Math.random() * 100) + 1,
            password: data.lockerPassword || data.locker?.password || Math.floor(1000 + Math.random() * 9000),
            qrCode: data.lockerQR || data.locker?.qrCode || `LOCKER-${orderId}`,
            location: data.lockerLocation || data.locker?.location || '1층 입구 옆',
            status: data.lockerStatus || 'ready',
          });
        } else if (data.status === 'completed') {
          // 주문이 완료되었지만 락커 정보가 없으면 생성 (시뮬레이션)
          setTimeout(() => {
            setLockerInfo({
              lockerNumber: Math.floor(Math.random() * 100) + 1,
              password: Math.floor(1000 + Math.random() * 9000),
              qrCode: `LOCKER-${orderId}`,
              location: '1층 입구 옆',
              status: 'ready',
            });
          }, 1000);
        }
      } else {
        // Firebase에 없으면 localStorage에서 가져오기 (호환성)
        const stored = localStorage.getItem(`order_${orderId}`);
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setOrderData(data);
            setTimeout(() => {
              setLockerInfo({
                lockerNumber: Math.floor(Math.random() * 100) + 1,
                password: Math.floor(1000 + Math.random() * 9000),
                qrCode: `LOCKER-${orderId}`,
                location: '1층 입구 옆',
                status: 'ready',
              });
            }, 2000);
          } catch (e) {
            console.error('Error parsing local order:', e);
          }
        }
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching order:', error);
      // 에러 발생 시 localStorage에서 가져오기
      const stored = localStorage.getItem(`order_${orderId}`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setOrderData(data);
          setTimeout(() => {
            setLockerInfo({
              lockerNumber: Math.floor(Math.random() * 100) + 1,
              password: Math.floor(1000 + Math.random() * 9000),
              qrCode: `LOCKER-${orderId}`,
              location: '1층 입구 옆',
              status: 'ready',
            });
          }, 2000);
        } catch (e) {
          console.error('Error parsing local order:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">주문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">주문 정보를 찾을 수 없습니다.</p>
          <Link to="/home" className="text-primary font-semibold">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">락커 정보</h1>
      </div>

      <div className="px-4 py-6">
        {!lockerInfo ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 mb-2">조리 중입니다...</p>
            <p className="text-sm text-gray-500">락커 배정 대기 중</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                  <Package size={48} className="text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                락커 #{lockerInfo.lockerNumber}
              </h2>
              <p className="text-gray-600">위치: {lockerInfo.location}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">락커 비밀번호</h3>
              <div className="text-4xl font-bold text-center text-primary mb-2">
                {lockerInfo.password}
              </div>
              <p className="text-sm text-gray-500 text-center">
                위 비밀번호를 락커에 입력하세요
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-4">QR 코드</h3>
              <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <Smartphone size={48} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">{lockerInfo.qrCode}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                QR 코드를 락커 스캐너에 비춰주세요
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">안내사항</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 락커는 주문 완료 후 10-15분 내에 배정됩니다</li>
                <li>• 음식이 준비되면 알림을 받게 됩니다</li>
                <li>• 락커 위치는 앱 내 지도에서 확인할 수 있습니다</li>
              </ul>
            </div>

            <Link
              to="/home"
              className="block w-full py-4 bg-primary text-white text-center rounded-lg font-semibold"
            >
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockerInfoPage;

