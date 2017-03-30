const config = require('./config.json');
const cwd = process.cwd();
const fs = require('fs');
const path = require('path');

const readmePath = path.resolve(cwd, 'README.md');
const papersPath = path.resolve(cwd, 'papers');

const md = fs.readFileSync(readmePath, 'utf8').split('\n');
const papers = fs.readdirSync(papersPath, 'utf8');

function groupingByYear(samples) {
    const dateReg = /(\d{4})-\d{1,2}-\d{1,2}/;
    const result = [];
    const preCache = {};
    samples.forEach(function(it,id) {
        const keys = it.match(dateReg);
        if (keys && keys.length > 1) {
            const year = keys[1];
            if (year !== preCache.year) {
                if (preCache.year) {
                    result.push(Object.assign({}, preCache));
                }
                preCache.year = year;
                preCache.papers = [];
            }
            preCache.papers.push(warpPaper(it));
        }
    })
}
function warpPaper(paper) {
    const result = {};
    let mark = ' ';
    result.finished = checkStatus(paper);
    result.paper = paper;
    result.title = paper.replace(/(\d{4})-\d{1,2}-\d{1,2}|\.md/g, '');
    result.url = config.prefix + paper;
    mark = result.finished ? 'x' : ' ';
    result.item = '- [' + mark + '] ' + result.url;
    return result;
}
function checkStatus(paper) {
    const result = false;
    return result;
}
// const lines = md.split('\n');
groupingByYear(papers);
// console.log(papers);