import { useState } from 'react';
import useSeatStore from '../store/seatStore';

const SeatSelectionModal = ({ isOpen, onClose, required = false }) => {
  const [block, setBlock] = useState('');
  const [number, setNumber] = useState('');
  const { setSeat } = useSeatStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (block.trim() && number.trim()) {
      setSeat(block.trim(), number.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-900">좌석 정보 입력</h2>
        <p className="text-sm text-gray-600 mb-6">
          주문 시 가장 가까운 락커를 배정하기 위해 좌석 정보가 필요합니다.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                블록 (Block)
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="예: 102, A-15"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                좌석 번호 (Seat Number)
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="예: 15, 23"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {!required && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                나중에
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeatSelectionModal;

