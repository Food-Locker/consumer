import { useState } from 'react';
import useSeatStore from '../store/seatStore';
import Toast from './Toast';

const SeatSelectionModal = ({ isOpen, onClose, required = false }) => {
  const [seatBlock, setSeatBlock] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [assignedLocker, setAssignedLocker] = useState(null);
  const { setSeatAndLocker } = useSeatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!seatBlock.trim()) {
      setError('좌석 블록을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/lockers/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatBlock: seatBlock.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '근처에 빈 락커가 없습니다.');
      }

      const data = await response.json();
      
      // 성공 시 락커 정보 저장
      setSeatAndLocker(
        seatBlock.trim(),
        data.lockerName || data.name || '락커',
        data.lockerLocation || data.location || ''
      );

      // 배정된 락커 정보를 상태에 저장하여 표시
      setAssignedLocker({
        name: data.lockerName || data.name || '락커',
        location: data.lockerLocation || data.location || ''
      });

      // 성공 토스트 표시
      setToastMessage(
        `락커 배정 완료!\n${data.lockerName || data.name || '락커'} - ${data.lockerLocation || data.location || ''}`
      );
      setToastType('success');
      setShowToast(true);

      // 2초 후 모달 닫기
      setTimeout(() => {
        onClose();
        setAssignedLocker(null);
        setSeatBlock('');
      }, 2000);
    } catch (err) {
      setError(err.message || '근처에 빈 락커가 없습니다.');
      setToastMessage(err.message || '근처에 빈 락커가 없습니다.');
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
                <span className="font-medium">{assignedLocker.name}</span>
                {assignedLocker.location && (
                  <> - <span>{assignedLocker.location}</span></>
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
