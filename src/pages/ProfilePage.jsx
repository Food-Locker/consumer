import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/mongodb';
import { formatPhoneNumber } from '../utils/phoneUtils';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.uid) {
        try {
          const userData = await api.getUser(user.uid);
          setUserInfo(userData);
        } catch (error) {
          console.error('사용자 정보 가져오기 오류:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/mypage')}
            className="mr-4"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">프로필</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-600">이름</p>
            <p className="text-lg font-semibold text-gray-900">
              {loading ? '로딩 중...' : (userInfo?.name || user?.displayName || '사용자')}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">전화번호</p>
            <p className="text-gray-900 font-medium">
              {loading ? '로딩 중...' : (userInfo?.phone ? formatPhoneNumber(userInfo.phone) : '등록되지 않음')}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">이메일</p>
            <p className="text-gray-900 font-medium">
              {userInfo?.email || user?.email || '등록되지 않음'}
            </p>
          </div>
        </div>

        <Link
          to="/profile/edit"
          className="block w-full py-4 bg-primary text-white text-center rounded-lg font-semibold"
        >
          프로필 수정하기
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;

