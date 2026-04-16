# 🌷 몽글데이

몽글데이는 날짜 흐름에 맞춰 할 일을 정리할 수 있는 캘린더형 투두 앱입니다.  
단순한 체크리스트를 넘어서 월간, 주간, 일간 화면으로 나누어 하루와 한 주, 한 달의 계획을 더 편하게 바라볼 수 있도록 구성했습니다.

## ✨ 소개

오래전에 만들었던 투두 프로젝트를 다시 다듬으면서,

- 더 부드럽고 귀여운 분위기의 UI로 바꾸고
- 한 화면에 몰려 있던 정보를 페이지별로 나누고
- 날짜 중심으로 일정을 관리할 수 있도록 구조를 개선했습니다

기록 자체보다도, 일상을 가볍게 정리하는 경험에 조금 더 집중한 앱입니다.

## 🩷 앱 미리보기

앱 미리보기 이미지는 추후 추가 예정입니다.  
스크린샷을 준비하면 아래 경로처럼 README에 바로 연결할 수 있습니다.

```md
![몽글데이 미리보기](./docs/images/monggeulday-preview.png)
```

## 📸 주요 화면 캡처

현재 저장소에는 화면 캡처 이미지가 포함되어 있지 않아 섹션만 먼저 정리했습니다.

| 화면 | 설명 |
| --- | --- |
| 홈 | 오늘의 할 일과 진행률을 한눈에 볼 수 있는 메인 화면 |
| 월간 | 한 달 일정과 날짜별 할 일 개수를 확인하는 화면 |
| 주간 | 일주일 단위로 날짜를 가로로 살펴보는 화면 |
| 일간 | 선택한 날짜의 할 일을 집중해서 관리하는 화면 |
| 스플래시 | 앱 진입 시 몽글한 분위기로 시작되는 인트로 화면 |

스크린샷 파일을 추가할 때는 예를 들어 이런 식으로 넣으면 됩니다.

```md
### 홈 화면
![홈 화면](./docs/images/home.png)

### 월간 화면
![월간 화면](./docs/images/month.png)

### 주간 화면
![주간 화면](./docs/images/week.png)

### 일간 화면
![일간 화면](./docs/images/day.png)
```

## 🔗 배포 링크

현재 공개 배포 링크는 아직 연결되지 않았습니다.

- GitHub 저장소: https://github.com/jiwoo4rang/MyTodoApp
- 웹 배포 링크: 추후 추가 예정

배포를 진행하게 되면 `Expo`, `Vercel`, `Netlify`, `GitHub Pages` 같은 방식으로 연결할 수 있습니다.

## 🗓️ 주요 기능

- 홈, 월간, 주간, 일간 페이지 분리
- 날짜별 할 일 추가, 완료, 삭제
- 선택한 날짜 기준 일정 관리
- 월간 캘린더에서 날짜별 일정 개수 확인
- 주간 화면에서 한 주 일정 가로 탐색
- 로컬 저장소 `AsyncStorage` 기반 데이터 유지
- 앱 시작 시 스플래시 화면과 부드러운 화면 전환
- 하트형 체크 UI와 파스텔 톤 스타일

## 🛠️ 기술 스택

- Expo
- React Native
- React Native Web
- AsyncStorage
- Expo Google Fonts
- Expo Vector Icons

## 📁 프로젝트 구조

```text
MyTodoApp-master/
├─ App.js
├─ app/
│  └─ components/
│     ├─ Header.js
│     ├─ Input.js
│     ├─ Listitem.js
│     └─ Subtitle.js
├─ app.json
├─ babel.config.js
├─ package.json
└─ README.md
```

## 🚀 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run web
```

실행 후 브라우저에서 안내된 주소로 접속하면 됩니다.  
로컬 실행 예시는 `http://localhost:8082` 입니다.

## 📜 사용 가능한 스크립트

```bash
npm start
npm run web
npm run android
npm run ios
```

## 📝 프로젝트 메모

- 현재 앱 이름은 `몽글데이`입니다.
- Expo 기반으로 웹, iOS, Android 실행을 지원합니다.
- 개인 일정 관리용 감성 캘린더 투두 앱을 목표로 정리한 프로젝트입니다.

## 💻 저장소

- GitHub: https://github.com/jiwoo4rang/MyTodoApp
