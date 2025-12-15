import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerServiceInquiryPage = () => {
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inquiry.trim()) return;

    setLoading(true);
    // 실제로는 서버로 전송
    setTimeout(() => {
      setLoading(false);
      navigate('/customer-service/confirm');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">고객센터</h1>
      </div>

      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">문의하기</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">문의 내용을 작성 해주세요</label>
            <textarea
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="문의 내용을 입력해주세요..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inquiry.trim()}
            className="w-full py-4 bg-primary text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? '전송 중...' : '보내기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerServiceInquiryPage;

