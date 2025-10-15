// 공지사항 목록 페이지 스크립트

const itemsPerPage = 10;
let currentPage = 1;

// 공지사항 데이터 로드 및 표시
function loadNotices() {
    // noticesData는 data-loader.js에서 로드됨
    if (!noticesData || noticesData.length === 0) {
        console.error('공지사항 데이터를 불러올 수 없습니다.');
        document.getElementById('notice-list').innerHTML = `
            <div class="notice-row">
                <div class="notice-num" colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    공지사항을 불러오는데 실패했습니다.
                </div>
            </div>
        `;
        return;
    }

    // ID 기준 내림차순 정렬 (최신 글이 위로)
    noticesData.sort((a, b) => b.id - a.id);
    displayNotices(currentPage);
    displayPagination();
}

// 공지사항 목록 표시
function displayNotices(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNotices = noticesData.slice(startIndex, endIndex);

    const noticeListContainer = document.getElementById('notice-list');

    if (pageNotices.length === 0) {
        noticeListContainer.innerHTML = `
            <div class="notice-row">
                <div class="notice-num" colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    등록된 공지사항이 없습니다.
                </div>
            </div>
        `;
        return;
    }

    noticeListContainer.innerHTML = pageNotices.map(notice => `
        <div class="notice-row">
            <div class="notice-num">
                ${notice.isNew ? '<span class="badge-new">NEW</span>' : notice.id}
            </div>
            <div class="notice-subject">
                <a href="notice-detail.html?id=${notice.id}">${notice.title}</a>
            </div>
            <div class="notice-author">${notice.author}</div>
            <div class="notice-date-col">${notice.date}</div>
        </div>
    `).join('');
}

// 페이지네이션 표시
function displayPagination() {
    const totalPages = Math.ceil(noticesData.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // 이전 버튼
    if (currentPage > 1) {
        paginationHTML += `<a href="#" onclick="changePage(${currentPage - 1}); return false;">&laquo;</a>`;
    }

    // 페이지 번호
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<a href="#" class="${activeClass}" onclick="changePage(${i}); return false;">${i}</a>`;
    }

    // 다음 버튼
    if (currentPage < totalPages) {
        paginationHTML += `<a href="#" onclick="changePage(${currentPage + 1}); return false;">&raquo;</a>`;
    }

    paginationContainer.innerHTML = paginationHTML;
}

// 페이지 변경
function changePage(page) {
    currentPage = page;
    displayNotices(currentPage);
    displayPagination();
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 데이터 로드 완료 후 실행
window.addEventListener('dataLoaded', loadNotices);
