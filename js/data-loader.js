// CMS에서 관리되는 데이터를 로드하는 스크립트
// build-data.js 스크립트가 빌드 시 통합 JSON 파일을 생성함

// 뉴스 데이터 로드
async function loadNewsData() {
    try {
        const response = await fetch('/data/news-data.json');
        if (!response.ok) throw new Error('뉴스 데이터 로드 실패');
        return await response.json();
    } catch (error) {
        console.error('뉴스 데이터 로드 오류:', error);
        return [];
    }
}

// 공지사항 데이터 로드
async function loadNoticesData() {
    try {
        const response = await fetch('/data/notices-data.json');
        if (!response.ok) throw new Error('공지사항 데이터 로드 실패');
        return await response.json();
    } catch (error) {
        console.error('공지사항 데이터 로드 오류:', error);
        return [];
    }
}

// 전역 변수로 데이터 설정 (기존 코드와 호환성 유지)
let newsData = [];
let noticesData = [];

// 데이터 초기화
async function initializeData() {
    newsData = await loadNewsData();
    noticesData = await loadNoticesData();

    // 데이터 로드 완료 이벤트 발생
    window.dispatchEvent(new CustomEvent('dataLoaded', {
        detail: { newsData, noticesData }
    }));
}

// 페이지 로드 시 데이터 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeData);
} else {
    initializeData();
}
