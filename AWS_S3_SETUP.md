# AWS S3 배포 설정 가이드

## 사전 준비

- AWS 계정
- GitHub 저장소 (Hanyang-HCC-Lab/Industrial_AI_Bootcamp_HYU)
- GitHub OAuth App (Organization 설정에서 승인됨)

---

## 1단계: S3 버킷 생성

### 1-1. AWS S3 콘솔 접속
```
https://console.aws.amazon.com/s3/
```

### 1-2. 버킷 생성
1. **Create bucket** 클릭
2. 버킷 이름 입력 (예: `industrial-ai-bootcamp-hyu`)
3. **AWS Region**: `Asia Pacific (Seoul) ap-northeast-2` 선택
4. **Block all public access** 체크 해제
   - ⚠️ 경고 확인: "I acknowledge..." 체크
5. **Create bucket** 클릭

### 1-3. 정적 웹사이트 호스팅 활성화
1. 생성한 버킷 클릭
2. **Properties** 탭
3. 맨 아래 **Static website hosting** 섹션
4. **Edit** 클릭
5. **Enable** 선택
6. **Index document**: `index.html`
7. **Error document**: `index.html`
8. **Save changes**
9. **Bucket website endpoint** URL 복사 (예: `http://bucket-name.s3-website.ap-northeast-2.amazonaws.com`)

### 1-4. 버킷 정책 설정 (퍼블릭 읽기 권한)
1. **Permissions** 탭
2. **Bucket policy** 섹션
3. **Edit** 클릭
4. 다음 정책 붙여넣기 (버킷 이름 변경 필요):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

**중요**: `YOUR_BUCKET_NAME`을 실제 버킷 이름으로 변경

5. **Save changes**

---

## 2단계: IAM 사용자 생성 (GitHub Actions용)

### 2-1. IAM 콘솔 접속
```
https://console.aws.amazon.com/iam/
```

### 2-2. 사용자 생성
1. 왼쪽 메뉴 **Users** 클릭
2. **Add users** 클릭
3. **User name**: `github-actions-deploy`
4. **Select AWS credential type**: **Access key - Programmatic access** 체크
5. **Next: Permissions**

### 2-3. 권한 설정
1. **Attach existing policies directly** 선택
2. **Create policy** 클릭 (새 탭 열림)
3. **JSON** 탭 선택
4. 다음 정책 붙여넣기:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

**중요**: `YOUR_BUCKET_NAME`을 실제 버킷 이름으로 변경

5. **Next: Tags** → **Next: Review**
6. **Name**: `S3DeployPolicy`
7. **Create policy**
8. 원래 탭으로 돌아가서 새로고침
9. `S3DeployPolicy` 검색 후 체크
10. **Next: Tags** → **Next: Review**
11. **Create user**

### 2-4. 액세스 키 저장
```
Access key ID: AKIAXXXXXXXXXXXXXXXX
Secret access key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ 중요**: Secret access key는 이 화면에서만 표시됩니다. 안전한 곳에 저장!

---

## 3단계: GitHub Secrets 설정

### 3-1. GitHub 저장소 Settings
```
https://github.com/Hanyang-HCC-Lab/Industrial_AI_Bootcamp_HYU/settings/secrets/actions
```

### 3-2. Secrets 추가
**New repository secret** 클릭하여 다음 4개 추가:

| Name | Value | 예시 |
|------|-------|------|
| `AWS_ACCESS_KEY_ID` | IAM 액세스 키 ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM 시크릿 키 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | S3 리전 | `ap-northeast-2` |
| `S3_BUCKET_NAME` | S3 버킷 이름 | `industrial-ai-bootcamp-hyu` |

### 3-3. CloudFront 사용 시 (선택사항)
| Name | Value |
|------|-------|
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront 배포 ID |

---

## 4단계: CMS OAuth 앱 설정 변경

### 4-1. GitHub OAuth App 수정

1. **GitHub Settings** → **Developer settings** → **OAuth Apps**
2. 기존 OAuth App 선택 (Industrial AI CMS)
3. **Homepage URL** 변경:
   ```
   http://YOUR_BUCKET_NAME.s3-website.ap-northeast-2.amazonaws.com
   ```
4. **Authorization callback URL**은 그대로 유지:
   ```
   https://api.netlify.com/auth/done
   ```

   ⚠️ **문제**: Netlify callback URL을 사용하므로 Netlify 없이는 OAuth 작동 안 함

### 4-2. 대안: Netlify는 CMS 인증만 사용

**권장 방법**: Netlify는 유지하되 빌드는 하지 않음

1. Netlify는 `/admin` 페이지만 호스팅 (GitHub OAuth 콜백용)
2. 실제 사이트는 S3에서 서빙
3. CMS에서 저장 → GitHub → GitHub Actions → S3 배포

**또는**

Decap CMS의 자체 OAuth 서버 구축 (복잡):
- https://decapcms.org/docs/external-oauth-clients/

---

## 5단계: 배포 테스트

### 5-1. 코드 푸시
```bash
git add .
git commit -m "Configure AWS S3 deployment"
git push origin main
```

### 5-2. GitHub Actions 확인
```
https://github.com/Hanyang-HCC-Lab/Industrial_AI_Bootcamp_HYU/actions
```

워크플로우 실행 확인:
- ✅ Build data files
- ✅ Sync to S3
- ✅ Deploy complete

### 5-3. 사이트 접속
```
http://YOUR_BUCKET_NAME.s3-website.ap-northeast-2.amazonaws.com
```

---

## 6단계: 도메인 연결 (선택사항)

### 방법 1: S3 정적 웹사이트 + Route 53
1. Route 53에서 도메인 설정
2. A 레코드로 S3 버킷 별칭 설정

### 방법 2: CloudFront + 커스텀 도메인 (권장)
1. CloudFront 배포 생성
2. Origin: S3 버킷
3. SSL/TLS 인증서 (AWS Certificate Manager)
4. 커스텀 도메인 연결

---

## CMS 사용 방법

### Netlify를 유지하는 경우:
1. **CMS 접속**: `https://hyu-aibootcamp.netlify.app/admin`
2. GitHub 로그인
3. 게시물 작성/수정
4. 저장 → GitHub 커밋 → GitHub Actions → S3 배포

### Netlify 없이 사용하는 경우:
- GitHub OAuth 서버 구축 필요
- 또는 직접 GitHub에서 JSON 파일 수정

---

## 비용 예상

### S3 스토리지
- **$0.025/GB/월** (서울 리전)
- 예상: 1GB = 월 $0.025

### S3 데이터 전송
- **첫 1GB**: 무료
- **다음 9.999TB**: $0.126/GB
- 예상 (월 100GB 트래픽): ~$12

### GitHub Actions
- **월 2,000분**: 무료
- `build-data.js` 실행: ~10초
- 월 1,000회 배포해도 충분

### 총 예상 비용
- **월 $1~$15** (트래픽에 따라)
- Netlify 무료 플랜보다 안정적

---

## 문제 해결

### 배포는 되는데 사이트가 안 보임
- S3 버킷 정책 확인
- Static website hosting 활성화 확인
- 올바른 URL 사용 (`s3-website` URL)

### CMS 로그인 안 됨
- GitHub OAuth App 설정 확인
- Organization에서 앱 승인 확인
- `admin/config.yml`의 저장소 이름 확인

### GitHub Actions 실패
- Secrets 설정 확인
- IAM 권한 확인
- 버킷 이름 확인

---

## 완료 체크리스트

- [ ] S3 버킷 생성 및 정적 웹사이트 호스팅 활성화
- [ ] 버킷 정책 설정 (퍼블릭 읽기 권한)
- [ ] IAM 사용자 생성 및 정책 연결
- [ ] GitHub Secrets 설정 (4개)
- [ ] 코드 푸시 및 GitHub Actions 실행 확인
- [ ] S3 URL로 사이트 접속 확인
- [ ] CMS에서 테스트 게시물 저장 확인
- [ ] S3에 변경사항 반영 확인
