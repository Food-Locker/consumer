# Food Locker Consumer App

소비자용 모바일 웹 애플리케이션입니다. 야구장 관람객이 음식을 주문하고 락커에서 픽업할 수 있습니다.

## 기술 스택

- React 18
- Vite
- Tailwind CSS
- Firebase Authentication
- Zustand (상태 관리)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어서 Firebase 설정과 API 서버 URL을 입력하세요

# 개발 서버 실행
npm run dev
```

앱은 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 환경 변수

`.env` 파일에 다음 변수를 설정하세요:

### Firebase (인증용)
- `VITE_FIREBASE_API_KEY`: Firebase API Key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID
- `VITE_FIREBASE_APP_ID`: Firebase App ID

### API 서버
- `VITE_API_BASE_URL`: 백엔드 API 서버 URL (예: `http://localhost:3001`)

## 주요 기능

- 🔐 사용자 인증 (이메일/비밀번호, 소셜 로그인)
- 🏠 홈 화면 (카테고리별 메뉴 탐색)
- 🔍 검색 화면 (야구장 → 카테고리 → 브랜드 → 메뉴)
- 🛒 장바구니
- 💳 결제 (시뮬레이션)
- 📦 주문 현황 및 배달 추적
- 📱 다크모드/라이트모드

## 프로젝트 구조

```
consumer/
├── src/
│   ├── pages/          # 페이지 컴포넌트
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── store/          # Zustand 상태 관리
│   ├── lib/            # API 클라이언트 및 Firebase 설정
│   └── utils/          # 유틸리티 함수
├── public/             # 정적 파일 (이미지 등)
└── .env                # 환경 변수
```

## 백엔드 서버 연동

이 앱은 별도의 백엔드 API 서버와 통신합니다. 백엔드 서버가 실행 중이어야 정상적으로 작동합니다.

백엔드 서버 실행:
```bash
cd ../backend
npm install
npm start
```

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

