# 🚦 공기 신호등

실시간 미세먼지를 신호등 색으로 한눈에 보여주고, 지역별 날씨까지 함께 확인하는 웹앱(PWA)입니다.

## 주요 기능

- **공기 신호등**: 선택한 시·도의 평균 미세먼지(PM10)를 좋음🔵 / 보통🟢 / 나쁨🟠 / 매우나쁨🔴 으로 표시
- **지역별 실시간 날씨**: 구·시·군별 기온, 체감 온도, 습도, 바람, 강수확률 (10분마다 자동 갱신)
- **시간대별 기온 그래프**: 향후 24시간 기온·체감 온도·강수확률
- **주간 날씨 예보**: 7일 최저/최고 기온, 강수확률, 일출·일몰
- **오늘의 해**: 일출·일몰 시각, 낮 길이, 현재 해 위치
- **대기질·날씨 지도**: 측정소별 미세먼지 마커 + 지역별 기온 라벨 (켜기/끄기 가능)
- **미세먼지 TOP 10 그래프**, 측정소별 상세 카드

## 데이터 출처

- 미세먼지: [공공데이터포털 – 한국환경공단 에어코리아 대기오염정보](https://www.data.go.kr/data/15073861/openapi.do) (인증키 필요)
- 날씨: [Open-Meteo](https://open-meteo.com/) (인증키 불필요)

## 폴더 구조

```
├── index.html       화면 구조
├── style.css        디자인
├── script.js        데이터 조회 · 그래프 · 지도 로직
├── api/dust.js      Vercel 서버리스 함수 (에어코리아 API 중계, 인증키 숨김)
├── manifest.json    PWA 설정
├── sw.js            서비스 워커 (오프라인 캐시)
├── icons/           앱 아이콘
├── server.js        로컬 테스트용 서버 (Vercel 배포에는 사용 안 함)
└── .env.example     환경변수 예시
```

## 로컬에서 실행

1. `.env.example` 을 복사해 `.env.local` 로 이름을 바꾸고 에어코리아 인증키를 입력
2. 실행
   ```bash
   node server.js
   ```
3. 브라우저에서 http://localhost:3000 접속

## Vercel 배포

1. 이 저장소를 GitHub 에 올린 뒤 Vercel 에서 **Import Project**
2. Framework Preset: **Other** (빌드 설정 없음)
3. **Settings → Environment Variables** 에 `AIRKOREA_KEY` 등록
4. Deploy
