#!/usr/bin/env node

// CMS의 개별 JSON 파일들을 통합 JSON 파일로 병합하는 빌드 스크립트

const fs = require('fs');
const path = require('path');

// 디렉토리의 모든 JSON 파일 읽기
function readAllJsonFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.warn(`디렉토리가 존재하지 않습니다: ${dir}`);
        return [];
    }

    const files = fs.readdirSync(dir);
    const jsonData = [];

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            try {
                const filePath = path.join(dir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                jsonData.push(data);
            } catch (error) {
                console.error(`파일 읽기 실패: ${file}`, error.message);
            }
        }
    });

    return jsonData;
}

// 뉴스 데이터 통합
console.log('뉴스 데이터 통합 중...');
const newsDir = path.join(__dirname, 'data', 'news');
const newsData = readAllJsonFiles(newsDir);

// ID로 정렬 (최신순)
newsData.sort((a, b) => b.id - a.id);

const newsOutputPath = path.join(__dirname, 'data', 'news-data.json');
fs.writeFileSync(newsOutputPath, JSON.stringify(newsData, null, 2));
console.log(`✓ 뉴스 ${newsData.length}개 통합 완료: ${newsOutputPath}`);

// 공지사항 데이터 통합
console.log('공지사항 데이터 통합 중...');
const noticesDir = path.join(__dirname, 'data', 'notices');
const noticesData = readAllJsonFiles(noticesDir);

// ID로 정렬 (최신순)
noticesData.sort((a, b) => b.id - a.id);

const noticesOutputPath = path.join(__dirname, 'data', 'notices-data.json');
fs.writeFileSync(noticesOutputPath, JSON.stringify(noticesData, null, 2));
console.log(`✓ 공지사항 ${noticesData.length}개 통합 완료: ${noticesOutputPath}`);

console.log('\n빌드 완료!');
