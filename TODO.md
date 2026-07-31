# TODO

빌드에 포함되지 않는 내부 메모.

## Audit — 블로그 정비

2026-03-04 진단 보고서를 2026-07-31 재검증한 뒤 남은 미해결분. (P-4 lazy loading, 콘텐츠 페이지 KaTeX 조건부 로딩은 해결 확인되어 제외)

- [ ] S-1 `anonymizeIP = false` → `true` (hugo.toml, 1줄)
- [ ] A-1 검색 입력 aria-label 누락 — `layouts/partials/header.html` desktop/mobile 인풋 2곳
- [ ] P-2 잔여: 홈 화면에서만 KaTeX 전체 스택(~330KB) 로딩 — 원인 조사 필요
- [ ] P-3 FontAwesome 101KB 전체 로딩 → 서브셋 또는 SVG 인라인 대체 (공수 큼)
- [ ] S-3 CDN 리소스(jsDelivr)에 SRI `integrity` 미적용
- [ ] S-2 Gravatar 이메일 MD5 해시 노출 → 직접 아바타 이미지 호스팅
- [ ] A-2 skip navigation 링크 없음 / A-3 포커스 아웃라인 제거 (Low)
- [ ] R-1 RSS 피드 이미지 누락 / R-2 포스트 description 채우기 (진행형)
- [ ] 보안 헤더(CSP 등)는 GitHub Pages 한계 — 호스팅/CDN 변경 시에만 가능

## 집필

### 디지털 이미징 시리즈

- [ ] 광학(1): "이상적일 수 없는 카메라" 본문 — 뼈대는 index.ko.md 내 by claude 블록
- [ ] 광학(1): "## 정리" 본문 — 뼈대 있음 (리뷰 + PSF + 미회수 회수)
- [ ] 광학(1): 완료 후 커밋 (현재 미커밋: 뼈대 2개 + h1 제거 + 신호처리 데모 3종 + spectrum-lib)
- [ ] 센서(2): 광자/전자/전압/비트 골격에 살 붙이기 — 심화 조사: G 2배(휘도), 3색 vs 4색(CYGM·RGBE·RYYB), 픽셀 비닝, dual gain
- [ ] 신호처리(3): 데모 3종(스펙트럼→3숫자 / WB / CCM) 주변 본문

### 아이디어 짬통

아이디어가 글이 되면 항목을 지우거나 링크로 교체.

**외전 후보 — 자료구조는 측정의 화석이다**

포맷이 이상하게 생겼다면, 그건 데이터가 태어난 방식이 새겨진 것이다.

- raw 모자이크 — 파일을 열면 베이어 배열이 그대로 보인다 (센서 챕터 회수)
- YUV 4:2:0 / planar 레이아웃 — 크로마 서브샘플링 = "색은 흐려도 모른다"가 메모리 구조가 된 것
- organized point cloud (w×h×c) — 스캔 래스터의 화석. unorganized가 되는 순간 잃는 것(O(1) 이웃), 라이다 패킷의 ring/channel 인덱스 = 레이저 물리 배열
- 비디오 I/P/B, GOP — 시간 중복성. 왜 seek이 키프레임에 스냅되는가
- (덤) EXIF/메타데이터 — 블랙레벨·CCM이 파일에 실려 다니는 이유

**기타**

-
