import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] animate-slide-down">
      <div
        className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-[90vw] ${
          type === 'success'
            ? 'bg-green-500 text-white'
            : type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}
      >
        <div className="flex-1 font-medium">{message}</div>
        <button
          onClick={onClose}
          className="text-white/90 hover:text-white font-bold text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;

