import { Link } from 'react-router-dom';

const CustomerServiceConfirmPage = () => {
  return (
    <div className="min-h-screen bg-white pb-24 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-5xl">✈</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          전송이 완료되었습니다!
        </h1>
        <p className="text-gray-600 mb-8">Thank you for using!</p>
        <Link
          to="/home"
          className="block w-full py-4 bg-primary text-white rounded-lg font-semibold"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
};

export default CustomerServiceConfirmPage;

