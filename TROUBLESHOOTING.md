# /admin 하얀 화면 문제 해결

## 문제: https://hyu-aibootcamp.netlify.app/admin 접속 시 하얀 화면

### 원인 1: Netlify Identity 미활성화 (가장 흔한 원인)

#### 확인 방법:
1. https://app.netlify.com 로그인
2. `hyu-aibootcamp` 사이트 선택
3. 상단 **Identity** 탭 클릭
4. 다음 중 하나가 표시되는지 확인:
   - "Enable Identity" 버튼이 보임 → **Identity가 비활성화됨**
   - "Identity is enabled" 메시지와 사용자 목록이 보임 → 활성화됨

#### 해결 방법:
"Enable Identity" 버튼이 보이면 클릭하여 활성화

---

### 원인 2: Git Gateway 미활성화

#### 확인 방법:
1. Netlify → Identity 탭
2. 아래로 스크롤하여 **Services** 또는 **Git Gateway** 섹션 찾기
3. 상태 확인:
   - "Enable Git Gateway" 버튼이 보임 → 비활성화됨
   - "Git Gateway is enabled" → 활성화됨

#### 해결 방법:
"Enable Git Gateway" 버튼 클릭

---

### 원인 3: 브라우저 캐시

#### 해결 방법:
강력 새로고침:
- **Windows/Linux**: Ctrl + Shift + R
- **Mac**: Command + Shift + R

또는 시크릿 모드로 접속:
- **Chrome**: Ctrl/Cmd + Shift + N
- **Safari**: Cmd + Shift + N

---

### 원인 4: JavaScript 에러

#### 확인 방법:
1. F12 → Console 탭
2. 에러 메시지 확인

#### 주요 에러별 해결:

**에러: "Failed to load config.yml"**
→ config.yml 문법 오류
→ YAML 유효성 검사: https://www.yamllint.com/

**에러: "Cannot read property 'backend' of undefined"**
→ config.yml이 로드되지 않음
→ 파일 경로 확인: `/admin/config.yml`

**에러: "Git Gateway is not enabled"**
→ Netlify Identity → Services → Enable Git Gateway

**에러: "Unable to initialize Identity"**
→ Identity가 활성화되지 않음
→ Netlify → Identity → Enable Identity

---

### 원인 5: Decap CMS 스크립트 로드 실패

#### 확인 방법:
F12 → Network 탭 → 새로고침

다음 파일이 200 OK로 로드되는지 확인:
- `https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js`

빨간색(실패)이면:
- 네트워크 연결 확인
- 방화벽/보안 프로그램 확인

---

## 체크리스트 (순서대로 확인)

1. [ ] Netlify Identity 활성화됨
2. [ ] Git Gateway 활성화됨
3. [ ] 브라우저 강력 새로고침 (Ctrl/Cmd + Shift + R)
4. [ ] Console 탭에서 JavaScript 에러 확인
5. [ ] Network 탭에서 decap-cms.js 로드 확인
6. [ ] 시크릿 모드로 접속 테스트

---

## 여전히 안 되면?

다음 정보를 확인해주세요:

### 1. Console 에러 메시지
F12 → Console 탭의 모든 빨간색 메시지 복사

### 2. Network 실패 요청
F12 → Network 탭에서 빨간색 실패 항목 확인

### 3. Netlify 배포 로그
Netlify → Deploys → 최신 배포 클릭 → Deploy log 확인
