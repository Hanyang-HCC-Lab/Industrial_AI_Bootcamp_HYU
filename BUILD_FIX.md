# Netlify 빌드 설정 수정 가이드

## 문제
- CMS에서 게시물을 수정했지만 사이트에 반영되지 않음
- `build-data.js` 스크립트가 Netlify에서 실행되지 않음

## 해결 방법

### 1단계: Netlify 대시보드 접속
```
https://app.netlify.com → hyu-aibootcamp 선택
```

### 2단계: Site settings → Build & deploy

1. 왼쪽 메뉴에서 **Site settings** 클릭
2. **Build & deploy** 클릭
3. **Continuous deployment** 섹션 찾기
4. **Build settings** 섹션에서 **Edit settings** 버튼 클릭

### 3단계: 빌드 설정 입력

다음과 같이 입력:

```
Base directory: (비워두기)

Build command: node build-data.js

Publish directory: .
```

**중요:** Publish directory는 점(.) 하나만 입력 (현재 디렉토리)

### 4단계: Save 클릭

### 5단계: 수동 재배포

1. **Deploys** 탭 클릭
2. **Trigger deploy** 버튼 클릭
3. **Deploy site** 선택

### 6단계: 빌드 로그 확인

배포 중인 항목 클릭 → Deploy log에서 다음 메시지 확인:

```
11:XX:XX AM: $ node build-data.js
11:XX:XX AM: 뉴스 데이터 통합 중...
11:XX:XX AM: ✓ 뉴스 2개 통합 완료
11:XX:XX AM: 공지사항 데이터 통합 중...
11:XX:XX AM: ✓ 공지사항 2개 통합 완료
11:XX:XX AM: 빌드 완료!
```

이 메시지가 보이면 성공!

---

## 확인 방법

배포 완료 후:

1. **JSON 파일 직접 확인:**
   ```
   https://hyu-aibootcamp.netlify.app/data/notices-data.json
   ```
   제목이 "테스트 게시물 1 11"로 표시되어야 함

2. **실제 페이지 확인:**
   ```
   https://hyu-aibootcamp.netlify.app/community/notice-detail.html?id=1
   ```
   새로고침 (Ctrl/Cmd + Shift + R)

---

## 추가: netlify.toml이 무시되는 경우

만약 netlify.toml이 인식되지 않는다면, 대시보드에서 직접 설정하는 것이 더 확실합니다.
