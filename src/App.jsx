import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import useSeatStore from './store/seatStore';

// Pages
import SplashPage from './pages/SplashPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderStatusPage from './pages/OrderStatusPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import LockerInfoPage from './pages/LockerInfoPage';
import DeliveryStatusPage from './pages/DeliveryStatusPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import MyPage from './pages/MyPage';
import CustomerServicePage from './pages/CustomerServicePage';
import CustomerServiceInquiryPage from './pages/CustomerServiceInquiryPage';
import CustomerServiceConfirmPage from './pages/CustomerServiceConfirmPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ScreenshotGuidePage from './pages/ScreenshotGuidePage';

// Components
import BottomNavigation from './components/BottomNavigation';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/signin' || 
                     location.pathname === '/signup' || 
                     location.pathname === '/';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 mobile-container">
      <Routes>
        <Route path="/screenshots" element={<ScreenshotGuidePage />} />
        <Route path="/" element={<SplashPage />} />
        <Route 
          path="/signin" 
          element={<SignInPage />} 
        />
        <Route 
          path="/signup" 
          element={<SignUpPage />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={user ? <HomePage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/search" 
          element={user ? <SearchPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/cart" 
          element={user ? <CartPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <ProfilePage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/profile/edit" 
          element={user ? <EditProfilePage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/order" 
          element={user ? <OrderPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/order/history" 
          element={user ? <OrderHistoryPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/order/status" 
          element={user ? <OrderStatusPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/payment" 
          element={user ? <PaymentPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/payment/success" 
          element={user ? <PaymentSuccessPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/locker/:orderId" 
          element={user ? <LockerInfoPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/delivery-status/:orderId" 
          element={user ? <DeliveryStatusPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/settings" 
          element={user ? <SettingsPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/notifications" 
          element={user ? <NotificationsPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/mypage" 
          element={user ? <MyPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/customer-service" 
          element={user ? <CustomerServicePage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/customer-service/inquiry" 
          element={user ? <CustomerServiceInquiryPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/customer-service/confirm" 
          element={user ? <CustomerServiceConfirmPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/item/:id" 
          element={user ? <ItemDetailPage /> : <Navigate to="/signin" />} 
        />
      </Routes>

      {/* Bottom Navigation - 인증된 페이지에서만 표시 */}
      {user && !isAuthPage && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

