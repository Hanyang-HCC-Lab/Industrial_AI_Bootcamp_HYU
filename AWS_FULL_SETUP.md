# AWS 완전 자체 운영 가이드 (Netlify 없이)

Decap CMS를 AWS Lambda 기반 OAuth 서버와 함께 사용하여 완전히 AWS 인프라에서만 운영

---

## 아키텍처

```
[관리자] → [S3 /admin] → [Decap CMS] → [API Gateway + Lambda OAuth]
    → [GitHub API] → [저장소 커밋] → [GitHub Actions]
    → [빌드 + S3 배포] → [사용자에게 서빙]
```

---

## 필요한 AWS 서비스

1. **S3**: 정적 웹사이트 호스팅
2. **Lambda**: OAuth 인증 서버
3. **API Gateway**: Lambda 엔드포인트
4. **CloudFront** (선택): CDN 및 HTTPS

---

## 1단계: Lambda OAuth 서버 생성

### 1-1. Lambda 함수 생성

**AWS Lambda 콘솔** (https://console.aws.amazon.com/lambda/)

1. **Create function**
2. **Function name**: `decap-cms-oauth`
3. **Runtime**: `Node.js 18.x`
4. **Create function**

### 1-2. Lambda 코드 작성

**파일: lambda/oauth.js** (로컬에서 작성 후 업로드)

```javascript
const fetch = require('node-fetch');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

exports.handler = async (event) => {
    const { httpMethod, queryStringParameters } = event;

    // CORS 헤더
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // OPTIONS 요청 (CORS preflight)
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // /auth 경로: GitHub OAuth 인증 시작
    if (event.path === '/auth') {
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;

        return {
            statusCode: 302,
            headers: {
                ...headers,
                'Location': redirectUrl
            },
            body: ''
        };
    }

    // /callback 경로: GitHub OAuth 콜백 처리
    if (event.path === '/callback' && queryStringParameters?.code) {
        const code = queryStringParameters.code;

        try {
            // GitHub에서 액세스 토큰 받기
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: code
                })
            });

            const tokenData = await tokenResponse.json();

            if (tokenData.error) {
                throw new Error(tokenData.error_description);
            }

            // 성공 페이지로 리다이렉트 (토큰 포함)
            const successHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>인증 성공</title>
                </head>
                <body>
                    <script>
                        (function() {
                            const token = "${tokenData.access_token}";
                            const provider = "github";

                            window.opener.postMessage(
                                'authorization:github:success:' + JSON.stringify({
                                    token: token,
                                    provider: provider
                                }),
                                document.location.origin
                            );

                            window.close();
                        })();
                    </script>
                    <p>인증 성공! 이 창은 자동으로 닫힙니다...</p>
                </body>
                </html>
            `;

            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/html'
                },
                body: successHtml
            };

        } catch (error) {
            console.error('OAuth error:', error);

            return {
                statusCode: 500,
                headers: {
                    ...headers,
                    'Content-Type': 'text/html'
                },
                body: `<h1>인증 실패</h1><p>${error.message}</p>`
            };
        }
    }

    // 기본 응답
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Not Found' })
    };
};
```

### 1-3. Lambda 환경 변수 설정

**Configuration** → **Environment variables** → **Edit**

| Key | Value |
|-----|-------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App의 Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App의 Client Secret |

### 1-4. Lambda 배포 패키지 생성

로컬에서:

```bash
cd lambda
npm init -y
npm install node-fetch@2
```

`lambda/oauth.js` 파일 생성 (위 코드)

압축:
```bash
zip -r oauth-function.zip oauth.js node_modules/
```

Lambda 콘솔에서 **Upload from** → **.zip file** → `oauth-function.zip` 업로드

---

## 2단계: API Gateway 생성

### 2-1. API 생성

**API Gateway 콘솔** (https://console.aws.amazon.com/apigateway/)

1. **Create API**
2. **HTTP API** 선택 → **Build**
3. **API name**: `decap-cms-oauth-api`
4. **Next**

### 2-2. 라우트 생성

**Routes** → **Create**

| Method | Path | Integration |
|--------|------|-------------|
| GET | /auth | Lambda: decap-cms-oauth |
| GET | /callback | Lambda: decap-cms-oauth |
| OPTIONS | /auth | Lambda: decap-cms-oauth |
| OPTIONS | /callback | Lambda: decap-cms-oauth |

### 2-3. CORS 설정

**CORS** → **Configure**

- **Access-Control-Allow-Origin**: `*`
- **Access-Control-Allow-Headers**: `*`
- **Access-Control-Allow-Methods**: `GET, POST, OPTIONS`

### 2-4. 배포

**Stages** → **$default** → **Invoke URL** 복사

예: `https://abc123.execute-api.ap-northeast-2.amazonaws.com`

---

## 3단계: GitHub OAuth App 수정

### 3-1. OAuth App 설정 변경

**GitHub Settings** → **Developer settings** → **OAuth Apps**

기존 OAuth App 수정:

| Field | Value |
|-------|-------|
| **Homepage URL** | `http://YOUR_S3_BUCKET.s3-website.ap-northeast-2.amazonaws.com` |
| **Authorization callback URL** | `https://YOUR_API_GATEWAY_URL/callback` |

예: `https://abc123.execute-api.ap-northeast-2.amazonaws.com/callback`

---

## 4단계: Decap CMS 설정 수정

### 4-1. admin/config.yml 수정

```yaml
backend:
  name: github
  repo: Hanyang-HCC-Lab/Industrial_AI_Bootcamp_HYU
  branch: main
  base_url: https://YOUR_API_GATEWAY_URL
  auth_endpoint: /auth

media_folder: "assets/images/uploads"
public_folder: "/assets/images/uploads"

locale: 'ko'

collections:
  # ... 기존 설정 유지
```

**중요**: `base_url`을 API Gateway URL로 변경

---

## 5단계: 배포 및 테스트

### 5-1. 코드 푸시

```bash
git add .
git commit -m "Configure self-hosted OAuth for Decap CMS"
git push origin main
```

### 5-2. GitHub Actions 배포 확인

- GitHub Actions 워크플로우 실행
- S3에 배포 완료

### 5-3. CMS 접속

```
http://YOUR_S3_BUCKET.s3-website.ap-northeast-2.amazonaws.com/admin
```

1. **Login with GitHub** 클릭
2. GitHub 로그인 화면으로 리다이렉트
3. 권한 승인
4. CMS 대시보드로 돌아옴

---

## 6단계: CloudFront + HTTPS (선택, 권장)

### 6-1. CloudFront 배포 생성

**CloudFront 콘솔** (https://console.aws.amazon.com/cloudfront/)

1. **Create distribution**
2. **Origin domain**: S3 website endpoint (직접 입력)
   - 예: `bucket-name.s3-website.ap-northeast-2.amazonaws.com`
3. **Viewer protocol policy**: Redirect HTTP to HTTPS
4. **Allowed HTTP methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
5. **Create distribution**

### 6-2. SSL 인증서 (ACM)

**AWS Certificate Manager** (https://console.aws.amazon.com/acm/)

1. **Request certificate**
2. **Public certificate**
3. 도메인 입력 (예: `bootcamp.hanyang.ac.kr`)
4. DNS 또는 이메일 검증

### 6-3. CloudFront에 SSL 연결

1. CloudFront 배포 설정 → **Edit**
2. **Alternate domain names (CNAMEs)**: 도메인 입력
3. **Custom SSL certificate**: ACM 인증서 선택
4. **Save changes**

### 6-4. Route 53 도메인 연결

1. **Hosted zone** 생성/선택
2. **Create record**
3. **Record name**: `bootcamp` (또는 원하는 서브도메인)
4. **Record type**: A
5. **Alias**: Yes
6. **Route traffic to**: CloudFront distribution

---

## 비용 계산

### Lambda
- **월 100만 요청**: 무료
- **예상**: CMS 로그인/저장 월 1,000회 → **$0**

### API Gateway
- **월 100만 요청**: 무료
- **예상**: 월 1,000회 → **$0**

### S3
- **스토리지**: 1GB = $0.025/월
- **전송**: 월 100GB = ~$12

### CloudFront (선택)
- **전송**: 첫 10TB = $0.085/GB
- **월 100GB** = ~$8.5

### 총 비용
- **S3만**: 월 ~$1-15
- **S3 + CloudFront**: 월 ~$10-20

---

## 문제 해결

### CMS 로그인 안 됨
- API Gateway URL 확인
- Lambda 환경 변수 확인
- GitHub OAuth callback URL 확인
- 브라우저 콘솔에서 에러 확인

### Lambda 에러
- CloudWatch Logs 확인
- `node-fetch` 패키지 포함 확인
- 환경 변수 설정 확인

### CORS 에러
- API Gateway CORS 설정 확인
- Lambda 응답 헤더 확인

---

## 완료 체크리스트

- [ ] S3 버킷 생성 및 정적 호스팅 활성화
- [ ] Lambda 함수 생성 및 코드 배포
- [ ] Lambda 환경 변수 설정
- [ ] API Gateway 생성 및 Lambda 연결
- [ ] GitHub OAuth App callback URL 변경
- [ ] admin/config.yml 수정
- [ ] GitHub Actions Secrets 설정
- [ ] 코드 푸시 및 배포 확인
- [ ] CMS 로그인 테스트
- [ ] 게시물 저장 테스트

---

## 참고 자료

- Decap CMS 외부 OAuth: https://decapcms.org/docs/external-oauth-clients/
- AWS Lambda: https://aws.amazon.com/lambda/
- API Gateway: https://aws.amazon.com/api-gateway/
