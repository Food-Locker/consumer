import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/mongodb';

/**
 * Firebase 인증과 MongoDB 사용자 정보를 통합 관리하는 커스텀 훅
 * 
 * @param {boolean} autoFetch - 컴포넌트 마운트 시 자동으로 사용자 정보를 가져올지 여부 (기본: true)
 * @returns {object} 사용자 정보 및 관련 함수들
 */
const useUser = (autoFetch = true) => {
  // Firebase 인증 상태
  const [firebaseUser, firebaseLoading, firebaseError] = useAuthState(auth);
  
  // MongoDB 사용자 정보 상태
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * MongoDB에서 사용자 정보를 가져오는 함수
   */
  const fetchUserInfo = useCallback(async () => {
    if (!firebaseUser?.uid) {
      setUserInfo(null);
      setError(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await api.getUser(firebaseUser.uid);
      setUserInfo(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      console.error('사용자 정보 가져오기 오류:', err);
      const errorMessage = err.message || '사용자 정보를 가져오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setLoading(false);
      setUserInfo(null);
      return null;
    }
  }, [firebaseUser?.uid]);

  /**
   * 사용자 정보를 강제로 새로고침하는 함수
   */
  const refreshUserInfo = useCallback(async () => {
    return await fetchUserInfo();
  }, [fetchUserInfo]);

  /**
   * 사용자 정보를 업데이트하는 함수
   * @param {object} updatedData - 업데이트할 사용자 데이터
   */
  const updateUserInfo = useCallback(async (updatedData) => {
    if (!firebaseUser?.uid) {
      const errorMsg = '로그인된 사용자가 없습니다.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);

    try {
      await api.updateUser(firebaseUser.uid, updatedData);
      // 업데이트 후 최신 정보 가져오기
      const userData = await api.getUser(firebaseUser.uid);
      setUserInfo(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      console.error('사용자 정보 업데이트 오류:', err);
      const errorMessage = err.message || '사용자 정보를 업데이트하는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [firebaseUser?.uid]);

  /**
   * 사용자 정보를 초기화하는 함수 (로그아웃 시 사용)
   */
  const clearUserInfo = useCallback(() => {
    setUserInfo(null);
    setError(null);
    setLoading(false);
  }, []);

  // autoFetch가 true이고 Firebase 사용자가 있으면 자동으로 사용자 정보 가져오기
  useEffect(() => {
    if (autoFetch) {
      if (firebaseUser && !firebaseLoading) {
        fetchUserInfo();
      } else if (!firebaseUser && !firebaseLoading) {
        clearUserInfo();
      }
    }
  }, [firebaseUser, firebaseLoading, autoFetch, fetchUserInfo, clearUserInfo]);

  // Firebase 사용자가 변경되면 사용자 정보도 초기화
  useEffect(() => {
    if (!firebaseUser && !firebaseLoading) {
      clearUserInfo();
    }
  }, [firebaseUser, firebaseLoading, clearUserInfo]);

  // 통합 로딩 상태 (Firebase 인증 로딩 또는 MongoDB 데이터 로딩)
  const isLoading = loading || firebaseLoading;

  // 통합 에러 상태
  const combinedError = error || firebaseError;

  // 편의 속성들
  const isAuthenticated = !!firebaseUser;
  const userId = firebaseUser?.uid || null;
  const userName = userInfo?.name || firebaseUser?.displayName || null;
  const userEmail = userInfo?.email || firebaseUser?.email || null;
  const userPhone = userInfo?.phone || null;

  return {
    // Firebase 인증 관련
    firebaseUser,
    firebaseLoading,
    firebaseError,
    
    // MongoDB 사용자 정보 관련
    userInfo,
    loading: isLoading,
    error: combinedError,
    
    // 함수들
    fetchUserInfo,
    refreshUserInfo,
    updateUserInfo,
    clearUserInfo,
    
    // 편의 속성
    isAuthenticated,
    userId, // Firebase UID (락커 배정 API 등에서 사용)
    userName,
    userEmail,
    userPhone,
  };
};

export default useUser;

