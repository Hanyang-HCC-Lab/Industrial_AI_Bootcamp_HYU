// 뉴스/보도자료 리스트 관리
let currentPage = 1;
const itemsPerPage = 5;

// 데이터 로드 완료 후 뉴스 불러오기
window.addEventListener('dataLoaded', function() {
    loadNews();
});

// 뉴스 데이터 불러오기
function loadNews() {
    if (!newsData || newsData.length === 0) {
        console.error('뉴스 데이터를 불러올 수 없습니다.');
        const newsListContainer = document.getElementById('news-list');
        if (newsListContainer) {
            newsListContainer.innerHTML = '<p style="text-align: center; padding: 40px 0;">뉴스를 불러오는데 실패했습니다.</p>';
        }
        return;
    }

    // 최신순으로 정렬 (id가 높을수록 최신)
    const sortedNews = [...newsData].sort((a, b) => b.id - a.id);

    displayNews(currentPage, sortedNews);
    displayPagination(sortedNews);
}

// 뉴스 목록 표시
function displayNews(page, sortedNews) {
    const newsListContainer = document.getElementById('news-list');
    if (!newsListContainer) return;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNews = sortedNews.slice(startIndex, endIndex);

    if (pageNews.length === 0) {
        newsListContainer.innerHTML = '<p style="text-align: center; padding: 40px 0;">등록된 뉴스가 없습니다.</p>';
        return;
    }

    newsListContainer.innerHTML = pageNews.map(news => `
        <article class="news-item-page">
            <div class="news-thumbnail">
                <a href="${news.link}" target="_blank" rel="noopener noreferrer">
                    <img src="${news.thumbnail}" alt="${news.title}">
                </a>
            </div>
            <div class="news-info">
                <h3><a href="${news.link}" target="_blank" rel="noopener noreferrer">${news.title}</a></h3>
                <p class="news-summary">${news.summary}</p>
                <div class="news-meta">
                    <span class="news-date">${news.date}</span>
                    <span class="news-author">출처: ${news.author}</span>
                </div>
            </div>
        </article>
    `).join('');
}

// 페이지네이션 표시
function displayPagination(sortedNews) {
    const paginationContainer = document.getElementById('news-pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(sortedNews.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // 이전 버튼
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage - 1})">이전</button>`;
    }

    // 페이지 번호들
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="page-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="page-btn" onclick="changePage(${i})">${i}</button>`;
        }
    }

    // 다음 버튼
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})">다음</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
}

// 페이지 변경
function changePage(page) {
    currentPage = page;
    const sortedNews = [...newsData].sort((a, b) => b.id - a.id);
    displayNews(currentPage, sortedNews);
    displayPagination(sortedNews);

    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
