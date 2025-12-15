import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/mongodb';
import { formatPhoneNumber } from '../utils/phoneUtils';

const EditProfilePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // MongoDB에서 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.uid) {
        try {
          const userData = await api.getUser(user.uid);
          setName(userData?.name || user?.displayName || '');
          setPhone(userData?.phone || '');
          setEmail(userData?.email || user?.email || '');
        } catch (error) {
          console.error('사용자 정보 가져오기 오류:', error);
          // 에러 발생 시 Firebase Auth 정보 사용
          setName(user?.displayName || '');
          setPhone('');
          setEmail(user?.email || '');
        } finally {
          setFetching(false);
        }
      } else {
        setFetching(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Firebase Auth 프로필 업데이트
      if (user) {
        await updateProfile(user, { displayName: name });
      }

      // MongoDB에 사용자 정보 업데이트
      if (user?.uid) {
        try {
          await api.updateUser(user.uid, {
            name: name,
            phone: phone,
            email: email
          });
        } catch (dbError) {
          console.error('MongoDB 사용자 정보 업데이트 오류:', dbError);
        }
      }

      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">프로필 수정</h1>
      </div>

      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl relative">
            👤
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xl">
              +
            </button>
          </div>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-600 text-sm mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-2">전화번호</label>
              <input
                type="tel"
                value={formatPhoneNumber(phone)}
                onChange={(e) => {
                  // 하이픈 제거 후 저장 (DB에는 숫자만 저장)
                  const numbers = e.target.value.replace(/\D/g, '');
                  setPhone(numbers);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="010-1234-5678"
                maxLength={13}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-2">이메일</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-primary text-white text-center rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;

