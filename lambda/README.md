# Lambda OAuth Server 배포 가이드

## 로컬에서 패키지 준비

```bash
cd lambda
zip oauth-function.zip oauth.js package.json
```

**주의:** `node-fetch`를 사용하지 않으므로 `node_modules` 불필요

## AWS Lambda에 업로드

1. AWS Lambda 콘솔 접속: https://console.aws.amazon.com/lambda/
2. `decap-cms-oauth` 함수 선택
3. **Code** 탭 → **Upload from** → **.zip file**
4. `oauth-function.zip` 선택 및 업로드
5. **Save** 클릭

## 환경 변수 설정 (중요!)

1. **Configuration** 탭 클릭
2. **Environment variables** → **Edit**
3. 다음 2개 추가:

| Key | Value |
|-----|-------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App의 Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App의 Client Secret |

4. **Save** 클릭

## GitHub OAuth App 설정 확인

**GitHub Settings** → **Developer settings** → **OAuth Apps**

다음 설정 확인:

- **Homepage URL**: `http://aibootcamp.hanyang.ac.kr.s3-website.ap-northeast-2.amazonaws.com`
- **Authorization callback URL**: `https://5ugzrpufnl.execute-api.ap-northeast-2.amazonaws.com/callback`

## 테스트

1. **API Gateway URL로 직접 접속:**
   ```
   https://5ugzrpufnl.execute-api.ap-northeast-2.amazonaws.com/auth
   ```
   → GitHub 로그인 화면으로 리다이렉트되면 성공!

2. **CMS에서 로그인 테스트:**
   ```
   http://aibootcamp.hanyang.ac.kr.s3-website.ap-northeast-2.amazonaws.com/admin
   ```
   → "Login with GitHub" 클릭 후 정상 작동 확인

## CloudWatch Logs로 디버깅

문제 발생 시 로그 확인:

1. Lambda 함수 → **Monitor** 탭
2. **View CloudWatch logs** 클릭
3. 최신 로그 스트림 확인
4. 에러 메시지 확인
