# Netlify 설정 상세 가이드 (스크린샷 기준)

## 1. Netlify 대시보드 → 사이트 추가

### 화면 위치: https://app.netlify.com

1. 로그인 후 메인 대시보드에 접속
2. 화면 중앙 또는 우측 상단에 있는 버튼 클릭:
   ```
   [Add new site ▼]  <- 이 버튼 클릭
   ```

3. 드롭다운 메뉴에서 선택:
   ```
   ☑ Import an existing project  <- 이것 선택
   ```

---

## 2. Git 제공자 선택 화면

### 화면 제목: "Import an existing project from a Git repository"

화면에 3개의 큰 버튼이 표시됩니다:

```
┌─────────────────────────────────────────────┐
│  Deploy with GitHub        [GitHub 로고]     │  <- 이것 클릭
├─────────────────────────────────────────────┤
│  Deploy with GitLab        [GitLab 로고]     │
├─────────────────────────────────────────────┤
│  Deploy with Bitbucket  [Bitbucket 로고]     │
└─────────────────────────────────────────────┘
```

**GitHub 버튼 클릭**

---

## 3. GitHub 권한 승인 (처음 한 번만)

GitHub 팝업 창이 열립니다:

```
Netlify would like permission to:
- Read access to code
- Read and write access to deployments
```

**[Authorize Netlify]** 버튼 클릭

---

## 4. 저장소 선택 화면

### 화면 제목: "Pick a repository"

저장소 목록이 표시됩니다:

```
Search repositories: [검색창]

Your repositories:
  ○ username/industrial_AI_web        <- 이것 선택
  ○ username/another-repo
  ○ username/test-project
```

**저장소가 보이지 않는 경우:**

화면 하단에 링크가 있습니다:
```
Can't see your repo?
[Configure the Netlify app on GitHub]  <- 이 링크 클릭
```

클릭하면 GitHub 설정 페이지로 이동:
1. **Repository access** 섹션
2. **Select repositories** 선택
3. 드롭다운에서 `industrial_AI_web` 선택
4. **Save** 클릭
5. Netlify로 돌아가서 새로고침

---

## 5. 배포 설정 화면 ⭐ (질문하신 부분)

### 화면 제목: "Site settings and deploy"

이 화면에서 입력하는 부분입니다:

```
┌─────────────────────────────────────────────────────────┐
│ Branch to deploy                                        │
│ ┌─────────────────────────────────┐                    │
│ │ main                            │ <- 기본값 그대로    │
│ └─────────────────────────────────┘                    │
│                                                         │
│ Base directory                                          │
│ ┌─────────────────────────────────┐                    │
│ │                                 │ <- 비워두기         │
│ └─────────────────────────────────┘                    │
│                                                         │
│ Build command                                           │
│ ┌─────────────────────────────────┐                    │
│ │                                 │ <- 비워두기         │
│ └─────────────────────────────────┘                    │
│                                                         │
│ Publish directory                                       │
│ ┌─────────────────────────────────┐                    │
│ │ /                               │ <- 슬래시(/) 입력  │
│ └─────────────────────────────────┘                    │
│                                                         │
│        [Deploy industrial_AI_web]  <- 이 버튼 클릭      │
└─────────────────────────────────────────────────────────┘
```

### 각 필드 설명:

1. **Branch to deploy**: `main`
   - 이미 `main`으로 되어 있으면 그대로 두기
   - 만약 `master`로 되어 있다면 실제 GitHub 브랜치 이름에 맞게 변경

2. **Base directory**: (비워두기)
   - 프로젝트가 서브폴더에 있지 않으므로 비워둠

3. **Build command**: (비워두기)
   - 정적 HTML 사이트이므로 빌드가 필요 없음
   - React/Vue 등이면 `npm run build` 등을 입력하지만 우리는 불필요

4. **Publish directory**: `/`
   - 루트 디렉토리 전체를 배포
   - 슬래시(/) 하나만 입력

5. **Deploy 버튼 클릭**
   - 버튼 텍스트: "Deploy industrial_AI_web" (또는 저장소 이름)

---

## 6. 배포 진행 화면

버튼 클릭 후 자동으로 배포가 시작됩니다:

```
Site deploy in progress

Production: main@HEAD
Building...

[진행 바]

Deploy log:
...
```

1-2분 후 완료되면:
```
✓ Site is live

https://random-name-123456.netlify.app
```

이제 이 URL로 접속하면 사이트가 표시됩니다.

---

## 다음: Identity 설정으로 이동

배포가 완료되면 상단 탭을 확인하세요:

```
[Site overview]  [Deploys]  [Identity]  [Integrations]  [Analytics]
                              ^^^^^^^^
                              여기 클릭
```

**Identity** 탭을 클릭하면 다음 설정으로 진행할 수 있습니다.
