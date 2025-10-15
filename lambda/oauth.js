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
