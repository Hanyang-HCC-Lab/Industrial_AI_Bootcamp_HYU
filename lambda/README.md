# Lambda OAuth Server 배포 가이드

## 로컬에서 패키지 준비

```bash
cd lambda
npm install
zip -r oauth-function.zip oauth.js node_modules/ package.json
```

## AWS Lambda에 업로드

1. AWS Lambda 콘솔 접속
2. `decap-cms-oauth` 함수 선택
3. **Upload from** → **.zip file**
4. `oauth-function.zip` 업로드

## 환경 변수 설정

**Configuration** → **Environment variables**

- `GITHUB_CLIENT_ID`: GitHub OAuth App의 Client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth App의 Client Secret

## 테스트

API Gateway URL로 접속:
```
https://YOUR_API_GATEWAY_URL/auth
```

GitHub 로그인 화면으로 리다이렉트되면 성공!
