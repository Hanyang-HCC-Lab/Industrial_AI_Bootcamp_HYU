# OAuth 접근 제한 오류 해결 가이드

## 오류 메시지
```
API_ERROR: Although you appear to have the correct authorization credentials,
the `Hanyang-HCC-Lab` organization has enabled OAuth App access restrictions
```

## 원인
GitHub Organization이 제3자 OAuth 앱의 접근을 제한하고 있습니다.

## 해결 방법

### 1단계: Organization 관리자 확인

**Organization 관리자 권한이 있는지 확인:**
1. https://github.com/Hanyang-HCC-Lab 접속
2. **People** 탭 클릭
3. 본인 이름 옆에 "Owner" 뱃지가 있는지 확인
   - ✅ Owner → 2단계 진행
   - ❌ Member → 3단계(관리자 요청) 진행

---

### 2단계: Netlify 앱 승인 (Owner 권한 필요)

#### 방법 A: OAuth 제한 완전 해제 (가장 간단)

1. **Settings 페이지 이동:**
   ```
   https://github.com/organizations/Hanyang-HCC-Lab/settings/oauth_application_policy
   ```

2. **Third-party application access policy 섹션:**
   - 현재 상태: "Third-party application access restrictions enabled"
   - **Remove restrictions** 버튼 클릭
   - 확인 대화상자에서 "Yes, remove restrictions" 클릭

3. **완료:**
   - 모든 OAuth 앱이 자동으로 승인됨
   - Decap CMS가 즉시 작동

#### 방법 B: Netlify만 개별 승인 (더 안전)

1. **Settings 페이지 이동:**
   ```
   https://github.com/organizations/Hanyang-HCC-Lab/settings/oauth_application_policy
   ```

2. **Authorized OAuth Apps 탭 또는 Pending requests 확인:**
   - "Netlify" 찾기
   - 없으면 먼저 CMS에서 저장 시도 (요청 생성됨)

3. **승인:**
   - Netlify 옆 **Review** 또는 **Grant** 버튼 클릭
   - "Grant access to Hanyang-HCC-Lab" 클릭
   - 권한 범위 확인 후 **Authorize** 클릭

---

### 3단계: Organization 관리자에게 요청

Owner 권한이 없는 경우:

#### 관리자 찾기:
1. https://github.com/orgs/Hanyang-HCC-Lab/people 접속
2. "Owner" 역할 가진 사용자 확인

#### 요청 메시지 템플릿:

**제목:** Netlify OAuth 앱 승인 요청

**내용:**
```
안녕하세요,

Industrial_AI_Bootcamp_HYU 프로젝트에서 콘텐츠 관리 시스템(Decap CMS)을
사용하기 위해 Netlify 앱의 Organization 접근 권한이 필요합니다.

다음 단계로 승인 부탁드립니다:

1. https://github.com/organizations/Hanyang-HCC-Lab/settings/oauth_application_policy 접속
2. "Third-party application access policy" 섹션에서 다음 중 하나 선택:

   옵션 A (간단): Remove restrictions 클릭
   옵션 B (안전): Netlify 앱만 개별 승인

3. 승인 완료 후 알려주시면 테스트하겠습니다.

감사합니다.
```

---

### 4단계: Git Gateway 재연결 (필요 시)

승인 후에도 문제가 지속되면:

1. **Netlify Identity → Services → Git Gateway:**
   - "Disable Git Gateway" 클릭
   - 확인

2. **다시 활성화:**
   - "Enable Git Gateway" 클릭
   - GitHub 권한 재승인

3. **테스트:**
   - CMS 로그아웃 후 재로그인
   - 게시물 저장 테스트

---

## 대안: 개인 저장소로 Fork

Organization 설정을 변경할 수 없는 경우:

### 1. 저장소 Fork
```
https://github.com/Hanyang-HCC-Lab/Industrial_AI_Bootcamp_HYU
→ Fork 버튼 클릭
→ 본인 계정으로 Fork
```

### 2. Netlify 저장소 변경

**Netlify 대시보드에서:**
1. Site settings → Build & deploy
2. "Link to a different repository" 클릭
3. Fork한 저장소 선택
4. Deploy 설정 그대로 유지

### 3. 원본과 동기화 (정기적으로)

Fork한 저장소를 원본과 동기화:
```bash
# 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/Hanyang-HCC-Lab/Industrial_AI_Bootcamp_HYU.git

# 원본의 변경사항 가져오기
git fetch upstream
git merge upstream/main

# Fork 저장소에 푸시
git push origin main
```

---

## 확인 체크리스트

승인 완료 후 다음을 확인:

- [ ] GitHub Organization Settings에서 Netlify 앱이 "Approved" 상태
- [ ] Netlify Git Gateway가 "Enabled" 상태
- [ ] CMS 로그아웃 후 재로그인
- [ ] 테스트 게시물 생성/수정/저장 성공
- [ ] GitHub 저장소에 커밋 자동 생성 확인

---

## 추가 문제 해결

### "Not Found" 에러
- Git Gateway 비활성화 후 재활성화
- Netlify 배포 재시작

### "Unauthorized" 에러
- Identity 사용자가 GitHub 저장소 접근 권한 있는지 확인
- Git Gateway → Roles 설정 확인

### 여전히 저장 안 됨
- 브라우저 개발자 도구 → Network 탭에서 실패한 요청 확인
- 상세 에러 메시지 복사하여 문의
