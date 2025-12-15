import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/mongodb';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 로그인 성공 팝업 표시
      setLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // MongoDB에 사용자 정보가 없으면 생성 (첫 로그인인 경우)
      try {
        const existingUser = await api.getUser(user.uid);
        // 사용자가 이미 존재하면 아무것도 하지 않음
      } catch (error) {
        // 사용자가 없으면 생성
        try {
          await api.createUser({
            userId: user.uid,
            name: user.displayName || '사용자',
            email: user.email || '',
            phone: '',
            newsletter: false,
            authProvider: 'google'
          });
        } catch (dbError) {
          console.error('MongoDB 사용자 저장 오류:', dbError);
        }
      }

      // 로그인 성공 팝업 표시
      setLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-6 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center mr-8">로그인</h1>
      </div>

      <div className="px-6 pb-24">
        <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <Link to="/forgot-password" className="text-sm text-gray-500 block text-left">
            비밀번호를 잊으셨나요?
          </Link>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-lg font-bold text-lg disabled:opacity-50 mt-6"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-center text-gray-500 mb-4">소셜 로그인</p>
          <div className="flex justify-center gap-4">
            {/* Naver */}
            <button className="w-14 h-14 bg-[#03C75A] rounded-full flex items-center justify-center text-white text-xl font-bold">
              N
            </button>
            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-700"
            >
              G
            </button>
            {/* Kakao */}
            <button className="w-14 h-14 bg-[#FEE500] rounded-full flex items-center justify-center text-gray-900 text-xs font-bold">
              TALK
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup" className="text-gray-500">
            계정이 없으신가요?
          </Link>
        </div>
      </div>

      {/* 로그인 성공 팝업 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setShowSuccessModal(false);
            navigate('/home');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              {/* 성공 아이콘 */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              
              {/* 메시지 */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                로그인 성공!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                로그인이 성공적으로 완료되었습니다.
              </p>
              
              {/* 확인 버튼 */}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/home');
                }}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;

