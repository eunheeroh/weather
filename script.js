// Vercel 서버리스 함수 엔드포인트 경로
const API_URL = "/api/dust";

// 시·도별 대표 위경도 좌표 및 기본 줌 레벨 테이블
const SIDO_COORDS = {
  "서울": { lat: 37.5665, lon: 126.9780, zoom: 11 },
  "부산": { lat: 35.1796, lon: 129.0756, zoom: 11 },
  "대구": { lat: 35.8714, lon: 128.6014, zoom: 11 },
  "인천": { lat: 37.4563, lon: 126.7052, zoom: 11 },
  "광주": { lat: 35.1595, lon: 126.8526, zoom: 11 },
  "대전": { lat: 36.3504, lon: 127.3845, zoom: 11 },
  "울산": { lat: 35.5384, lon: 129.3114, zoom: 11 },
  "세종": { lat: 36.4800, lon: 127.2890, zoom: 11 },
  "경기": { lat: 37.4138, lon: 127.5183, zoom: 9 },
  "강원": { lat: 37.8228, lon: 128.1555, zoom: 8 },
  "충북": { lat: 36.6357, lon: 127.4912, zoom: 9 },
  "충남": { lat: 36.5184, lon: 126.8000, zoom: 9 },
  "전북": { lat: 35.7175, lon: 127.1530, zoom: 9 },
  "전남": { lat: 34.8679, lon: 126.9910, zoom: 8 },
  "경북": { lat: 36.4919, lon: 128.8889, zoom: 8 },
  "경남": { lat: 35.4606, lon: 128.2132, zoom: 9 },
  "제주": { lat: 33.4996, lon: 126.5312, zoom: 10 },
  "전국": { lat: 36.2000, lon: 127.8000, zoom: 7 }
};

// 주요 측정소 대표 좌표 (서울 25개 구 및 주요 도시 측정소 매핑)
const STATION_COORDS = {
  // 서울 구별 측정소
  "종로구": [37.5720, 127.0050], "중구": [37.5636, 126.9975], "용산구": [37.5326, 126.9900],
  "성동구": [37.5509, 127.0409], "광진구": [37.5481, 127.0857], "동대문구": [37.5744, 127.0397],
  "중랑구": [37.5953, 127.0939], "성북구": [37.6069, 127.0235], "강북구": [37.6396, 127.0255],
  "도봉구": [37.6658, 127.0422], "노원구": [37.6542, 127.0568], "은평구": [37.6027, 126.9291],
  "서대문구": [37.5791, 126.9368], "마포구": [37.5637, 126.9084], "양천구": [37.5169, 126.8665],
  "강서구": [37.5509, 126.8495], "구로구": [37.4954, 126.8874], "금천구": [37.4568, 126.8954],
  "영등포구": [37.5264, 126.8962], "동작구": [37.5124, 126.9393], "관악구": [37.4784, 126.9516],
  "서초구": [37.4837, 127.0324], "강남구": [37.5172, 127.0473], "송파구": [37.5145, 127.1058],
  "강동구": [37.5301, 127.1238],
  // 주요 시·도 대표 측정소
  "해운대": [35.1631, 129.1636], "광안리": [35.1532, 129.1186], "서면": [35.1578, 129.0592],
  "수성구": [35.8580, 128.6300], "동성로": [35.8690, 128.5960], "송도": [37.3850, 126.6500],
  "부평": [37.4890, 126.7240], "유성": [36.3620, 127.3560], "둔산": [36.3550, 127.3840],
  "수원": [37.2636, 127.0286], "성남": [37.4200, 127.1265], "고양": [37.6584, 126.8320],
  "용인": [37.2410, 127.1775], "춘천": [37.8813, 127.7298], "원주": [37.3422, 127.9202],
  "강릉": [37.7519, 128.8761], "청주": [36.6424, 127.4890], "천안": [36.8151, 127.1139],
  "전주": [35.8242, 127.1480], "여수": [34.7604, 127.6622], "순천": [34.9506, 127.4872],
  "포항": [36.0190, 129.3435], "구미": [36.1195, 128.3446], "창원": [35.2280, 128.6811],
  "진주": [35.1802, 128.1076], "제주시": [33.5000, 126.5200], "서귀포": [33.2541, 126.5601]
};

// 시·도별 세부 지역(구·시·군) 날씨 조회용 좌표 테이블 [이름, 위도, 경도]
// ※ 서울은 위 STATION_COORDS의 25개 구 좌표를 그대로 사용, 전국은 시·도 대표 좌표 사용
const REGION_WEATHER_POINTS = {
  "부산": [["중구",35.1063,129.0323],["서구",35.0979,129.0243],["동구",35.1293,129.0454],["영도구",35.0911,129.0679],["부산진구",35.1629,129.0532],["동래구",35.2049,129.0837],["남구",35.1365,129.0843],["북구",35.1972,128.9903],["해운대구",35.1631,129.1636],["사하구",35.1046,128.9748],["금정구",35.2428,129.0922],["강서구",35.2122,128.9806],["연제구",35.1762,129.0800],["수영구",35.1455,129.1131],["사상구",35.1526,128.9910],["기장군",35.2446,129.2222]],
  "대구": [["중구",35.8693,128.6062],["동구",35.8866,128.6355],["서구",35.8718,128.5592],["남구",35.8460,128.5974],["북구",35.8858,128.5828],["수성구",35.8581,128.6307],["달서구",35.8298,128.5326],["달성군",35.7746,128.4314],["군위군",36.2428,128.5728]],
  "인천": [["중구",37.4738,126.6216],["동구",37.4738,126.6432],["미추홀구",37.4635,126.6505],["연수구",37.4100,126.6783],["남동구",37.4470,126.7314],["부평구",37.5070,126.7219],["계양구",37.5372,126.7376],["서구",37.5455,126.6760],["강화군",37.7466,126.4880],["옹진군(백령도)",37.9670,124.7170]],
  "광주": [["동구",35.1460,126.9230],["서구",35.1520,126.8900],["남구",35.1330,126.9026],["북구",35.1740,126.9120],["광산구",35.1396,126.7937]],
  "대전": [["동구",36.3120,127.4548],["중구",36.3255,127.4213],["서구",36.3555,127.3838],["유성구",36.3623,127.3562],["대덕구",36.3466,127.4156]],
  "울산": [["중구",35.5690,129.3328],["남구",35.5439,129.3301],["동구",35.5049,129.4166],["북구",35.5827,129.3613],["울주군",35.5622,129.1266]],
  "세종": [["정부세종청사",36.5040,127.2650],["세종시청",36.4800,127.2890],["조치원읍",36.6010,127.2980],["금남면",36.4600,127.2780],["전의면",36.6800,127.2000],["부강면",36.5270,127.3730]],
  "경기": [["수원",37.2636,127.0286],["성남",37.4200,127.1265],["고양",37.6584,126.8320],["용인",37.2410,127.1775],["부천",37.5034,126.7660],["안산",37.3219,126.8309],["안양",37.3943,126.9568],["남양주",37.6360,127.2165],["화성",37.1995,126.8312],["평택",36.9921,127.1129],["의정부",37.7381,127.0337],["파주",37.7600,126.7800],["시흥",37.3800,126.8030],["김포",37.6153,126.7156],["광주",37.4295,127.2550],["하남",37.5393,127.2149],["오산",37.1499,127.0775],["이천",37.2720,127.4350],["안성",37.0080,127.2797],["여주",37.2983,127.6370],["양평",37.4917,127.4875],["포천",37.8949,127.2003],["가평",37.8315,127.5105],["연천",38.0966,127.0748]],
  "강원": [["춘천",37.8813,127.7298],["원주",37.3422,127.9202],["강릉",37.7519,128.8761],["동해",37.5247,129.1143],["태백",37.1640,128.9856],["속초",38.2070,128.5918],["삼척",37.4500,129.1652],["홍천",37.6971,127.8888],["횡성",37.4917,127.9850],["영월",37.1837,128.4617],["평창",37.3708,128.3903],["정선",37.3807,128.6608],["철원",38.1467,127.3133],["화천",38.1063,127.7082],["양구",38.1100,127.9897],["인제",38.0697,128.1707],["고성",38.3806,128.4678],["양양",38.0754,128.6190]],
  "충북": [["청주",36.6424,127.4890],["충주",36.9910,127.9259],["제천",37.1326,128.1910],["보은",36.4894,127.7295],["옥천",36.3064,127.5714],["영동",36.1750,127.7764],["증평",36.7853,127.5815],["진천",36.8554,127.4356],["괴산",36.8154,127.7867],["음성",36.9403,127.6905],["단양",36.9845,128.3655]],
  "충남": [["천안",36.8151,127.1139],["공주",36.4465,127.1190],["보령",36.3333,126.6128],["아산",36.7898,127.0018],["서산",36.7848,126.4503],["논산",36.1870,127.0987],["계룡",36.2745,127.2487],["당진",36.8898,126.6459],["금산",36.1088,127.4881],["부여",36.2757,126.9098],["서천",36.0803,126.6919],["청양",36.4591,126.8022],["홍성",36.6012,126.6608],["예산",36.6826,126.8449],["태안",36.7456,126.2980]],
  "전북": [["전주",35.8242,127.1480],["군산",35.9676,126.7366],["익산",35.9483,126.9577],["정읍",35.5699,126.8559],["남원",35.4164,127.3904],["김제",35.8036,126.8809],["완주",35.9047,127.1622],["진안",35.7917,127.4249],["무주",36.0068,127.6608],["장수",35.6473,127.5212],["임실",35.6178,127.2890],["순창",35.3744,127.1374],["고창",35.4358,126.7020],["부안",35.7318,126.7334]],
  "전남": [["목포",34.8118,126.3922],["여수",34.7604,127.6622],["순천",34.9506,127.4872],["나주",35.0160,126.7108],["광양",34.9407,127.6959],["담양",35.3211,126.9882],["곡성",35.2820,127.2920],["구례",35.2025,127.4629],["고흥",34.6110,127.2850],["보성",34.7713,127.0800],["화순",35.0645,126.9865],["장흥",34.6816,126.9070],["강진",34.6420,126.7672],["해남",34.5734,126.5993],["영암",34.8000,126.6967],["무안",34.9904,126.4817],["함평",35.0659,126.5168],["영광",35.2772,126.5120],["장성",35.3018,126.7849],["완도",34.3110,126.7550],["진도",34.4868,126.2635],["신안",34.8335,126.3517]],
  "경북": [["포항",36.0190,129.3435],["경주",35.8562,129.2247],["김천",36.1398,128.1136],["안동",36.5684,128.7294],["구미",36.1195,128.3446],["영주",36.8057,128.6240],["영천",35.9733,128.9386],["상주",36.4109,128.1591],["문경",36.5865,128.1867],["경산",35.8251,128.7414],["의성",36.3527,128.6970],["청송",36.4360,129.0571],["영양",36.6667,129.1124],["영덕",36.4150,129.3653],["청도",35.6474,128.7340],["고령",35.7262,128.2629],["성주",35.9192,128.2829],["칠곡",35.9955,128.4017],["예천",36.6577,128.4528],["봉화",36.8931,128.7325],["울진",36.9930,129.4004],["울릉",37.4844,130.9057]],
  "경남": [["창원",35.2280,128.6811],["진주",35.1802,128.1076],["통영",34.8544,128.4332],["사천",35.0036,128.0642],["김해",35.2285,128.8894],["밀양",35.5038,128.7464],["거제",34.8806,128.6211],["양산",35.3350,129.0378],["의령",35.3222,128.2617],["함안",35.2725,128.4065],["창녕",35.5444,128.4924],["고성",34.9730,128.3222],["남해",34.8377,127.8924],["하동",35.0673,127.7513],["산청",35.4156,127.8734],["함양",35.5205,127.7252],["거창",35.6866,127.9095],["합천",35.5666,128.1657]],
  "제주": [["제주시",33.4996,126.5312],["서귀포",33.2541,126.5601],["애월",33.4630,126.3310],["한림",33.4114,126.2694],["조천",33.5380,126.6340],["성산",33.4370,126.9170],["표선",33.3260,126.8300],["대정",33.2260,126.2510],["한라산",33.3617,126.5292]]
};

// 지역별 날씨 자동 갱신 주기 (10분)
const WEATHER_REFRESH_MS = 10 * 60 * 1000;

// DOM 엘리먼트 참조
const sidoSelect = document.getElementById("sidoSelect");
const trafficSection = document.getElementById("trafficSection");
const trafficRegion = document.getElementById("trafficRegion");
const trafficEmoji = document.getElementById("trafficEmoji");
const trafficStatus = document.getElementById("trafficStatus");
const trafficValue = document.getElementById("trafficValue");
const trafficGuide = document.getElementById("trafficGuide");
const trafficTime = document.getElementById("trafficTime");
const statusMessage = document.getElementById("statusMessage");
const statusText = document.getElementById("statusText");
const chartSection = document.getElementById("chartSection");
const dustChartCanvas = document.getElementById("dustChart");
const stationCount = document.getElementById("stationCount");
const cardGrid = document.getElementById("cardGrid");

// 날씨 DOM 엘리먼트 참조
const weatherIcon = document.getElementById("weatherIcon");
const weatherDesc = document.getElementById("weatherDesc");
const weatherTemp = document.getElementById("weatherTemp");
const weatherApparentTemp = document.getElementById("weatherApparentTemp");
const weatherHumidity = document.getElementById("weatherHumidity");
const weatherWind = document.getElementById("weatherWind");

// 지역별 날씨 DOM 엘리먼트 참조
const regionWeatherDesc = document.getElementById("regionWeatherDesc");
const regionWeatherSort = document.getElementById("regionWeatherSort");
const regionWeatherRefresh = document.getElementById("regionWeatherRefresh");
const regionWeatherSummary = document.getElementById("regionWeatherSummary");
const regionWeatherGrid = document.getElementById("regionWeatherGrid");
const regionWeatherUpdated = document.getElementById("regionWeatherUpdated");

// 전역 차트 및 지도 인스턴스
let dustChartInstance = null;
let leafletMapInstance = null;
let markerLayerGroup = null;
let weatherLayerGroup = null;

// 시간대별 기온 그래프 관련
const hourlyRegionSelect = document.getElementById("hourlyRegionSelect");
const hourlyChartCanvas = document.getElementById("hourlyChart");
const hourlyStatus = document.getElementById("hourlyStatus");
let hourlyChartInstance = null;
let hourlyRequestId = 0;
let hourlyPoints = []; // 현재 드롭다운에 들어있는 지점 목록

// 주간 예보 관련
const weeklyList = document.getElementById("weeklyList");
const weeklyDesc = document.getElementById("weeklyDesc");
const sunCard = document.getElementById("sunCard");

// 지도 레이어 토글 버튼
const toggleDustLayer = document.getElementById("toggleDustLayer");
const toggleWeatherLayer = document.getElementById("toggleWeatherLayer");

// 지역별 날씨 상태 (마지막 조회 결과, 요청 순번, 자동 갱신 타이머)
let regionWeatherData = [];
let regionWeatherRequestId = 0;
let weatherRefreshTimer = null;

// 페이지가 처음 로드되면 기본 지역(서울)으로 데이터 조회 시작
window.addEventListener("DOMContentLoaded", () => {
  fetchAirQuality(sidoSelect.value);
});

// 사용자가 시·도 드롭다운을 변경했을 때 새로운 지역 데이터 조회
sidoSelect.addEventListener("change", (e) => {
  fetchAirQuality(e.target.value);
});

// 지역별 날씨 정렬 기준 변경 → 다시 그리기만 (재요청 없음)
regionWeatherSort.addEventListener("change", () => {
  renderRegionWeather();
});

// 지도 레이어 켜기/끄기
function bindLayerToggle(button, getLayer) {
  button.addEventListener("click", () => {
    const on = !button.classList.contains("active");
    button.classList.toggle("active", on);
    button.setAttribute("aria-pressed", String(on));
    const layer = getLayer();
    if (!leafletMapInstance || !layer) return;
    if (on) layer.addTo(leafletMapInstance);
    else leafletMapInstance.removeLayer(layer);
  });
}
bindLayerToggle(toggleDustLayer, () => markerLayerGroup);
bindLayerToggle(toggleWeatherLayer, () => weatherLayerGroup);

// 그래프 지역 드롭다운 변경 → 해당 지점 시간대별 기온 조회
hourlyRegionSelect.addEventListener("change", () => {
  fetchHourlyWeather();
});

// 날씨 카드 클릭 → 그 지역을 그래프에 표시하고 그래프로 스크롤
regionWeatherGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".rw-card");
  if (!card || card.dataset.index === undefined) return;
  // 카드 목록과 드롭다운이 같은 시·도 기준일 때만 연결 (hourlyPoints[0]은 시·도 중심)
  if (regionWeatherData.sido !== hourlyRegionSelect.dataset.sido) return;
  hourlyRegionSelect.value = card.dataset.index;
  fetchHourlyWeather();
  document.getElementById("hourlySection").scrollIntoView({ behavior: "smooth", block: "start" });
});

// 새로고침 버튼 → 즉시 날씨 다시 조회
regionWeatherRefresh.addEventListener("click", () => {
  refreshWeatherNow();
});

// 탭이 다시 보이게 되면 최신 날씨로 갱신 (백그라운드에 오래 있었던 경우 대비)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const last = regionWeatherData.fetchedAt || 0;
    if (Date.now() - last > WEATHER_REFRESH_MS) refreshWeatherNow();
  }
});

// 현재 선택된 시·도의 대표 날씨 + 지역별 날씨를 다시 불러오고 자동 갱신 타이머 재설정
function refreshWeatherNow() {
  const sidoName = sidoSelect.value;
  const regionInfo = SIDO_COORDS[sidoName] || SIDO_COORDS["서울"];
  fetchWeather(regionInfo.lat, regionInfo.lon);
  fetchRegionalWeather(sidoName);
  updateHourlyRegionOptions(sidoName);
  fetchHourlyWeather();
  scheduleWeatherRefresh();
}

// 그래프 지역 드롭다운을 선택된 시·도의 지점들로 채움 (같은 시·도면 선택 유지)
function updateHourlyRegionOptions(sidoName) {
  if (hourlyRegionSelect.dataset.sido === sidoName) return;
  hourlyRegionSelect.dataset.sido = sidoName;

  const regionInfo = SIDO_COORDS[sidoName] || SIDO_COORDS["서울"];
  const centerLabel = sidoName === "전국" ? "서울 (기본)" : `${sidoName} 전체 (중심)`;
  const center = sidoName === "전국"
    ? { name: "서울", lat: SIDO_COORDS["서울"].lat, lon: SIDO_COORDS["서울"].lon }
    : { name: sidoName, lat: regionInfo.lat, lon: regionInfo.lon };

  hourlyPoints = [center, ...getRegionWeatherPoints(sidoName)];
  hourlyRegionSelect.innerHTML = hourlyPoints
    .map((p, i) => `<option value="${i}">${i === 0 ? centerLabel : p.name}</option>`)
    .join("");
  hourlyRegionSelect.value = "0";
}

// 선택된 지점의 향후 24시간 기온/체감/강수확률 조회 후 그래프 렌더링
async function fetchHourlyWeather() {
  const requestId = ++hourlyRequestId;
  const point = hourlyPoints[Number(hourlyRegionSelect.value)] || hourlyPoints[0];
  if (!point) return;

  if (!hourlyChartInstance) {
    hourlyStatus.textContent = "불러오는 중...";
    hourlyStatus.style.display = "block";
  }

  const params = new URLSearchParams({
    latitude: point.lat,
    longitude: point.lon,
    hourly: "temperature_2m,apparent_temperature,precipitation_probability,weather_code,is_day",
    forecast_hours: "24",
    // 같은 요청으로 7일 주간 예보도 함께 받음
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,sunrise,sunset,daylight_duration",
    forecast_days: "7",
    wind_speed_unit: "ms",
    timezone: "Asia/Seoul",
  });

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) throw new Error(`날씨 API 오류 (${res.status})`);
    const json = await res.json();
    if (requestId !== hourlyRequestId) return; // 더 최근 요청이 있으면 무시

    hourlyStatus.style.display = "none";
    renderHourlyChart(point.name, json.hourly);
    renderWeeklyForecast(point.name, json.daily);
  } catch (err) {
    if (requestId !== hourlyRequestId) return;
    console.warn("시간대별 기온 / 주간 예보 로드 실패:", err);
    if (!hourlyChartInstance) {
      hourlyStatus.textContent = "시간대별 기온을 불러오지 못했습니다.";
      hourlyStatus.style.display = "block";
    }
    if (!weeklyList.querySelector(".wk-row")) {
      weeklyList.innerHTML = `<p class="region-weather-empty">주간 예보를 불러오지 못했습니다. 잠시 후 🔄 버튼을 눌러주세요.</p>`;
    }
  }
}

// 7일 주간 예보 렌더링: 요일 · 날씨 · 강수확률 · 최저~최고 온도 막대
function renderWeeklyForecast(placeName, daily) {
  const days = daily?.time || [];
  if (days.length === 0) return;

  weeklyDesc.textContent = `${placeName} 기준 · 위 시간대별 그래프에서 지역을 바꿀 수 있어요`;

  // 오늘의 일출·일몰 카드
  renderSunCard(placeName, daily);

  // 온도 막대 위치 계산을 위한 주간 전체 최저/최고
  const mins = daily.temperature_2m_min.filter((v) => typeof v === "number");
  const maxs = daily.temperature_2m_max.filter((v) => typeof v === "number");
  const weekMin = Math.min(...mins);
  const weekMax = Math.max(...maxs);
  const span = Math.max(weekMax - weekMin, 1);

  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

  weeklyList.innerHTML = days
    .map((dateStr, i) => {
      // "YYYY-MM-DD"를 로컬 날짜로 해석 (UTC 해석으로 하루 밀리는 문제 방지)
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      const dow = date.getDay();
      const dayName = i === 0 ? "오늘" : i === 1 ? "내일" : `${WEEKDAYS[dow]}요일`;
      const dayClass = dow === 0 ? "wk-sun" : dow === 6 ? "wk-sat" : "";

      const info = getWeatherCodeInfo(daily.weather_code[i]);
      const tMin = daily.temperature_2m_min[i];
      const tMax = daily.temperature_2m_max[i];
      const rainProb = daily.precipitation_probability_max[i];
      const rainSum = daily.precipitation_sum[i];
      const wind = daily.wind_speed_10m_max[i];

      const hasTemps = typeof tMin === "number" && typeof tMax === "number";
      const left = hasTemps ? ((tMin - weekMin) / span) * 100 : 0;
      const width = hasTemps ? Math.max(((tMax - tMin) / span) * 100, 3) : 0;

      const rainText = typeof rainProb === "number" ? `${rainProb}%` : "-";
      const rainAmount = typeof rainSum === "number" && rainSum > 0 ? ` · ${rainSum}mm` : "";
      const rainStrong = typeof rainProb === "number" && rainProb >= 50 ? "wk-rain-high" : "";
      const sunrise = hhmm(daily.sunrise?.[i]);
      const sunset = hhmm(daily.sunset?.[i]);

      return `
        <div class="wk-row ${i === 0 ? "wk-today" : ""}">
          <div class="wk-day ${dayClass}">
            <span class="wk-dayname">${dayName}</span>
            <span class="wk-date">${m}/${d}</span>
          </div>
          <div class="wk-cond">
            <span class="wk-icon">${info.icon}</span>
            <span class="wk-text">${info.text}</span>
          </div>
          <div class="wk-rain ${rainStrong}" title="강수확률${rainAmount ? " · 예상 강수량" : ""}">☔ ${rainText}${rainAmount}</div>
          <div class="wk-temps">
            <span class="wk-min">${hasTemps ? Math.round(tMin) + "°" : "-"}</span>
            <div class="wk-bar-track">
              ${hasTemps ? `<div class="wk-bar" style="left:${left}%;width:${width}%"></div>` : ""}
            </div>
            <span class="wk-max">${hasTemps ? Math.round(tMax) + "°" : "-"}</span>
          </div>
          <div class="wk-wind" title="최대 풍속">🍃 ${typeof wind === "number" ? wind.toFixed(1) : "-"}m/s</div>
          <div class="wk-sun" title="일출 / 일몰">🌅 ${sunrise} · 🌇 ${sunset}</div>
        </div>
      `;
    })
    .join("");
}

// "2026-11-23T07:19" → "07:19"
function hhmm(isoLocal) {
  return typeof isoLocal === "string" && isoLocal.length >= 16 ? isoLocal.slice(11, 16) : "-";
}

// "2026-11-23T07:19" (한국 시간) → Date 객체 (브라우저 시간대와 무관하게 KST로 해석)
function parseKst(isoLocal) {
  return new Date(`${isoLocal}:00+09:00`);
}

// 분 → "N시간 M분"
function formatDuration(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

// 오늘의 해: 일출·일몰 시각, 낮 길이(어제 대비), 현재 해 위치 궤적
function renderSunCard(placeName, daily) {
  const riseStr = daily.sunrise?.[0];
  const setStr = daily.sunset?.[0];
  if (!riseStr || !setStr) {
    sunCard.innerHTML = "";
    return;
  }

  const now = new Date();
  const rise = parseKst(riseStr);
  const set = parseKst(setStr);
  const tomorrowRiseStr = daily.sunrise?.[1];

  // 낮 길이와 내일과의 차이
  const dayLenSec = daily.daylight_duration?.[0];
  const nextLenSec = daily.daylight_duration?.[1];
  const dayLenText = typeof dayLenSec === "number" ? formatDuration(dayLenSec / 60) : "-";
  let trendText = "";
  if (typeof dayLenSec === "number" && typeof nextLenSec === "number") {
    const diffMin = Math.round((nextLenSec - dayLenSec) / 60);
    if (diffMin < 0) trendText = `내일은 ${Math.abs(diffMin)}분 짧아져요`;
    else if (diffMin > 0) trendText = `내일은 ${diffMin}분 길어져요`;
    else trendText = "내일도 비슷해요";
  }

  // 현재 상태 문구 + 궤적 위 해 위치(0~1)
  let statusText;
  let progress = null; // 낮 동안만 해 표시
  if (now < rise) {
    statusText = `일출까지 ${formatDuration((rise - now) / 60000)}`;
  } else if (now < set) {
    progress = (now - rise) / (set - rise);
    statusText = `일몰까지 ${formatDuration((set - now) / 60000)}`;
  } else if (tomorrowRiseStr) {
    statusText = `해가 졌어요 · 내일 일출까지 ${formatDuration((parseKst(tomorrowRiseStr) - now) / 60000)}`;
  } else {
    statusText = "해가 졌어요";
  }

  // 반원 궤적(SVG): 중심 (100, 90), 반지름 80
  const cx = 100, cy = 90, r = 80;
  let sunSvg = "";
  let traveledPath = "";
  if (progress !== null) {
    const angle = Math.PI * (1 - progress); // 왼쪽(일출) π → 오른쪽(일몰) 0
    const sx = cx + r * Math.cos(angle);
    const sy = cy - r * Math.sin(angle);
    traveledPath = `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sx.toFixed(1)} ${sy.toFixed(1)}" class="sun-arc-done" />`;
    sunSvg = `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="9" class="sun-dot" />`;
  }

  sunCard.className = `sun-card ${progress === null ? "sun-night" : "sun-day"}`;
  sunCard.innerHTML = `
    <div class="sun-arc-wrap">
      <svg viewBox="0 0 200 100" class="sun-arc" aria-hidden="true">
        <line x1="10" y1="${cy}" x2="190" y2="${cy}" class="sun-horizon" />
        <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" class="sun-arc-track" />
        ${traveledPath}
        ${sunSvg}
      </svg>
      <div class="sun-arc-labels">
        <span>🌅 ${hhmm(riseStr)}</span>
        <span>🌇 ${hhmm(setStr)}</span>
      </div>
    </div>
    <div class="sun-info">
      <span class="sun-title">${placeName} 오늘의 해</span>
      <span class="sun-status">${statusText}</span>
      <div class="sun-stats">
        <span><b>일출</b> ${hhmm(riseStr)}</span>
        <span><b>일몰</b> ${hhmm(setStr)}</span>
        <span><b>낮 길이</b> ${dayLenText}</span>
      </div>
      ${trendText ? `<span class="sun-trend">${trendText}</span>` : ""}
    </div>
  `;
}

// Chart.js로 기온(선) + 체감 온도(점선) + 강수확률(막대) 복합 그래프 렌더링
function renderHourlyChart(placeName, hourly) {
  const times = hourly?.time || [];
  if (times.length === 0) return;

  // x축 라벨: ["21시", "🌙"] 처럼 시각 + 날씨 아이콘 2줄
  const labels = times.map((t, i) => {
    const hour = parseInt(t.slice(11, 13), 10);
    const info = getWeatherCodeInfo(hourly.weather_code[i], hourly.is_day[i]);
    const hourText = i === 0 ? "지금" : hour === 0 ? "내일 0시" : `${hour}시`;
    return [hourText, info.icon];
  });
  const weatherTexts = times.map((_, i) => getWeatherCodeInfo(hourly.weather_code[i], hourly.is_day[i]).text);

  if (hourlyChartInstance) hourlyChartInstance.destroy();

  const ctx = hourlyChartCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(239, 68, 68, 0.25)");
  gradient.addColorStop(1, "rgba(239, 68, 68, 0)");

  hourlyChartInstance = new Chart(ctx, {
    data: {
      labels,
      datasets: [
        {
          type: "line",
          label: "기온",
          data: hourly.temperature_2m,
          borderColor: "#ef4444",
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: "#ef4444",
          borderWidth: 2.5,
          yAxisID: "y",
          order: 1,
        },
        {
          type: "line",
          label: "체감 온도",
          data: hourly.apparent_temperature,
          borderColor: "#8b5cf6",
          borderDash: [5, 4],
          fill: false,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "bar",
          label: "강수확률",
          data: hourly.precipitation_probability,
          backgroundColor: "rgba(59, 130, 246, 0.25)",
          borderRadius: 4,
          yAxisID: "yRain",
          order: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: { boxWidth: 12, font: { family: "'Pretendard', sans-serif", weight: "600" } },
        },
        title: {
          display: true,
          text: `${placeName} 시간대별 기온`,
          align: "start",
          font: { family: "'Pretendard', sans-serif", size: 14, weight: "800" },
          color: "#1f2937",
        },
        tooltip: {
          callbacks: {
            title: (items) => {
              const i = items[0].dataIndex;
              return `${labels[i].join(" ")} ${weatherTexts[i]}`;
            },
            label: (c) =>
              c.dataset.yAxisID === "yRain"
                ? ` 강수확률 ${c.raw ?? "-"}%`
                : ` ${c.dataset.label} ${c.raw}°C`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            font: { family: "'Pretendard', sans-serif", size: 11, weight: "600" },
            color: "#4b5563",
          },
        },
        y: {
          position: "left",
          grace: "15%",
          grid: { color: "rgba(0, 0, 0, 0.05)" },
          ticks: { callback: (v) => `${v}°` },
          title: { display: true, text: "기온 (°C)", color: "#6b7280", font: { size: 11, weight: "600" } },
        },
        yRain: {
          position: "right",
          min: 0,
          max: 100,
          grid: { display: false },
          ticks: { callback: (v) => `${v}%`, stepSize: 25 },
          title: { display: true, text: "강수확률 (%)", color: "#6b7280", font: { size: 11, weight: "600" } },
        },
      },
    },
  });
}

function scheduleWeatherRefresh() {
  if (weatherRefreshTimer) clearInterval(weatherRefreshTimer);
  weatherRefreshTimer = setInterval(() => {
    if (document.visibilityState === "visible") refreshWeatherNow();
  }, WEATHER_REFRESH_MS);
}

// 에어코리아 대기질 정보 및 실시간 날씨 정보를 동시에 조회하는 메인 함수
async function fetchAirQuality(sidoName) {
  // 로딩 상태 표시
  setLoadingState(sidoName);

  // 선택된 시·도의 대표 좌표 가져오기
  const regionInfo = SIDO_COORDS[sidoName] || SIDO_COORDS["서울"];

  // 1. 실시간 날씨 정보 비동기 호출 (Open-Meteo) - 대표 날씨 + 세부 지역별 날씨, 자동 갱신 시작
  refreshWeatherNow();

  try {
    // 2. Vercel 서버리스 함수 호출 (/api/dust?sido=지역명)
    const response = await fetch(`${API_URL}?sido=${encodeURIComponent(sidoName)}`);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || `서버 오류 (상태 코드: ${response.status})`);
    }

    const items = data.response?.body?.items || [];

    if (items.length === 0) {
      showEmptyState(sidoName);
      return;
    }

    // 로딩 인디케이터 숨기기
    statusMessage.style.display = "none";

    // 1. 대표 신호등 상태 갱신
    updateTrafficHero(sidoName, items);

    // 2. Leaflet 지도에 측정소별 신호등 마커 표시
    renderAirQualityMap(sidoName, regionInfo, items);

    // 3. 미세먼지 상위 10개 가로 막대그래프 렌더링
    renderTop10Chart(items);

    // 4. 각 측정소별 카드 목록 렌더링
    renderStationCards(items);

  } catch (error) {
    console.error("데이터 조회 오류:", error);
    showErrorState(error.message);
  }
}

// Open-Meteo API를 호출하여 실시간 날씨(기온, 체감, 습도, 풍속, 상태)를 가져오는 함수
async function fetchWeather(lat, lon) {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=Asia%2FSeoul`;
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error("날씨 정보를 가져올 수 없습니다.");
    
    const weatherData = await res.json();
    const current = weatherData.current;

    if (current) {
      const codeInfo = getWeatherCodeInfo(current.weather_code);
      weatherIcon.textContent = codeInfo.icon;
      weatherDesc.textContent = codeInfo.text;
      weatherTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
      weatherApparentTemp.textContent = `${Math.round(current.apparent_temperature)}°C`;
      weatherHumidity.textContent = `${current.relative_humidity_2m}%`;
      weatherWind.textContent = `${current.wind_speed_10m} m/s`;
    }
  } catch (err) {
    console.warn("날씨 로드 실패:", err);
    weatherDesc.textContent = "날씨 정보 없음";
    weatherTemp.textContent = "--°C";
  }
}

// 선택한 시·도의 날씨 조회 지점 목록 반환 [{ name, lat, lon }]
function getRegionWeatherPoints(sidoName) {
  if (sidoName === "전국") {
    return Object.entries(SIDO_COORDS)
      .filter(([name]) => name !== "전국")
      .map(([name, c]) => ({ name, lat: c.lat, lon: c.lon }));
  }
  if (sidoName === "서울") {
    // 서울 25개 구 (STATION_COORDS 앞쪽 25개 항목)
    return Object.entries(STATION_COORDS)
      .slice(0, 25)
      .map(([name, [lat, lon]]) => ({ name, lat, lon }));
  }
  const list = REGION_WEATHER_POINTS[sidoName] || [];
  return list.map(([name, lat, lon]) => ({ name, lat, lon }));
}

// Open-Meteo 다중 좌표 요청 1회로 세부 지역 전체의 실시간 날씨를 조회
async function fetchRegionalWeather(sidoName) {
  const requestId = ++regionWeatherRequestId;
  const points = getRegionWeatherPoints(sidoName);

  regionWeatherDesc.textContent =
    sidoName === "전국"
      ? "전국 17개 시·도의 실시간 기온과 날씨 (10분마다 자동 갱신)"
      : `${sidoName} ${points.length}개 세부 지역의 실시간 기온과 날씨 (10분마다 자동 갱신)`;
  regionWeatherRefresh.classList.add("spinning");
  if (regionWeatherData.sido !== sidoName) {
    regionWeatherSummary.innerHTML = "";
    regionWeatherGrid.innerHTML = `<p class="region-weather-empty">${sidoName} 지역별 날씨를 불러오는 중...</p>`;
  }

  if (points.length === 0) {
    regionWeatherGrid.innerHTML = `<p class="region-weather-empty">세부 지역 정보가 없습니다.</p>`;
    regionWeatherRefresh.classList.remove("spinning");
    return;
  }

  const params = new URLSearchParams({
    latitude: points.map((p) => p.lat).join(","),
    longitude: points.map((p) => p.lon).join(","),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,is_day",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    forecast_days: "1",
    wind_speed_unit: "ms",
    timezone: "Asia/Seoul",
  });

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) throw new Error(`날씨 API 오류 (${res.status})`);
    const json = await res.json();

    // 사용자가 그 사이 다른 지역을 선택했다면 오래된 응답은 버림
    if (requestId !== regionWeatherRequestId) return;

    // 좌표가 1개면 객체, 여러 개면 배열로 응답됨
    const results = Array.isArray(json) ? json : [json];

    const data = points.map((p, i) => {
      const r = results[i] || {};
      const cur = r.current || {};
      const daily = r.daily || {};
      return {
        name: p.name,
        lat: p.lat,
        lon: p.lon,
        order: i,
        temp: cur.temperature_2m,
        feels: cur.apparent_temperature,
        humidity: cur.relative_humidity_2m,
        wind: cur.wind_speed_10m,
        precip: cur.precipitation,
        code: cur.weather_code,
        isDay: cur.is_day,
        max: daily.temperature_2m_max?.[0],
        min: daily.temperature_2m_min?.[0],
        rainProb: daily.precipitation_probability_max?.[0],
        time: cur.time,
      };
    });
    data.sido = sidoName;
    data.fetchedAt = Date.now();
    regionWeatherData = data;
    renderRegionWeather();
  } catch (err) {
    if (requestId !== regionWeatherRequestId) return;
    console.warn("지역별 날씨 로드 실패:", err);
    if (regionWeatherData.sido !== sidoName) {
      regionWeatherGrid.innerHTML = `<p class="region-weather-empty">지역별 날씨 정보를 불러오지 못했습니다. 잠시 후 🔄 버튼을 눌러주세요.</p>`;
    }
    regionWeatherUpdated.textContent = "⚠️ 최신 날씨 갱신 실패 — 마지막으로 받은 정보를 표시 중입니다.";
  } finally {
    if (requestId === regionWeatherRequestId) regionWeatherRefresh.classList.remove("spinning");
  }
}

// 지역별 날씨 요약 + 카드 그리드 렌더링
function renderRegionWeather() {
  const data = regionWeatherData;
  if (!data || data.length === 0) return;

  const valid = data.filter((d) => typeof d.temp === "number");

  // 1) 요약: 평균 기온 / 가장 따뜻한 곳 / 가장 추운 곳
  if (valid.length > 0) {
    const avg = valid.reduce((s, d) => s + d.temp, 0) / valid.length;
    const warmest = valid.reduce((a, b) => (b.temp > a.temp ? b : a));
    const coldest = valid.reduce((a, b) => (b.temp < a.temp ? b : a));
    regionWeatherSummary.innerHTML = `
      <div class="rw-summary-item">
        <span class="rw-summary-label">평균 기온</span>
        <span class="rw-summary-val">${avg.toFixed(1)}°C</span>
      </div>
      <div class="rw-summary-item rw-warm">
        <span class="rw-summary-label">🔺 가장 따뜻한 곳</span>
        <span class="rw-summary-val">${warmest.name} ${warmest.temp.toFixed(1)}°C</span>
      </div>
      <div class="rw-summary-item rw-cold">
        <span class="rw-summary-label">🔻 가장 추운 곳</span>
        <span class="rw-summary-val">${coldest.name} ${coldest.temp.toFixed(1)}°C</span>
      </div>
    `;
  } else {
    regionWeatherSummary.innerHTML = "";
  }

  // 2) 정렬
  const sortMode = regionWeatherSort.value;
  const sorted = [...data].sort((a, b) => {
    if (sortMode === "default") return a.order - b.order;
    const ta = typeof a.temp === "number" ? a.temp : null;
    const tb = typeof b.temp === "number" ? b.temp : null;
    if (ta === null) return 1;
    if (tb === null) return -1;
    return sortMode === "tempDesc" ? tb - ta : ta - tb;
  });

  // 3) 카드
  const fmt = (v, unit, digits = 0) =>
    typeof v === "number" ? `${v.toFixed(digits)}${unit}` : "-";

  regionWeatherGrid.innerHTML = sorted
    .map((d) => {
      const info = getWeatherCodeInfo(d.code, d.isDay);
      const tempClass = getTempClass(d.temp);
      const precipNow = typeof d.precip === "number" && d.precip > 0
        ? `<span class="rw-precip-now">💧 ${d.precip}mm</span>` : "";
      return `
        <div class="rw-card ${tempClass}" data-index="${d.order + 1}" title="눌러서 시간대별 기온 보기">
          <div class="rw-card-top">
            <span class="rw-name">${d.name}</span>
            <span class="rw-cond">${info.icon} ${info.text}</span>
          </div>
          <div class="rw-temp-row">
            <span class="rw-temp">${fmt(d.temp, "°", 1)}</span>
            <span class="rw-minmax">
              <span class="rw-max">${fmt(d.max, "°")}</span> / <span class="rw-min">${fmt(d.min, "°")}</span>
            </span>
          </div>
          <div class="rw-details">
            <span title="체감 온도">🌡️ 체감 ${fmt(d.feels, "°")}</span>
            <span title="습도">💦 ${fmt(d.humidity, "%")}</span>
            <span title="풍속">🍃 ${fmt(d.wind, "m/s", 1)}</span>
            <span title="오늘 최대 강수확률">☔ ${fmt(d.rainProb, "%")}</span>
          </div>
          ${precipNow}
        </div>
      `;
    })
    .join("");

  // 4) 갱신 시각
  const t = new Date(data.fetchedAt);
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  regionWeatherUpdated.textContent = `마지막 갱신 ${hh}:${mm} · 10분마다 자동 갱신 · 출처: Open-Meteo`;

  // 5) 지도 위 날씨 마커도 갱신
  renderWeatherMapLayer();
}

// 지도 위에 지역별 날씨(아이콘 + 기온) 라벨 마커 표시
function renderWeatherMapLayer() {
  const data = regionWeatherData;
  if (!data || data.length === 0) return;

  // 미세먼지 API가 실패해도 날씨는 지도에 보이도록, 지도가 없으면 여기서 생성
  const regionInfo = SIDO_COORDS[data.sido] || SIDO_COORDS["서울"];
  const created = ensureMap(regionInfo);
  // 지역이 바뀌었으면 지도도 해당 지역으로 이동 (자동 갱신 때는 사용자가 옮긴 시점 유지)
  if (!created && weatherLayerGroup.sido !== data.sido) {
    leafletMapInstance.setView([regionInfo.lat, regionInfo.lon], regionInfo.zoom);
  }
  weatherLayerGroup.sido = data.sido;
  setTimeout(() => leafletMapInstance.invalidateSize(), 100);

  weatherLayerGroup.clearLayers();

  data.forEach((d) => {
    if (typeof d.temp !== "number") return;
    const info = getWeatherCodeInfo(d.code, d.isDay);
    const tempClass = getTempClass(d.temp);

    const icon = L.divIcon({
      className: "weather-map-icon",
      html: `<div class="wm-label ${tempClass}"><span class="wm-icon">${info.icon}</span><span class="wm-temp">${d.temp.toFixed(0)}°</span></div>`,
      iconSize: null,
      iconAnchor: [28, 34],
    });

    const fmt = (v, unit, digits = 0) =>
      typeof v === "number" ? `${v.toFixed(digits)}${unit}` : "-";

    const popup = `
      <div class="custom-map-popup">
        <div class="popup-title">
          <span>${d.name}</span>
          <span class="popup-badge" style="background-color:#3b82f6;">${info.icon} ${info.text}</span>
        </div>
        <div class="popup-row"><span>현재 기온</span><span class="popup-val">${fmt(d.temp, "°C", 1)}</span></div>
        <div class="popup-row"><span>최고 / 최저</span><span class="popup-val">${fmt(d.max, "°")} / ${fmt(d.min, "°")}</span></div>
        <div class="popup-row"><span>체감 온도</span><span class="popup-val">${fmt(d.feels, "°C")}</span></div>
        <div class="popup-row"><span>습도</span><span class="popup-val">${fmt(d.humidity, "%")}</span></div>
        <div class="popup-row"><span>바람</span><span class="popup-val">${fmt(d.wind, " m/s", 1)}</span></div>
        <div class="popup-row"><span>강수확률</span><span class="popup-val">${fmt(d.rainProb, "%")}</span></div>
      </div>
    `;

    L.marker([d.lat, d.lon], { icon, zIndexOffset: 500 })
      .bindPopup(popup)
      .addTo(weatherLayerGroup);
  });
}

// Leaflet 지도와 레이어 그룹을 (없으면) 생성
function ensureMap(regionInfo) {
  if (leafletMapInstance) return false;

  leafletMapInstance = L.map("map", {
    center: [regionInfo.lat, regionInfo.lon],
    zoom: regionInfo.zoom,
    zoomControl: true,
    attributionControl: false
  });

  // 오픈스트리트맵 타일 레이어 추가
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
  }).addTo(leafletMapInstance);

  // 미세먼지 마커 / 날씨 마커 레이어 그룹 생성 (토글 상태 반영)
  markerLayerGroup = L.layerGroup();
  weatherLayerGroup = L.layerGroup();
  if (toggleDustLayer.classList.contains("active")) markerLayerGroup.addTo(leafletMapInstance);
  if (toggleWeatherLayer.classList.contains("active")) weatherLayerGroup.addTo(leafletMapInstance);
  return true;
}

// 기온 구간별 카드 색상 클래스
function getTempClass(temp) {
  if (typeof temp !== "number") return "rw-t-unknown";
  if (temp < 0) return "rw-t-freezing";
  if (temp < 10) return "rw-t-cold";
  if (temp < 20) return "rw-t-mild";
  if (temp < 28) return "rw-t-warm";
  return "rw-t-hot";
}

// WMO 날씨 코드(0~99)를 직관적인 한국어 설명과 이모지로 변환하는 함수
function getWeatherCodeInfo(code, isDay = 1) {
  if (code === 0) return { icon: isDay === 0 ? "🌙" : "☀️", text: "맑음" };
  if (code === 1 || code === 2) return { icon: isDay === 0 ? "☁️" : "🌤️", text: "구름 조금" };
  if (code === 3) return { icon: "☁️", text: "흐림" };
  if (code === 45 || code === 48) return { icon: "🌫️", text: "안개" };
  if (code >= 51 && code <= 55) return { icon: "🌦️", text: "이슬비" };
  if (code >= 61 && code <= 65) return { icon: "🌧️", text: "비" };
  if (code >= 71 && code <= 77) return { icon: "❄️", text: "눈" };
  if (code >= 80 && code <= 82) return { icon: "⛈️", text: "소나기" };
  if (code >= 95 && code <= 99) return { icon: "⚡", text: "뇌우" };
  return { icon: "🌤️", text: "구름 많음" };
}

// Leaflet 지도를 초기화하고 각 측정소를 등급 색상 마커로 표시하는 함수
function renderAirQualityMap(sidoName, regionInfo, items) {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // 지도 인스턴스가 없으면 최초 생성, 있으면 해당 지역으로 이동
  if (!ensureMap(regionInfo)) {
    // 지도 중심 및 줌 이동
    leafletMapInstance.setView([regionInfo.lat, regionInfo.lon], regionInfo.zoom);
    // 기존 마커 지우기
    markerLayerGroup.clearLayers();
  }

  // 화면 리사이즈 및 렌더링 오류 방지
  setTimeout(() => {
    leafletMapInstance.invalidateSize();
  }, 100);

  // 측정소들을 순회하며 지도 마커 추가
  items.forEach((item, index) => {
    const station = item.stationName || "측정소";
    const pm10 = item.pm10Value || "-";
    const pm25 = item.pm25Value || "-";
    const grade = item.pm10Grade;
    const time = formatKoreanTime(item.dataTime);

    // 좌표 구하기: 사전 정의된 좌표가 있으면 사용, 없으면 시도 중심 좌표 주변으로 분산 배치
    let lat, lon;
    if (STATION_COORDS[station]) {
      [lat, lon] = STATION_COORDS[station];
    } else {
      // 겹침 방지를 위해 나선형 오프셋 적용
      const angle = (index * 137.5) * (Math.PI / 180);
      const radius = 0.025 + Math.sqrt(index) * 0.018;
      lat = regionInfo.lat + radius * Math.cos(angle);
      lon = regionInfo.lon + radius * Math.sin(angle) * 1.2;
    }

    // 등급별 마커 색상 결정
    const { color, fillColor, label } = getMapMarkerColor(grade, Number(pm10));

    // 원형 신호등 마커 생성 (L.circleMarker)
    const marker = L.circleMarker([lat, lon], {
      radius: 9,
      color: color,
      weight: 2.5,
      fillColor: fillColor,
      fillOpacity: 0.85
    });

    // 팝업 내용 생성
    const popupContent = `
      <div class="custom-map-popup">
        <div class="popup-title">
          <span>${station}</span>
          <span class="popup-badge" style="background-color: ${color};">${label}</span>
        </div>
        <div class="popup-row">
          <span>미세먼지(PM10)</span>
          <span class="popup-val">${pm10 === "-" ? "측정 안 됨" : pm10 + " ㎍/㎥"}</span>
        </div>
        <div class="popup-row">
          <span>초미세먼지(PM2.5)</span>
          <span class="popup-val">${pm25 === "-" ? "측정 안 됨" : pm25 + " ㎍/㎥"}</span>
        </div>
        <div class="popup-row" style="font-size: 0.75rem; color: #9ca3af; margin-top: 6px;">
          <span>${time}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    markerLayerGroup.addLayer(marker);
  });
}

// 등급에 따른 지도 마커 색상 반환
function getMapMarkerColor(grade, pm10Value) {
  if (grade === "1" || (pm10Value && pm10Value <= 30)) {
    return { color: "#2563eb", fillColor: "#3b82f6", label: "좋음" };
  }
  if (grade === "2" || (pm10Value && pm10Value <= 80)) {
    return { color: "#16a34a", fillColor: "#22c55e", label: "보통" };
  }
  if (grade === "3" || (pm10Value && pm10Value <= 150)) {
    return { color: "#ea580c", fillColor: "#f97316", label: "나쁨" };
  }
  if (grade === "4" || (pm10Value && pm10Value > 150)) {
    return { color: "#dc2626", fillColor: "#ef4444", label: "매우나쁨" };
  }
  return { color: "#6b7280", fillColor: "#9ca3af", label: "정보 없음" };
}

// 로딩 상태 표시 함수
function setLoadingState(sidoName) {
  trafficRegion.textContent = sidoName;
  trafficSection.className = "traffic-section traffic-unknown";
  trafficEmoji.textContent = "⏳";
  trafficStatus.textContent = "불러오는 중...";
  trafficValue.textContent = "-";
  trafficGuide.textContent = `${sidoName} 지역의 실시간 대기 및 날씨 정보를 불러오는 중입니다...`;
  trafficTime.textContent = "-";
  weatherIcon.textContent = "⏳";
  weatherDesc.textContent = "불러오는 중...";
  weatherTemp.textContent = "--°C";
  stationCount.textContent = "";
  cardGrid.innerHTML = "";
  
  if (dustChartInstance) {
    dustChartInstance.destroy();
    dustChartInstance = null;
  }
  chartSection.style.display = "none";
  statusMessage.style.display = "flex";
  statusText.textContent = "최신 대기오염 및 날씨 정보를 불러오는 중...";
}

// 데이터 없음 상태 표시
function showEmptyState(sidoName) {
  trafficSection.className = "traffic-section traffic-unknown";
  trafficEmoji.textContent = "⚪";
  trafficStatus.textContent = "정보 없음";
  trafficValue.textContent = "-";
  trafficGuide.textContent = `${sidoName} 지역에 조회 가능한 측정 데이터가 없습니다.`;
  chartSection.style.display = "none";
  statusMessage.style.display = "flex";
  statusText.textContent = "측정 데이터가 없습니다.";
}

// 에러 상태 표시
function showErrorState(message) {
  trafficSection.className = "traffic-section traffic-unknown";
  trafficEmoji.textContent = "⚠️";
  trafficStatus.textContent = "불러오기 실패";
  trafficValue.textContent = "-";
  trafficGuide.textContent = "대기오염 정보를 불러오지 못했습니다. 네트워크 또는 키 설정을 확인해주세요.";
  chartSection.style.display = "none";
  statusMessage.style.display = "flex";
  statusText.textContent = message || "오류가 발생했습니다.";
}

// 대표 신호등 섹션 갱신
function updateTrafficHero(sidoName, items) {
  const validValues = [];
  let latestTime = "";

  items.forEach((item) => {
    const raw = item.pm10Value;
    if (raw && raw !== "-" && !isNaN(Number(raw))) {
      validValues.push(Number(raw));
    }
    if (item.dataTime && !latestTime) {
      latestTime = item.dataTime;
    }
  });

  if (validValues.length === 0) {
    trafficSection.className = "traffic-section traffic-unknown";
    trafficEmoji.textContent = "⚪";
    trafficStatus.textContent = "측정 안 됨";
    trafficValue.textContent = "측정 안 됨";
    trafficGuide.textContent = "현재 집계 가능한 미세먼지 데이터가 없습니다.";
    trafficTime.textContent = formatKoreanTime(latestTime);
    stationCount.textContent = `총 ${items.length}개소 (데이터 없음)`;
    return;
  }

  const sum = validValues.reduce((acc, cur) => acc + cur, 0);
  const avg = Math.round((sum / validValues.length) * 10) / 10;

  let emoji = "🟢";
  let statusTextValue = "보통";
  let themeClass = "traffic-normal";
  let guideText = "공기 질이 무난한 날이에요 🌿";

  if (avg <= 30) {
    emoji = "🔵";
    statusTextValue = "좋음";
    themeClass = "traffic-good";
    guideText = "공기가 깨끗해요! 안심하고 환기하세요 😊";
  } else if (avg <= 80) {
    emoji = "🟢";
    statusTextValue = "보통";
    themeClass = "traffic-normal";
    guideText = "공기 질이 무난한 날이에요 🌿";
  } else if (avg <= 150) {
    emoji = "🟠";
    statusTextValue = "나쁨";
    themeClass = "traffic-bad";
    guideText = "외출 시 마스크를 챙기세요 😷";
  } else {
    emoji = "🔴";
    statusTextValue = "매우나쁨";
    themeClass = "traffic-verybad";
    guideText = "외출 시 마스크를 챙기세요 😷 (야외 활동 자제 권장)";
  }

  trafficSection.className = `traffic-section ${themeClass}`;
  trafficEmoji.textContent = emoji;
  trafficStatus.textContent = statusTextValue;
  trafficValue.textContent = `${avg} ㎍/㎥`;
  trafficGuide.textContent = guideText;
  trafficTime.textContent = formatKoreanTime(latestTime);
  stationCount.textContent = `총 ${items.length}개 측정소 중 ${validValues.length}개 집계`;
}

// Chart.js 미세먼지 TOP 10 가로 막대그래프 렌더링
function renderTop10Chart(items) {
  const validItems = items.filter((item) => {
    const val = item.pm10Value;
    return val && val !== "-" && !isNaN(Number(val));
  });

  if (validItems.length === 0) {
    chartSection.style.display = "none";
    return;
  }

  chartSection.style.display = "block";

  const top10 = validItems
    .sort((a, b) => Number(b.pm10Value) - Number(a.pm10Value))
    .slice(0, 10);

  const labels = top10.map((item) => item.stationName || "측정소");
  const values = top10.map((item) => Number(item.pm10Value));
  const backgroundColors = top10.map((item) => getChartColor(item.pm10Grade, Number(item.pm10Value)).bg);
  const borderColors = top10.map((item) => getChartColor(item.pm10Grade, Number(item.pm10Value)).border);

  if (dustChartInstance) {
    dustChartInstance.destroy();
  }

  const ctx = dustChartCanvas.getContext("2d");
  dustChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "미세먼지(PM10) ㎍/㎥",
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 8,
          barPercentage: 0.7,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ` ${context.raw} ㎍/㎥`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0, 0, 0, 0.05)" },
          title: {
            display: true,
            text: "농도 (㎍/㎥)",
            color: "#6b7280",
            font: { size: 11, weight: "600" },
          },
        },
        y: {
          grid: { display: false },
          ticks: {
            font: { family: "'Pretendard', sans-serif", size: 12, weight: "700" },
            color: "#1f2937",
          },
        },
      },
    },
  });
}

function getChartColor(grade, value) {
  if (grade === "1" || value <= 30) {
    return { bg: "rgba(59, 130, 246, 0.75)", border: "#2563eb" };
  }
  if (grade === "2" || value <= 80) {
    return { bg: "rgba(34, 197, 94, 0.75)", border: "#16a34a" };
  }
  if (grade === "3" || value <= 150) {
    return { bg: "rgba(249, 115, 22, 0.75)", border: "#ea580c" };
  }
  return { bg: "rgba(239, 68, 68, 0.75)", border: "#dc2626" };
}

// 각 측정소별 카드를 은은한 등급 테마로 렌더링
function renderStationCards(items) {
  cardGrid.innerHTML = "";

  items.forEach((item) => {
    const stationName = item.stationName || "측정소";
    const pm10Display = formatValue(item.pm10Value);
    const pm25Display = formatValue(item.pm25Value);
    const koreanTime = formatKoreanTime(item.dataTime);
    const { cardClass, badgeEmoji, badgeLabel } = getGradeDetail(item.pm10Grade);

    const card = document.createElement("div");
    card.className = `station-card ${cardClass}`;

    card.innerHTML = `
      <div class="card-header">
        <span class="station-name">${stationName}</span>
        <span class="grade-badge">${badgeEmoji} ${badgeLabel}</span>
      </div>
      <div class="info-row">
        <span class="info-label">미세먼지(PM10)</span>
        <span class="info-value">${pm10Display}</span>
      </div>
      <div class="info-row">
        <span class="info-label">초미세먼지(PM2.5)</span>
        <span class="info-value">${pm25Display}</span>
      </div>
      <div class="card-time">${koreanTime}</div>
    `;

    cardGrid.appendChild(card);
  });
}

// 한국어 날짜/시간 변환
function formatKoreanTime(rawDateTime) {
  if (!rawDateTime || typeof rawDateTime !== "string") {
    return "측정 시각 정보 없음";
  }

  const regex = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})/;
  const match = rawDateTime.trim().match(regex);

  if (match) {
    const year = match[1];
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    return `${year}년 ${month}월 ${day}일 ${hour}시 기준`;
  }

  return `${rawDateTime} 기준`;
}

function formatValue(value) {
  if (!value || value === "-") {
    return "측정 안 됨";
  }
  return `${value} ㎍/㎥`;
}

function getGradeDetail(grade) {
  switch (grade) {
    case "1":
      return { cardClass: "card-good", badgeEmoji: "🔵", badgeLabel: "좋음" };
    case "2":
      return { cardClass: "card-normal", badgeEmoji: "🟢", badgeLabel: "보통" };
    case "3":
      return { cardClass: "card-bad", badgeEmoji: "🟠", badgeLabel: "나쁨" };
    case "4":
      return { cardClass: "card-verybad", badgeEmoji: "🔴", badgeLabel: "매우나쁨" };
    default:
      return { cardClass: "card-unknown", badgeEmoji: "⚪", badgeLabel: "정보 없음" };
  }
}
