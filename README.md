# ⚡ PowerShare - 커뮤니티 에너지 공유 플랫폼

**PowerShare**는 커뮤니티 내에서 **P2P 전력 공유**를 가능하게 하는 풀스택 웹 애플리케이션입니다.  
에너지 생산자(예: 태양광 패널, 풍력 터빈, 배터리 저장장치)와 소비자를 연결하여 **실시간 에너지 거래 및 분배**를 지원합니다.

<img width="2382" height="1176" alt="image" src="https://github.com/user-attachments/assets/5e83b453-8ae9-4e0d-87fd-8022d0a79edf" />

<img width="1874" height="1284" alt="image" src="https://github.com/user-attachments/assets/e0928c24-9257-48d2-ba55-3816b688f662" />

---

## 🏗 시스템 아키텍처

### 프론트엔드 아키텍처
- **프레임워크**: React 18 (TypeScript 기반)
- **라우팅**: Wouter (경량 클라이언트 사이드 라우팅)
- **상태 관리**: TanStack Query (서버 상태 관리)
- **UI 프레임워크**: Tailwind CSS + shadcn/ui
- **실시간 업데이트**: WebSocket 클라이언트
- **디자인**: 모바일 우선 반응형 UI

### 백엔드 아키텍처
- **실행환경**: Node.js + Express.js
- **언어**: TypeScript (ES 모듈 기반)
- **ORM**: Drizzle ORM (타입 안전)
- **API**: RESTful JSON API
- **실시간 통신**: WebSocket 서버

### 데이터베이스 아키텍처
- **DB**: PostgreSQL (Neon 서버리스 환경)
- **스키마 관리**: Drizzle 마이그레이션
- **연결 풀링**: Neon 서버리스 풀링

---

## ⚙ 주요 기능 구성

### 🔋 에너지 관리 시스템
- 에너지 공급자: 태양광, 풍력, 배터리 저장
- 에너지 요청: 소비자의 요청 및 긴급도 설정
- 에너지 거래: 전체 거래 라이프사이클 추적
- 실시간 모니터링: 생산/소비 시각화 대시보드

### 👥 사용자 관리
- 사용자 유형: 공급자 / 소비자 / 하이브리드
- 프로필 설정: 위치 기반 + 선호도 기반
- 커뮤니티 통계: 에너지 총 사용 및 공유량 표시

### 🔄 실시간 기능
- WebSocket 실시간 통신
- 즉시 알림: 요청, 거래 성사, 완료 등
- 에너지 흐름 실시간 대시보드

### 🧭 UI/UX 구성
- 모바일 내비게이션: 하단 탭 구조
- 에너지 캘린더: 예측 및 예약 공유
- 인터랙티브 지도: 지역별 공급자 시각화
- 거래 내역: 최근 거래 확인 가능

---

## 🔁 데이터 흐름

### 📥 에너지 요청 흐름
1. 소비자가 요청 등록 (요청량, 긴급도, 가격)
2. WebSocket을 통해 공급자에게 브로드캐스트
3. 위치/가용성 기반 자동 매칭
4. 거래 성사 → 트랜잭션 생성
5. 실시간 알림 전송

### ⚡ 에너지 데이터 업데이트
1. 공급자가 수동 또는 자동으로 데이터 입력
2. DB에 반영 → WebSocket을 통해 데이터 전송
3. 프론트엔드 UI 자동 갱신

### 🔄 거래 처리 흐름
1. 공급자와 요청 매칭
2. 거래 기록 저장
3. 에너지 전달 및 상태 추적
4. (향후 구현) 결제 처리
5. 거래 완료 → 커뮤니티 통계 갱신

---

## 🧩 외부 의존성

### 📦 핵심 라이브러리
- `@neondatabase/serverless` : PostgreSQL 서버리스 연결
- `drizzle-orm` : 타입 안전 ORM
- `@tanstack/react-query` : 서버 상태 관리
- `@radix-ui/***` : 접근성 높은 UI 구성 요소
- `tailwindcss` : 유틸리티 기반 CSS
- `wouter` : 경량 라우터

### 🛠 개발 도구
- `Vite` : 빠른 개발 서버 및 번들러
- `TypeScript` : 정적 타입 지원
- `ESBuild` : 고속 빌드 도구

### 🌐 실시간 통신
- `ws` : Node.js용 WebSocket 서버
- 브라우저 WebSocket API 사용

---

## 🚀 배포 전략

### 개발 환경
- Vite Dev Server: 핫 리로드 지원
- TypeScript: 실시간 타입 검사
- Drizzle: DB 스키마 마이그레이션

### 프로덕션 환경
- **클라이언트**: `Vite` → `dist/public`에 정적 빌드
- **서버**: `ESBuild` → `dist/index.js`로 번들링
- **DB**: Neon PostgreSQL 서버리스 환경
- **환경 변수**: `DATABASE_URL` 사용

### 배포 구성
- 클라이언트 & 서버 통합 빌드
- 정적 자산은 `dist/public`에서 제공
- API 경로: `/api/*` (Express 처리)
- WebSocket 경로: `/ws` 에서 연결 처리

---

## 📅 변경 이력 (Changelog)
