// Common Header Component
function loadHeader() {
    return `
    <header class="header">
        <div class="header-top">
            <div class="container">
                <a href="../index.html" class="logo-section">
                    <div class="university-logo">
                        <img src="../assets/HYU_logo.png" alt="한양대학교 로고">
                    </div>
                    <div class="project-logo">
                        <h1>산업AI 인재양성 부트캠프 사업단</h1>
                        <p class="subtitle">Industrial AI Talent Development Bootcamp Program</p>
                    </div>
                </a>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="main-nav">
            <div class="container">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="../about/greeting.html">사업단 소개</a>
                        <ul class="dropdown">
                            <li><a href="../about/greeting.html">인사말</a></li>
                            <li><a href="../about/organization.html">조직도</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="../curriculum/overview.html">교육과정</a>
                        <ul class="dropdown">
                            <li><a href="../curriculum/overview.html">교육과정 개요</a></li>
                            <li><a href="../curriculum/roadmap.html">교육과정 로드맵</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="../support/scholarship.html">지원 프로그램</a>
                        <ul class="dropdown">
                            <li><a href="../support/scholarship.html">장학 안내</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="../industry/partners.html">산학협력</a>
                        <ul class="dropdown">
                            <li><a href="../industry/partners.html">협력기업 소개</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="../community/notice.html">커뮤니티</a>
                        <ul class="dropdown">
                            <li><a href="../community/notice.html">공지사항</a></li>
                            <li><a href="../community/news.html">뉴스/보도자료</a></li>
                        </ul>
                    </li>
                </ul>
                <button class="mobile-menu-toggle" aria-label="메뉴 열기">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    </header>
    `;
}

// Common Footer Component
function loadFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <h3>산업AI 인재양성 부트캠프 사업단</h3>
                    <p>주소: 서울시 성동구 왕십리로 222 퓨전테크센터(FTC) 503호</p>
                    <p>전화: 02-2220-2342</p>
                    <p>이메일: info@example.edu</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Industrial AI Talent Development Bootcamp Program. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
}

// Initialize page with header and footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = loadHeader();
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = loadFooter();
    }

    // Reinitialize mobile menu after header is loaded
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');

            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-nav') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');

                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});
