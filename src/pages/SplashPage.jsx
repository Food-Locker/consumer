import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          navigate('/home');
        } else {
          navigate('/signin');
        }
      }, 2000);
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ 
        backgroundColor: '#1E6E68',
      }}
    >
      {/* 스플래시 이미지 */}
      <img 
        src="/Splash.png" 
        alt="Food Locker Splash"
        className="w-full h-full"
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
};

export default SplashPage;

