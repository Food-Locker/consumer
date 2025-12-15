import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/mongodb';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      // Firebase Auth로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // MongoDB에 사용자 정보 저장 (실패해도 회원가입은 성공으로 처리)
      try {
        const userData = {
          userId: user.uid,
          name: name,
          email: email,
          phone: phone,
          newsletter: newsletter,
          authProvider: 'email'
        };
        console.log('MongoDB에 저장할 사용자 데이터:', userData);
        await api.createUser(userData);
      } catch (dbError) {
        console.error('MongoDB 사용자 저장 오류:', dbError);
        // MongoDB 저장 실패해도 회원가입은 진행 (Firebase Auth는 성공했으므로)
      }

      // 회원가입 성공 후 로그아웃 (팝업을 표시하기 위해)
      await signOut(auth);

      // Firebase Auth 성공 시 회원가입 성공 팝업 표시
      setLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // MongoDB에 사용자 정보 저장 (실패해도 회원가입은 성공으로 처리)
      try {
        await api.createUser({
          userId: user.uid,
          name: user.displayName || name || '사용자',
          email: user.email || email,
          phone: phone || '',
          newsletter: newsletter,
          authProvider: 'google'
        });
      } catch (dbError) {
        console.error('MongoDB 사용자 저장 오류:', dbError);
        // MongoDB 저장 실패해도 회원가입은 진행 (Firebase Auth는 성공했으므로)
      }

      // 회원가입 성공 후 로그아웃 (팝업을 표시하기 위해)
      await signOut(auth);

      // Firebase Auth 성공 시 회원가입 성공 팝업 표시
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
        <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center mr-8">회원가입</h1>
      </div>

      <div className="px-6 pb-24">
        <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

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
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="newsletter"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="w-5 h-5 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="newsletter" className="ml-2 text-sm text-gray-500">
              할인, 적립 혜택 및 기타 업데이트를 받고 싶습니다.
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-lg font-bold text-lg disabled:opacity-50 mt-6"
          >
            {loading ? '계정 생성 중...' : '계정 만들기'}
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
          <p className="text-center text-gray-500 mb-4">소셜 회원가입</p>
          <div className="flex justify-center gap-4">
            {/* Naver */}
            <button className="w-14 h-14 bg-[#03C75A] rounded-full flex items-center justify-center text-white text-xl font-bold">
              N
            </button>
            {/* Google */}
            <button
              onClick={handleGoogleSignUp}
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
      </div>

      {/* 회원가입 성공 팝업 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setShowSuccessModal(false);
            navigate('/signin');
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
                회원가입 성공!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                회원가입이 성공적으로 완료되었습니다!
              </p>
              
              {/* 확인 버튼 */}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/signin');
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

export default SignUpPage;

