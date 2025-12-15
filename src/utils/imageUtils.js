// public 폴더에서 이미지 경로를 가져오는 유틸리티 함수

/**
 * 아이템 이름을 기반으로 public 폴더의 이미지 경로를 반환
 * @param {string} name - 아이템 이름
 * @returns {string|null} 이미지 경로 또는 null
 */
export const getImagePath = (name) => {
  if (!name) return null;
  
  // 한글 이름을 영문 파일명으로 매핑
  const imageMap = {
    // 기존 아이템
    '황금올리브핫윙': '/Golden-Olive-Hot.png',
    '황금올리브치킨': '/Golden-Olive.png',
    '황금올리브닭다리': '/Chicken-Leg.png',
    '김치말이국수': '/kimchi-mari.png',
    'Sandwich': '/sandwich.png',
    '샌드위치': '/sandwich.png',
    'Hamburger': '/hamburger.png',
    '햄버거': '/hamburger.png',
    'Burger': '/hamburger.png',
    '버거': '/hamburger.png',
    'Pizza': '/pizza.png',
    '피자': '/pizza.png',
    'Drinks': '/drinks.png',
    '음료': '/drinks.png',
    'Cola': '/drinks.png',
    '콜라': '/drinks.png',
    
    // 잠실야구장 - 통빱
    '삼겹살 정식': '/samgyeopsal-jeongshik.png',
    
    // 잠실야구장 - 잭슨피자
    '수퍼 잭슨 (P)': '/super-jackson.png',
    '하와이안 (P)': '/hawaiian.png',
    
    // 잠실야구장 - 파오파오
    '새우만두': '/shrimp-mandu.png',
    '내맘대로 3인분 세트': '/naemamdaero-set.png',
    
    // 고척 스카이돔 - 쉬림프 쉐프
    '크림새우': '/cream-shrimp.png',
    '마라크림새우': '/mala-cream-shrimp.png',
    
    // 고척 스카이돔 - 백남옥달인손만두
    '고기통만두': '/meat-mandu.png',
    '김치통만두': '/kimchi-mandu.png',
    
    // 고척 스카이돔 - 올드페리도넛
    '버터 피스타치오': '/butter-pistachio.png',
    '크림브륄레': '/creme-brulee.png',
    
    // 인천 SSG 랜더스필드 - 스테이션
    // '크림새우': '/cream-shrimp.png', (중복)
    
    // 인천 SSG 랜더스필드 - 스타벅스
    '레드 파워 스매시 블렌디드': '/red-power-smash-blended.png',
    '아이스 아메리카노': '/ice-americano.png',
    
    // 수원 KT 위즈파크 - 진미통닭
    '후라이드 치킨': '/fried-chicken.png',
    '양념치킨': '/yangnyeom-chicken.png',
    
    // 수원 KT 위즈파크 - 보영만두
    '군만두': '/gun-mandu.png',
    '쫄면': '/jolmyeon.png',
    
    // 광주-기아 챔피언스 필드 - 광주제일햄버고
    '제일버거': '/jeil-burger.png',
    '하와이안버거': '/hawaiian-burger.png',
    
    // 광주-기아 챔피언스 필드 - 마성떡볶이
    '마성떡볶이': '/maseong-tteokbokki.png',
    '찰순대': '/chal-sundae.png',
    
    // 창원 NC 파크 - 코아양과
    '밀크쉐이크': '/milkshake.png',
    '꿀카스테라': '/honey-castella.png',
    
    // 창원 NC 파크 - 알통떡강정
    '알통삼총사 세트': '/altong-samchongsa-set.png',
    '크리스피 치킨': '/crispy-chicken.png',
    
    // 대구 삼성 라이온즈 파크 - 해피치즈스마일
    '베이직 떡볶이': '/basic-tteokbokki.png',
    '돈까스 플레이트': '/donkatsu-plate.png',
    
    // 대구 삼성 라이온즈 파크 - 땅땅치킨
    '허브순살': '/herb-boneless-chicken.png',
    
    // 대전 한화생명 이글스파크 - 빽보이피자
    '슈퍼빽보이피자': '/super-paikboy-pizza.png',
    '울트라빽보이피자': '/ultra-paikboy-pizza.png',
    
    // 대전 한화생명 이글스파크 - 연돈볼카츠
    '볼카츠': '/ball-katsu.png',
    '볼카츠버거': '/ball-katsu-burger.png',
    
    // 부산 사직야구장 - 33떡볶이
    '가래떡떡볶이': '/garae-tteokbokki.png',
    '로제떡볶이': '/rose-tteokbokki.png',
    
    // 부산 사직야구장 - 다리집
    '떡볶이': '/tteokbokki.png',
    '오징어튀김': '/squid-tempura.png',
  };
  
  // 정확한 매칭 시도
  if (imageMap[name]) {
    return imageMap[name];
  }
  
  // 부분 매칭 시도
  for (const [key, value] of Object.entries(imageMap)) {
    if (name.includes(key) || key.includes(name)) {
      return value;
    }
  }
  
  // 기본 이미지 시도 (이름 기반)
  const sanitizedName = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  return sanitizedName ? `/${sanitizedName}.png` : null;
};

/**
 * 카테고리 이름을 기반으로 이미지 경로 반환
 * @param {string} categoryName - 카테고리 이름
 * @returns {string} 이미지 경로
 */
export const getCategoryImage = (categoryName) => {
  const categoryMap = {
    // 기존 카테고리
    'Sandwich': '/sandwich.png',
    '샌드위치': '/sandwich.png',
    'Pizza': '/pizza.png',
    '피자': '/pizza.png',
    'Burger': '/hamburger.png',
    '버거': '/hamburger.png',
    'Hamburger': '/hamburger.png',
    'Drinks': '/drinks.png',
    '음료': '/drinks.png',
    
    // DB 카테고리 매핑
    '식사 & 면 요리': '/samgyeopsal-jeongshik.png',
    '식사': '/samgyeopsal-jeongshik.png',
    'Noodle & Meal': '/samgyeopsal-jeongshik.png',
    '피자': '/super-jackson.png',
    'Pizza': '/super-jackson.png',
    '만두': '/meat-mandu.png',
    'Dumpling': '/meat-mandu.png',
    '새우 & 치킨': '/cream-shrimp.png',
    '새우': '/cream-shrimp.png',
    'Shrimp & Chicken': '/cream-shrimp.png',
    '디저트': '/milkshake.png',
    'Dessert': '/milkshake.png',
    '시그니처': '/creme-brulee.png',
    'Signature Shrimp': '/creme-brulee.png',
    '카페': '/ice-americano.png',
    'Cafe': '/ice-americano.png',
    '치킨': '/fried-chicken.png',
    'Chicken': '/fried-chicken.png',
    '분식': '/tteokbokki.png',
    'Dumpling & Noodle': '/tteokbokki.png',
    'Snack': '/snack.png',
    '베이커리 & 카페': '/honey-castella.png',
    '베이커리': '/honey-castella.png',
    'Bakery & Cafe': '/honey-castella.png',
    '스낵': '/snack.png',
    '버거': '/jeil-burger.png',
    'Burger': '/jeil-burger.png',
  };
  
  return categoryMap[categoryName] || '/hamburger.png';
};

