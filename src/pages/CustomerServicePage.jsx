import { Link } from 'react-router-dom';

const CustomerServicePage = () => {
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">고객센터</h1>
      </div>

      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          무엇을 도와드릴까요?
        </h2>

        <div className="space-y-2">
          <Link
            to="/customer-service/inquiry"
            className="flex items-center justify-between py-4 border-b border-gray-200"
          >
            <span className="text-gray-900">문의하기</span>
            <span className="text-gray-400">&gt;</span>
          </Link>
          <Link
            to="/customer-service/answers"
            className="flex items-center justify-between py-4 border-b border-gray-200"
          >
            <span className="text-gray-900">답변보기</span>
            <span className="text-gray-400">&gt;</span>
          </Link>
          <Link
            to="/customer-service/phone"
            className="flex items-center justify-between py-4 border-b border-gray-200"
          >
            <span className="text-gray-900">전화상담</span>
            <span className="text-gray-400">&gt;</span>
          </Link>
          <Link
            to="/customer-service/bug"
            className="flex items-center justify-between py-4 border-b border-gray-200"
          >
            <span className="text-gray-900">버그 신고</span>
            <span className="text-gray-400">&gt;</span>
          </Link>
          <Link
            to="/customer-service/terms"
            className="flex items-center justify-between py-4 border-b border-gray-200"
          >
            <span className="text-gray-900">약관 및 정책</span>
            <span className="text-gray-400">&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;

