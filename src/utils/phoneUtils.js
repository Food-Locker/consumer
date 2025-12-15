// 전화번호 포맷팅 유틸리티
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '');
  
  // 한국 전화번호 형식 (010-XXXX-XXXX)
  if (numbers.length === 11 && numbers.startsWith('010')) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  }
  
  // 10자리 번호 (02-XXXX-XXXX 등)
  if (numbers.length === 10) {
    if (numbers.startsWith('02')) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  
  // 이미 포맷팅된 번호는 그대로 반환
  if (phone.includes('-')) {
    return phone;
  }
  
  // 그 외의 경우 원본 반환
  return phone;
};

