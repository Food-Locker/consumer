// MongoDB API 클라이언트
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const api = {
  // Stadiums
  getStadiums: async () => {
    const response = await fetch(`${API_BASE_URL}/api/stadiums`);
    if (!response.ok) throw new Error('Stadiums를 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  // Categories
  getCategories: async (stadiumId) => {
    const response = await fetch(`${API_BASE_URL}/api/stadiums/${stadiumId}/categories`);
    if (!response.ok) throw new Error('Categories를 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  // Brands
  getBrands: async (categoryId) => {
    const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}/brands`);
    if (!response.ok) throw new Error('Brands를 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  // Items
  getItems: async (brandId) => {
    const response = await fetch(`${API_BASE_URL}/api/brands/${brandId}/items`);
    if (!response.ok) throw new Error('Items를 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  getAllItems: async (categoryId) => {
    const url = categoryId 
      ? `${API_BASE_URL}/api/items?categoryId=${categoryId}`
      : `${API_BASE_URL}/api/items`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Items를 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  // Orders
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('주문 생성 중 오류가 발생했습니다.');
    return response.json();
  },

  getOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    if (!response.ok) throw new Error('주문을 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  getOrders: async (userId, status) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (status) params.append('status', status);
    const response = await fetch(`${API_BASE_URL}/api/orders?${params.toString()}`);
    if (!response.ok) throw new Error('주문을 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('주문 상태 업데이트 중 오류가 발생했습니다.');
    return response.json();
  },

  // Users
  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        // 404 에러인 경우 서버가 실행되지 않은 것으로 간주
        if (response.status === 404) {
          console.warn('백엔드 서버가 실행되지 않았습니다. MongoDB 저장을 건너뜁니다.');
          return null;
        }
        throw new Error('사용자 생성 중 오류가 발생했습니다.');
      }
      return response.json();
    } catch (error) {
      // 네트워크 오류나 서버 오류 시에도 에러를 던지지 않고 null 반환
      console.warn('MongoDB 사용자 저장 실패:', error.message);
      return null;
    }
  },

  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
    if (!response.ok) throw new Error('사용자를 가져오는 중 오류가 발생했습니다.');
    return response.json();
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('사용자 정보 업데이트 중 오류가 발생했습니다.');
    return response.json();
  }
};

// 실시간 업데이트를 위한 폴링 함수
export const pollOrderStatus = (orderId, callback, interval = 2000) => {
  const poll = async () => {
    try {
      const order = await api.getOrder(orderId);
      callback(order);
    } catch (error) {
      console.error('주문 상태 폴링 오류:', error);
    }
  };

  poll(); // 즉시 한 번 실행
  const intervalId = setInterval(poll, interval);

  return () => clearInterval(intervalId);
};

