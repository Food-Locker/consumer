import { useState } from 'react';
import useSeatStore from '../store/seatStore';
import useUser from '../hooks/useUser';
import Toast from './Toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const SeatSelectionModal = ({ isOpen, onClose, required = false }) => {
  const [seatBlock, setSeatBlock] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [assignedLocker, setAssignedLocker] = useState(null);
  const { setSeatAndLocker } = useSeatStore();
  const { firebaseUser } = useUser(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!seatBlock.trim()) {
      setError('좌석 블록을 입력해주세요.');
      return;
    }

    if (!firebaseUser?.uid) {
      setError('로그인이 필요합니다.');
      setToastMessage('로그인이 필요합니다.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/lockers/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          seatBlock: seatBlock.trim(),
          userId: firebaseUser.uid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '락커 배정에 실패했습니다.');
      }

      const result = await response.json();
      
      // API 응답 구조: { success: true, data: { lockerId, location, zone, status } }
      if (result.success && result.data) {
        const { lockerId, location, zone } = result.data;
        
        // 락커 정보를 seatStore에 저장
        setSeatAndLocker(
          seatBlock.trim(),
          lockerId || '락커',
          location || ''
        );

        // 배정된 락커 정보를 상태에 저장하여 표시
        setAssignedLocker({
          lockerId: lockerId,
          location: location,
          zone: zone
        });
        
        // 성공 토스트 표시
        setToastMessage(
          `락커 배정 완료!\n락커 번호: ${lockerId}\n위치: ${location}`
        );
        setToastType('success');
        setShowToast(true);

        // 2초 후 모달 닫기
        setTimeout(() => {
          onClose();
          setAssignedLocker(null);
          setSeatBlock('');
        }, 2000);
      }
    } catch (error) {
      console.error('락커 배정 오류:', error);
      const errorMessage = error.message || '락커 배정에 실패했습니다.';
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSeatBlock('');
      setError('');
      setAssignedLocker(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-scale-in">
          <h2 className="text-xl font-bold mb-4 text-gray-900">좌석 정보 입력</h2>
          <p className="text-sm text-gray-600 mb-6">
            주문 시 가장 가까운 락커를 배정하기 위해 좌석 블록 정보가 필요합니다.
          </p>
          
          {assignedLocker && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-1">✓ 락커 배정 완료</p>
              <p className="text-sm text-green-700">
                <span className="font-medium">락커 번호: {assignedLocker.lockerId}</span>
                {assignedLocker.location && (
                  <> - <span>위치: {assignedLocker.location}</span></>
                )}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  좌석 블록 (Seat Block)
                </label>
                <input
                  type="text"
                  value={seatBlock}
                  onChange={(e) => {
                    setSeatBlock(e.target.value);
                    setError('');
                  }}
                  placeholder="예: 102, A-15"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={loading || !!assignedLocker}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {!required && (
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  나중에
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !!assignedLocker}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : assignedLocker ? '완료' : '입력 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </>
  );
};

export default SeatSelectionModal;
